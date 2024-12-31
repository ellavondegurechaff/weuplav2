import { useState, useEffect } from 'react'
import { 
  AppShell, 
  Container, 
  Text, 
  Button, 
  TextInput, 
  NumberInput, 
  Group, 
  Card, 
  Image, 
  Stack,
  Select,
  Textarea,
  Loader,
  Modal
} from '@mantine/core'
import { useRouter } from 'next/router'
import { notifications } from '@mantine/notifications'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { IconUpload, IconX, IconPhoto, IconCheck } from '@tabler/icons-react'
import { useForm } from '@mantine/form'
import { rem } from '@mantine/core'
import { modals } from '@mantine/modals'
import { LetterPlaceholder } from '@/components/LetterPlaceholder'
import Cookies from 'js-cookie'
import { MediaCarousel } from '@/components/MediaCarousel'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedMedia, setSelectedMedia] = useState({ url: null, isVideo: false })

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      category_id: null,
      intown_price: '',
      shipped_price: '',
      media: []
    },
    validate: {
      category_id: (value) => (value === null ? 'Please select a category' : null),
      media: (value) => (value.length === 0 ? 'At least one image or video is required' : null)
    }
  })

  const editForm = useForm({
    initialValues: {
      id: '',
      name: '',
      description: '',
      category_id: null,
      intown_price: '',
      shipped_price: '',
      media: []
    },
    validate: {
      category_id: (value) => (value === null ? 'Please select a category' : null),
      media: (value) => (value.length === 0 ? 'At least one image or video is required' : null)
    }
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    const sessionCookie = Cookies.get(SESSION_COOKIE_NAME)
    if (sessionCookie) {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      // Set initial cookie
      Cookies.set(SESSION_COOKIE_NAME, 'true', { 
        expires: new Date(new Date().getTime() + SESSION_DURATION),
        sameSite: 'strict'
      })

      // Refresh cookie every minute
      const intervalId = setInterval(() => {
        const sessionCookie = Cookies.get(SESSION_COOKIE_NAME)
        if (sessionCookie) {
          Cookies.set(SESSION_COOKIE_NAME, 'true', {
            expires: new Date(new Date().getTime() + SESSION_DURATION),
            sameSite: 'strict'
          })
        } else {
          setIsAuthenticated(false)
          clearInterval(intervalId)
        }
      }, 60000) // Check every minute

      return () => clearInterval(intervalId)
    }
  }, [isAuthenticated])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products/all')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleLogin = () => {
    if (password === 'AdminUpWe$2518') {
      setIsAuthenticated(true)
      Cookies.set(SESSION_COOKIE_NAME, 'true', {
        expires: new Date(new Date().getTime() + SESSION_DURATION),
        sameSite: 'strict'
      })
    } else {
      notifications.show({
        title: 'Error',
        message: 'Invalid password',
        color: 'red',
        position: 'top-center'
      })
    }
  }

  const handleImageDrop = (files) => {
    const file = files[0]
    setImageFile(file)
    
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
    
    return () => URL.revokeObjectURL(previewUrl)
  }

  const handleMediaDrop = (files) => {
    const newMedia = files.map(file => ({
      file,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      preview: URL.createObjectURL(file)
    }))
    
    form.setFieldValue('media', [...(form.values.media || []), ...newMedia])
  }

  const handleAddProduct = async () => {
    const validation = form.validate()
    if (validation.hasErrors) {
      notifications.show({
        title: 'Error',
        message: 'Please fill in all required fields',
        color: 'red',
        position: 'top-center'
      })
      return
    }

    const loadingModalId = modals.open({
      title: 'Adding Product',
      children: (
        <Stack align="center" spacing="md">
          <Text c="black">Please wait while we add your product...</Text>
          <Loader size="lg" color="orange" />
        </Stack>
      ),
      styles: {
        title: {
          color: 'black'
        }
      },
      closeOnClickOutside: false,
      closeOnEscape: false,
      withCloseButton: false,
    })

    try {
      const mediaUrls = []
      const BATCH_SIZE = 2 // Upload 2 files at a time
      const mediaItems = form.values.media
      
      // Upload media in batches
      for (let i = 0; i < mediaItems.length; i += BATCH_SIZE) {
        const batch = mediaItems.slice(i, i + BATCH_SIZE)
        const batchFiles = await Promise.all(batch.map(async (mediaItem) => {
          const base64 = await new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result.split(',')[1])
            reader.readAsDataURL(mediaItem.file)
          })
          
          return {
            data: base64,
            type: mediaItem.type === 'video' ? 'video/mp4' : 'image/jpeg'
          }
        }))

        const uploadResponse = await fetch('/api/upload-multiple', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ files: batchFiles })
        })

        if (!uploadResponse.ok) throw new Error('Media upload failed')
        const { urls } = await uploadResponse.json()
        mediaUrls.push(...urls)
      }

      const response = await fetch('/api/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form.values,
          media: mediaUrls
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product')
      }
      
      form.reset()
      setImageFile(null)
      setImagePreview(null)
      fetchProducts()
      
      modals.close(loadingModalId)
      modals.open({
        title: 'Success',
        children: (
          <Stack align="center" spacing="md">
            <IconCheck size={50} color="green" />
            <Text c="black">Product added successfully!</Text>
            <Button fullWidth color="green" onClick={() => modals.closeAll()}>
              Close
            </Button>
          </Stack>
        ),
        styles: {
          title: {
            color: 'black'
          }
        },
      })
    } catch (error) {
      console.error('Error adding product:', error)
      modals.close(loadingModalId)
      modals.open({
        title: 'Error',
        children: (
          <Stack align="center" spacing="md">
            <IconX size={50} color="red" />
            <Text c="black">{error.message}</Text>
            <Button fullWidth color="red" onClick={() => modals.closeAll()}>
              Close
            </Button>
          </Stack>
        ),
        styles: {
          title: {
            color: 'black'
          }
        },
      })
    }
  }

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?')
    if (!confirmed) return

    try {
      const response = await fetch('/api/products/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: product.id,
          image_url: product.image_url
        })
      })

      if (!response.ok) throw new Error('Failed to delete product')
      
      notifications.show({
        title: 'Success',
        message: 'Product deleted successfully',
        color: 'green',
        position: 'top-center'
      })
      
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to delete product',
        color: 'red',
        position: 'top-center'
      })
    }
  }

  const handleEditClick = (product) => {
    setEditingProduct(product)
    setIsEditing(true)
    editForm.setValues({
      id: product.id,
      name: product.name,
      description: product.description,
      category_id: product.category_id.toString(),
      intown_price: product.intown_price,
      shipped_price: product.shipped_price,
      media: product.media || []
    })
    setImagePreview(product.image_url)
  }

  const handleMediaUpload = async (files) => {
    try {
      const newMedia = await Promise.all(files.map(async (file) => {
        const isVideo = file.type.startsWith('video/')
        const url = URL.createObjectURL(file)
        
        return {
          file,
          url,
          type: isVideo ? 'video' : 'image',
          preview: url
        }
      }))

      editForm.setFieldValue('media', [...editForm.values.media, ...newMedia])
    } catch (error) {
      console.error('Error handling media upload:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to process media files',
        color: 'red'
      })
    }
  }

  const handleUpdateProduct = async () => {
    if (!editForm.validate().hasErrors) {
      try {
        const response = await fetch('/api/products/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editForm.values)
        })

        if (!response.ok) throw new Error('Update failed')

        notifications.show({
          title: 'Success',
          message: 'Product updated successfully',
          color: 'green'
        })
        
        setIsEditing(false)
        fetchProducts()
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to update product',
          color: 'red'
        })
      }
    }
  }

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleLogout = () => {
    Cookies.remove(SESSION_COOKIE_NAME)
    setIsAuthenticated(false)
    setPassword('')
  }

  const handleImageClick = (url, isVideo = false) => {
    setSelectedMedia({ url, isVideo })
  }

  if (!isAuthenticated) {
    return (
      <Container size="xs" style={{ marginTop: '20vh' }}>
        <Card shadow="sm" p="xl">
          <Text size="xl" weight={500} mb="md">Admin Login</Text>
          <TextInput
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            type="password"
            mb="md"
          />
          <Button fullWidth onClick={handleLogin}>Login</Button>
        </Card>
      </Container>
    )
  }

  return (
    <AppShell padding="md">
      <Container size="xl" py="xl">
        {isAuthenticated && (
          <Button 
            onClick={handleLogout}
            color="red"
            mb="xl"
          >
            Logout
          </Button>
        )}
        <Text size="xl" weight={700} mb="xl">Admin Dashboard</Text>

        {/* Add Product Form */}
        <Card shadow="sm" p="xl" mb="xl">
          <Text size="lg" weight={500} mb="md">Add New Product</Text>
          <Stack spacing="md">
            <TextInput
              label="Product Name"
              {...form.getInputProps('name')}
            />
            
            <Textarea
              label="Description"
              {...form.getInputProps('description')}
              minRows={8}
              autosize
              maxRows={15}
              styles={{
                input: {
                  whiteSpace: 'pre-wrap'
                }
              }}
            />

            <Select
              label="Category"
              data={categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))}
              {...form.getInputProps('category_id')}
              styles={{
                input: {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  '&:focus': {
                    borderColor: 'var(--mantine-color-orange-6)',
                  },
                },
                dropdown: {
                  backgroundColor: 'white',
                },
                option: {
                  color: 'var(--mantine-color-black)',
                  '&[data-selected]': {
                    backgroundColor: 'var(--mantine-color-orange-6)',
                    color: 'white',
                  },
                  '&[data-hovered]': {
                    backgroundColor: 'var(--mantine-color-orange-1)',
                    color: 'var(--mantine-color-black)',
                  },
                },
              }}
            />

            <NumberInput
              label="In-town Price"
              precision={2}
              min={0}
              {...form.getInputProps('intown_price')}
            />

            <NumberInput
              label="Shipped Price"
              precision={2}
              min={0}
              {...form.getInputProps('shipped_price')}
            />

            <Dropzone
              onDrop={handleMediaDrop}
              accept={{
                'image/*': IMAGE_MIME_TYPE,
                'video/*': ['.mp4', '.webm']
              }}
              maxSize={50 * 1024 ** 2}
              multiple
            >
              <Group position="center" spacing="xl" style={{ minHeight: 120, pointerEvents: 'none' }}>
                <Dropzone.Accept>
                  <IconUpload size={50} stroke={1.5} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size={50} stroke={1.5} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto size={50} stroke={1.5} />
                </Dropzone.Idle>
                <div>
                  <Text size="xl" inline c="black">
                    Drag images or videos here
                  </Text>
                  <Text size="sm" c="black" inline mt={7}>
                    Files should not exceed 50mb
                  </Text>
                </div>
              </Group>
            </Dropzone>

            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Preview"
                height={200}
                fit="contain"
              />
            )}

            {form.values.media?.length > 0 && (
              <Stack spacing="md">
                <Text weight={500}>Media Preview</Text>
                <Group spacing="md">
                  {form.values.media.map((mediaItem, index) => (
                    <Card key={index} p="xs" style={{ width: 150 }}>
                      {mediaItem.type === 'video' ? (
                        <video
                          src={mediaItem.preview}
                          style={{ width: '100%', height: 100, objectFit: 'cover' }}
                          controls
                        />
                      ) : (
                        <Image
                          src={mediaItem.preview}
                          height={100}
                          fit="cover"
                          alt={`Preview ${index + 1}`}
                        />
                      )}
                      <Button 
                        size="xs" 
                        color="red" 
                        fullWidth 
                        mt="xs"
                        onClick={() => {
                          const newMedia = [...form.values.media]
                          newMedia.splice(index, 1)
                          form.setFieldValue('media', newMedia)
                        }}
                      >
                        Remove
                      </Button>
                    </Card>
                  ))}
                </Group>
              </Stack>
            )}

            <Button onClick={handleAddProduct}>Add Product</Button>
          </Stack>
        </Card>

        {/* Products List */}
        <Text size="lg" weight={500} mb="md">Current Products</Text>
        <Container size="md" mb="xl">
          <TextInput
            placeholder="Search products..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            size="lg"
            radius="md"
            styles={{
              input: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                '&:focus': {
                  borderColor: 'var(--mantine-color-orange-6)',
                },
              },
            }}
          />
        </Container>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              shadow="sm" 
              padding="lg" 
              radius="md" 
              withBorder 
              bg="white"
              style={{
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
              }}
            >
              <Card.Section 
                style={{ 
                  cursor: 'pointer',
                  height: '300px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {product.media?.length > 0 ? (
                  <MediaCarousel 
                    media={product.media} 
                    onImageClick={handleImageClick}
                  />
                ) : (
                  <div style={{ height: '100%' }}>
                    <LetterPlaceholder name={product.name} />
                  </div>
                )}
              </Card.Section>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={700} c="black">{product.name}</Text>
                </Group>

                <Group gap="lg" mb="md">
                  <div>
                    <Text size="sm" fw={700} c="dark">In-town</Text>
                    <Text size="xl" fw={700} c="green.6">
                      ${product.intown_price}
                    </Text>
                  </div>
                  <div>
                    <Text size="sm" fw={700} c="dark">Shipped</Text>
                    <Text size="xl" fw={700} c="orange.6">
                      ${product.shipped_price}
                    </Text>
                  </div>
                </Group>

                <Text 
                  size="sm" 
                  c="dimmed" 
                  mb="md" 
                  style={{ 
                    flex: 1,
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {product.description}
                </Text>

                <Button 
                  variant="filled" 
                  color="blue" 
                  fullWidth 
                  onClick={() => handleEditClick(product)}
                  mb="sm"
                >
                  Edit
                </Button>

                <Button 
                  variant="filled" 
                  color="red" 
                  fullWidth 
                  onClick={() => handleDeleteProduct(product)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>

      {isEditing && (
        <Modal
          opened={isEditing}
          onClose={() => {
            setIsEditing(false)
            setEditingProduct(null)
            setImageFile(null)
            setImagePreview(null)
          }}
          title="Edit Product"
          size="lg"
          styles={{
            title: { color: 'black' }
          }}
        >
          <Stack spacing="md">
            <TextInput
              label="Product Name"
              {...editForm.getInputProps('name')}
              styles={{
                input: { color: 'black' },
                label: { color: 'black' }
              }}
            />
            
            <Textarea
              label="Description"
              {...editForm.getInputProps('description')}
              minRows={8}
              autosize
              maxRows={15}
              styles={{
                input: { 
                  color: 'black',
                  whiteSpace: 'pre-wrap'
                },
                label: { color: 'black' }
              }}
            />

            <Select
              label="Category"
              data={categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))}
              {...editForm.getInputProps('category_id')}
              styles={{
                input: { color: 'black' },
                label: { color: 'black' },
                item: { color: 'black' }
              }}
            />

            <NumberInput
              label="In-town Price"
              precision={2}
              min={0}
              {...editForm.getInputProps('intown_price')}
              styles={{
                input: { color: 'black' },
                label: { color: 'black' }
              }}
            />

            <NumberInput
              label="Shipped Price"
              precision={2}
              min={0}
              {...editForm.getInputProps('shipped_price')}
              styles={{
                input: { color: 'black' },
                label: { color: 'black' }
              }}
            />

            <Dropzone
              onDrop={handleMediaUpload}
              accept={{
                'image/*': IMAGE_MIME_TYPE,
                'video/*': ['.mp4', '.mov']
              }}
              maxSize={50 * 1024 ** 2}
              maxFiles={5}
              multiple
              disabled={editForm.values.media.length >= 5}
            >
              <Group position="center" spacing="xl" style={{ minHeight: 120, pointerEvents: 'none' }}>
                <Dropzone.Accept>
                  <IconUpload size={50} stroke={1.5} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size={50} stroke={1.5} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto size={50} stroke={1.5} />
                </Dropzone.Idle>
                <div>
                  <Text size="xl" inline c="black">
                    Drag images or videos here or click to select ({editForm.values.media.length}/5)
                  </Text>
                  <Text size="sm" c="black" inline mt={7}>
                    Files should not exceed 50mb
                  </Text>
                </div>
              </Group>
            </Dropzone>

            {editForm.values.media.length > 0 && (
              <Stack spacing="xs">
                <Text size="sm" weight={500} c="dimmed">Current Media ({editForm.values.media.length}/5)</Text>
                <Group spacing="xs" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {editForm.values.media.map((media, index) => (
                    <Card 
                      key={index}
                      padding="xs"
                      radius="sm"
                      style={{ width: '100px', position: 'relative' }}
                    >
                      {media.type === 'video' ? (
                        <video 
                          src={media.url} 
                          style={{ 
                            width: '100%', 
                            height: '80px', 
                            objectFit: 'cover' 
                          }} 
                          onClick={() => handleImageClick(media.url, true)}
                        />
                      ) : (
                        <Image 
                          src={media.url} 
                          height={80} 
                          width={100} 
                          fit="cover" 
                          radius="xs"
                          onClick={() => handleImageClick(media.url, false)}
                        />
                      )}
                      <Button 
                        color="red" 
                        variant="subtle"
                        compact
                        style={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          padding: '2px',
                          minWidth: 'unset',
                          height: 'unset'
                        }}
                        onClick={() => {
                          const newMedia = [...editForm.values.media]
                          newMedia.splice(index, 1)
                          editForm.setFieldValue('media', newMedia)
                        }}
                      >
                        <IconX size={14} />
                      </Button>
                    </Card>
                  ))}
                </Group>
              </Stack>
            )}

            <Button onClick={handleUpdateProduct} color="blue">
              Update Product
            </Button>
          </Stack>
        </Modal>
      )}

      <Modal
        opened={!!selectedMedia.url}
        onClose={() => setSelectedMedia({ url: null, isVideo: false })}
        size="xl"
        padding={0}
        styles={{
          modal: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
          header: {
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: 1000,
          }
        }}
      >
        {selectedMedia.isVideo ? (
          <video
            src={selectedMedia.url}
            controls
            autoPlay
            style={{
              width: '100%',
              height: '90vh',
              objectFit: 'contain',
              backgroundColor: 'rgba(0, 0, 0, 0.8)'
            }}
          />
        ) : (
          <Image
            src={selectedMedia.url}
            alt="Full size preview"
            fit="contain"
            height="90vh"
          />
        )}
      </Modal>
    </AppShell>
  )
} 