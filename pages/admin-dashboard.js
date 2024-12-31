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

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      category_id: null,
      intown_price: '',
      shipped_price: '',
      image_url: ''
    },
    validate: {
      category_id: (value) => (value === null ? 'Please select a category' : null)
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
      image_url: ''
    },
    validate: {
      category_id: (value) => (value === null ? 'Please select a category' : null)
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
      let imageUrl = form.values.image_url
      
      if (imageFile) {
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result.split(',')[1])
          reader.readAsDataURL(imageFile)
        })

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: base64
        })

        if (!uploadResponse.ok) throw new Error('Image upload failed')
        const { url } = await uploadResponse.json()
        imageUrl = url
      }

      const response = await fetch('/api/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...form.values,
          image_url: imageUrl
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
      image_url: product.image_url
    })
    setImagePreview(product.image_url)
  }

  const handleUpdateProduct = async () => {
    const validation = editForm.validate()
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
      title: 'Updating Product',
      children: (
        <Stack align="center" spacing="md">
          <Text c="black">Please wait while we update your product...</Text>
          <Loader size="lg" color="orange" />
        </Stack>
      ),
      styles: {
        title: { color: 'black' }
      },
      closeOnClickOutside: false,
      closeOnEscape: false,
      withCloseButton: false,
    })

    try {
      let imageUrl = editForm.values.image_url
      
      if (imageFile) {
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result.split(',')[1])
          reader.readAsDataURL(imageFile)
        })

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: base64
        })

        if (!uploadResponse.ok) throw new Error('Image upload failed')
        const { url } = await uploadResponse.json()
        imageUrl = url
      }

      const response = await fetch('/api/products/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm.values,
          image_url: imageUrl
        })
      })

      if (!response.ok) throw new Error('Failed to update product')

      setIsEditing(false)
      setEditingProduct(null)
      setImageFile(null)
      setImagePreview(null)
      fetchProducts()
      
      modals.close(loadingModalId)
      notifications.show({
        title: 'Success',
        message: 'Product updated successfully',
        color: 'green',
        position: 'top-center'
      })
    } catch (error) {
      console.error('Error updating product:', error)
      modals.close(loadingModalId)
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update product',
        color: 'red',
        position: 'top-center'
      })
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

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl)
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
              onDrop={handleImageDrop}
              accept={IMAGE_MIME_TYPE}
              maxSize={10 * 1024 ** 2}
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
                    Drag image here or click to select
                  </Text>
                  <Text size="sm" c="black" inline mt={7}>
                    File should not exceed 3mb
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
                flexDirection: 'column'
              }}
            >
              <Card.Section style={{ cursor: 'pointer' }} onClick={() => handleImageClick(product.image_url)}>
                {product.image_url && product.image_url.trim() ? (
                  <Image
                    src={product.image_url}
                    height={200}
                    alt={product.name}
                  />
                ) : (
                  <div style={{ height: 200 }}>
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
              onDrop={handleImageDrop}
              accept={IMAGE_MIME_TYPE}
              maxSize={10 * 1024 ** 2}
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
                    Drag image here or click to select
                  </Text>
                  <Text size="sm" c="black" inline mt={7}>
                    File should not exceed 3mb
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

            <Button onClick={handleUpdateProduct} color="blue">
              Update Product
            </Button>
          </Stack>
        </Modal>
      )}

      <Modal
        opened={!!selectedImage}
        onClose={() => setSelectedImage(null)}
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
        <Image
          src={selectedImage}
          alt="Full size preview"
          fit="contain"
          height="90vh"
        />
      </Modal>
    </AppShell>
  )
} 