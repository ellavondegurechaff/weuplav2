import { useState, useEffect } from 'react'
import { 
  AppShell, 
  Container, 
  Text, 
  Button, 
  TextInput, 
  Group, 
  Card, 
  Image, 
  Stack,
  Textarea,
  Loader,
  Modal
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { IconUpload, IconX, IconPhoto, IconCheck } from '@tabler/icons-react'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { LetterPlaceholder } from '@/components/LetterPlaceholder'
import Cookies from 'js-cookie'
import { MediaCarousel } from '@/components/MediaCarousel'
import { useRouter } from 'next/router'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_DURATION = 15 * 60 * 1000

export default function AdminTouchdown() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [touchdowns, setTouchdowns] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [editingTouchdown, setEditingTouchdown] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState({ url: null, isVideo: false })
  const router = useRouter()

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      media: []
    },
    validate: {
      title: (value) => (!value ? 'Title is required' : null),
      media: (value) => (value.length === 0 ? 'At least one image or video is required' : null)
    }
  })

  const editForm = useForm({
    initialValues: {
      id: '',
      title: '',
      description: '',
      media: []
    },
    validate: {
      title: (value) => (!value ? 'Title is required' : null),
      media: (value) => (value.length === 0 ? 'At least one image or video is required' : null)
    }
  })

  useEffect(() => {
    fetchTouchdowns()
  }, [])

  useEffect(() => {
    const sessionCookie = Cookies.get(SESSION_COOKIE_NAME)
    if (sessionCookie) {
      setIsAuthenticated(true)
    }
  }, [])

  const fetchTouchdowns = async () => {
    try {
      const response = await fetch('/api/touchdowns/all')
      const data = await response.json()
      setTouchdowns(data)
    } catch (error) {
      console.error('Error fetching touchdowns:', error)
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

  const handleMediaDrop = async (files) => {
    try {
      const newMedia = files.map(file => ({
        file,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        preview: URL.createObjectURL(file)
      }))
      
      form.setFieldValue('media', [...(form.values.media || []), ...newMedia])
    } catch (error) {
      console.error('Error handling media drop:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to process media files',
        color: 'red'
      })
    }
  }

  const handleAddTouchdown = async () => {
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
      title: 'Adding Touchdown',
      children: (
        <Stack align="center" spacing="md">
          <Text c="black">Please wait while we add your touchdown...</Text>
          <Loader size="lg" color="orange" />
        </Stack>
      ),
      styles: { title: { color: 'black' } },
      closeOnClickOutside: false,
      closeOnEscape: false,
      withCloseButton: false,
    })

    try {
      const mediaUrls = []
      const BATCH_SIZE = 2
      const mediaItems = form.values.media
      
      for (let i = 0; i < mediaItems.length; i += BATCH_SIZE) {
        const batch = mediaItems.slice(i, i + BATCH_SIZE)
        const uploadPromises = batch.map(async (mediaItem) => {
          const response = await fetch('/api/generate-upload-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileType: mediaItem.file.type,
              fileName: mediaItem.file.name
            })
          })

          if (!response.ok) throw new Error('Failed to get upload URL')

          const { presignedUrl, fileUrl } = await response.json()

          await fetch(presignedUrl, {
            method: 'PUT',
            body: mediaItem.file,
            headers: {
              'Content-Type': mediaItem.file.type,
              'x-amz-acl': 'public-read',
              'x-amz-content-sha256': 'UNSIGNED-PAYLOAD'
            },
            mode: 'cors'
          })

          return {
            url: fileUrl,
            type: mediaItem.type
          }
        })

        const uploadedBatch = await Promise.all(uploadPromises)
        mediaUrls.push(...uploadedBatch)
      }

      const response = await fetch('/api/touchdowns/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form.values,
          media: mediaUrls
        })
      })

      if (!response.ok) throw new Error('Failed to create touchdown')

      form.reset()
      fetchTouchdowns()
      
      modals.close(loadingModalId)
      modals.open({
        title: 'Success',
        children: (
          <Stack align="center" spacing="md">
            <IconCheck size={50} color="green" />
            <Text c="black">Touchdown added successfully!</Text>
            <Button fullWidth color="green" onClick={() => modals.closeAll()}>
              Close
            </Button>
          </Stack>
        ),
        styles: { title: { color: 'black' } },
      })
    } catch (error) {
      console.error('Error adding touchdown:', error)
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
        styles: { title: { color: 'black' } },
      })
    }
  }

  const handleDeleteTouchdown = async (touchdown) => {
    const confirmed = window.confirm('Are you sure you want to delete this touchdown?')
    if (!confirmed) return

    try {
      const response = await fetch('/api/touchdowns/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: touchdown.id
        })
      })

      if (!response.ok) throw new Error('Failed to delete touchdown')
      
      notifications.show({
        title: 'Success',
        message: 'Touchdown deleted successfully',
        color: 'green'
      })
      
      fetchTouchdowns()
    } catch (error) {
      console.error('Error deleting touchdown:', error)
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red'
      })
    }
  }

  const handleEditClick = (touchdown) => {
    // Format media to include type and preview properties
    const formattedMedia = touchdown.media.map(media => ({
      ...media,
      type: media.media_type || (media.url.match(/\.(mpmov)$/i) ? 'video' : 'image'),
      preview: media.url // Use the existing URL as preview for existing media
    }))

    editForm.setValues({
      id: touchdown.id,
      title: touchdown.title,
      description: touchdown.description,
      media: formattedMedia
    })
    setEditingTouchdown(touchdown)
    setIsEditing(true)
  }

  const handleEditMediaDrop = async (files) => {
    try {
      const newMedia = files.map(file => ({
        file,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        preview: URL.createObjectURL(file)
      }))
      
      const currentMedia = editForm.values.media || []
      if (currentMedia.length + newMedia.length > 5) {
        notifications.show({
          title: 'Error',
          message: 'Maximum 5 media files allowed',
          color: 'red'
        })
        return
      }
      
      editForm.setFieldValue('media', [...currentMedia, ...newMedia])
    } catch (error) {
      console.error('Error handling media drop:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to process media files',
        color: 'red'
      })
    }
  }

  const handleUpdateTouchdown = async () => {
    if (!editForm.validate().hasErrors) {
      const loadingModalId = modals.open({
        title: 'Updating Touchdown',
        children: (
          <Stack align="center" spacing="md">
            <Text c="black">Please wait while we update your touchdown...</Text>
            <Loader size="lg" color="orange" />
          </Stack>
        ),
        styles: { title: { color: 'black' } },
        closeOnClickOutside: false,
        closeOnEscape: false,
        withCloseButton: false,
      })

      try {
        const mediaUrls = []
        const BATCH_SIZE = 2
        const mediaItems = editForm.values.media

        // Only upload new media files (ones with 'file' property)
        const newMediaItems = mediaItems.filter(media => media.file)
        const existingMediaItems = mediaItems.filter(media => !media.file)

        for (let i = 0; i < newMediaItems.length; i += BATCH_SIZE) {
          const batch = newMediaItems.slice(i, i + BATCH_SIZE)
          const uploadPromises = batch.map(async (mediaItem) => {
            const response = await fetch('/api/generate-upload-url', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fileType: mediaItem.file.type,
                fileName: mediaItem.file.name
              })
            })

            if (!response.ok) throw new Error('Failed to get upload URL')

            const { presignedUrl, fileUrl } = await response.json()

            await fetch(presignedUrl, {
              method: 'PUT',
              body: mediaItem.file,
              headers: {
                'Content-Type': mediaItem.file.type,
                'x-amz-acl': 'public-read',
                'x-amz-content-sha256': 'UNSIGNED-PAYLOAD'
              },
              mode: 'cors'
            })

            return {
              url: fileUrl,
              type: mediaItem.type
            }
          })

          const uploadedBatch = await Promise.all(uploadPromises)
          mediaUrls.push(...uploadedBatch)
        }

        // Combine existing and new media
        const allMedia = [...existingMediaItems, ...mediaUrls]

        const response = await fetch('/api/touchdowns/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editForm.values.id,
            title: editForm.values.title,
            description: editForm.values.description,
            media: allMedia
          })
        })

        if (!response.ok) throw new Error('Failed to update touchdown')

        notifications.show({
          title: 'Success',
          message: 'Touchdown updated successfully',
          color: 'green'
        })

        modals.close(loadingModalId)
        setIsEditing(false)
        fetchTouchdowns()
      } catch (error) {
        console.error('Error updating touchdown:', error)
        modals.close(loadingModalId)
        notifications.show({
          title: 'Error',
          message: error.message,
          color: 'red'
        })
      }
    }
  }

  const handleImageClick = (url, isVideo = false) => {
    setSelectedMedia({ url, isVideo })
  }

  const handleLogout = () => {
    Cookies.remove(SESSION_COOKIE_NAME)
    setIsAuthenticated(false)
    notifications.show({
      title: 'Success',
      message: 'Logged out successfully',
      color: 'green',
      position: 'top-center'
    })
  }

  if (!isAuthenticated) {
    return (
      <Container size="xs" style={{ marginTop: '20vh' }}>
        <Card shadow="sm" p="xl">
          <Stack>
            <Text size="xl" weight={500} align="center">Admin Login</Text>
            <TextInput
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin}>Login</Button>
          </Stack>
        </Card>
      </Container>
    )
  }

  return (
    <AppShell padding="md">
      <Container size="lg">
        <Group position="apart" mb="xl">
          <Text size="xl" weight={700}>Touchdown Management</Text>
          <Group>
            <Button 
              onClick={() => router.push('/admin-dashboard')} 
              color="blue"
            >
              Manage Products
            </Button>
            <Button onClick={handleLogout} color="red">Logout</Button>
          </Group>
        </Group>

        <Card shadow="sm" p="lg" mb="xl">
          <Stack spacing="md">
            <Text size="lg" weight={500}>Add New Touchdown</Text>
            
            <TextInput
              label="Title"
              placeholder="Enter touchdown title"
              {...form.getInputProps('title')}
            />
            
            <Textarea
              label="Description"
              placeholder="Enter touchdown description"
              minRows={3}
              {...form.getInputProps('description')}
            />

            <Dropzone
              onDrop={handleMediaDrop}
              accept={{
                'image/*': IMAGE_MIME_TYPE,
                'video/*': ['.mp4', '.mov']
              }}
              maxSize={50 * 1024 ** 2}
              maxFiles={5}
              multiple
              disabled={form.values.media?.length >= 5}
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
                    Drag images or videos here ({form.values.media?.length || 0}/5)
                  </Text>
                  <Text size="sm" c="black" inline mt={7}>
                    Files should not exceed 50mb
                  </Text>
                </div>
              </Group>
            </Dropzone>

            {form.values.media?.length > 0 && (
              <Stack spacing="xs">
                <Text size="sm" weight={500}>Media Preview</Text>
                <Group spacing="xs">
                  {form.values.media.map((media, index) => (
                    <Card key={index} p="xs" style={{ width: 100, position: 'relative' }}>
                      {media.type === 'video' ? (
                        <video
                          src={media.preview}
                          style={{ width: '100%', height: 80, objectFit: 'cover' }}
                        />
                      ) : (
                        <Image
                          src={media.preview}
                          height={80}
                          fit="cover"
                          alt={`Preview ${index + 1}`}
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
                          const newMedia = [...form.values.media]
                          newMedia.splice(index, 1)
                          form.setFieldValue('media', newMedia)
                        }}
                      >
                        <IconX size={14} />
                      </Button>
                    </Card>
                  ))}
                </Group>
              </Stack>
            )}

            <Button onClick={handleAddTouchdown}>Add Touchdown</Button>
          </Stack>
        </Card>

        <Text size="lg" weight={500} mb="md">Current Touchdowns</Text>
        <TextInput
          placeholder="Search touchdowns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          mb="lg"
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {touchdowns
            .filter(td => 
              td.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              td.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((touchdown) => (
              <Card 
                key={touchdown.id} 
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
                <Card.Section 
                  style={{ 
                    cursor: 'pointer',
                    height: '300px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {touchdown.media?.length > 0 ? (
                    <MediaCarousel 
                      media={touchdown.media} 
                      onImageClick={handleImageClick}
                    />
                  ) : (
                    <div style={{ height: '100%' }}>
                      <LetterPlaceholder name={touchdown.title} />
                    </div>
                  )}
                </Card.Section>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Text weight={500} size="lg" mt="md">{touchdown.title}</Text>
                  <Text 
                    size="sm" 
                    c="dimmed" 
                    mt="xs"
                    style={{ 
                      flex: 1,
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {touchdown.description}
                  </Text>

                  <Group mt="md" grow>
                    <Button
                      variant="filled"
                      color="blue"
                      onClick={() => handleEditClick(touchdown)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="filled"
                      color="red"
                      onClick={() => handleDeleteTouchdown(touchdown)}
                    >
                      Delete
                    </Button>
                  </Group>
                </div>
              </Card>
            ))}
        </div>

        <Modal
          opened={isEditing}
          onClose={() => setIsEditing(false)}
          title="Edit Touchdown"
          size="lg"
          styles={{
            title: { color: 'black' },
            body: { color: 'black' }
          }}
        >
          <Stack spacing="md">
            <TextInput
              label="Title"
              {...editForm.getInputProps('title')}
              styles={{ label: { color: 'black' } }}
            />
            
            <Textarea
              label="Description"
              {...editForm.getInputProps('description')}
              minRows={3}
              styles={{ label: { color: 'black' } }}
            />

            <Dropzone
              onDrop={handleEditMediaDrop}
              accept={{
                'image/*': IMAGE_MIME_TYPE,
                'video/*': ['.mp4', '.mov']
              }}
              maxSize={50 * 1024 ** 2}
              maxFiles={5}
              multiple
              disabled={editForm.values.media?.length >= 5}
            >
              <Group position="center" spacing="xl" style={{ minHeight: 120, pointerEvents: 'none' }}>
                <Dropzone.Accept>
                  <IconUpload size={50} stroke={1.5} color="black" />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size={50} stroke={1.5} color="red" />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto size={50} stroke={1.5} color="black" />
                </Dropzone.Idle>
                <div>
                  <Text size="xl" inline c="black">
                    Drag images or videos here ({editForm.values.media?.length || 0}/5)
                  </Text>
                  <Text size="sm" c="black" inline mt={7}>
                    Files should not exceed 50mb
                  </Text>
                </div>
              </Group>
            </Dropzone>

            {editForm.values.media?.length > 0 && (
              <Stack spacing="xs">
                <Text size="sm" weight={500} c="black">Current Media ({editForm.values.media.length}/5)</Text>
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
                          src={media.preview || media.url} 
                          style={{ 
                            width: '100%', 
                            height: '80px', 
                            objectFit: 'cover' 
                          }} 
                          onClick={() => handleImageClick(media.preview || media.url, true)}
                        />
                      ) : (
                        <Image 
                          src={media.preview || media.url} 
                          height={80} 
                          width={100} 
                          fit="cover" 
                          radius="xs"
                          onClick={() => handleImageClick(media.preview || media.url, false)}
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

            <Button onClick={handleUpdateTouchdown} color="blue">
              Update Touchdown
            </Button>
          </Stack>
        </Modal>

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
      </Container>
    </AppShell>
  )
} 