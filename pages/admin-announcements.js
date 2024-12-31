import { useState, useEffect } from 'react'
import { 
  AppShell, 
  Container, 
  Text, 
  Button, 
  TextInput, 
  Group, 
  Card, 
  Stack,
  Textarea,
  Loader,
  Modal,
  Image
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconX, IconUpload, IconPhoto } from '@tabler/icons-react'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_DURATION = 15 * 60 * 1000

export default function AdminAnnouncements() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [announcements, setAnnouncements] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const form = useForm({
    initialValues: {
      title: '',
      content: '',
      priority: 'normal',
      media: []
    },
    validate: {
      title: (value) => (!value ? 'Title is required' : null),
      content: (value) => (!value ? 'Content is required' : null)
    }
  })

  const editForm = useForm({
    initialValues: {
      id: '',
      title: '',
      content: '',
      priority: 'normal',
      media: []
    },
    validate: {
      title: (value) => (!value ? 'Title is required' : null),
      content: (value) => (!value ? 'Content is required' : null)
    }
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  useEffect(() => {
    const sessionCookie = Cookies.get(SESSION_COOKIE_NAME)
    if (sessionCookie) {
      setIsAuthenticated(true)
    }
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements/all')
      const data = await response.json()
      setAnnouncements(data)
    } catch (error) {
      console.error('Error fetching announcements:', error)
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

  const handleAddAnnouncement = async () => {
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
      title: 'Adding Announcement',
      children: (
        <Stack align="center" spacing="md">
          <Text c="black">Please wait while we add your announcement...</Text>
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

      const response = await fetch('/api/announcements/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form.values,
          media: mediaUrls
        })
      })

      if (!response.ok) throw new Error('Failed to create announcement')

      form.reset()
      fetchAnnouncements()
      
      modals.close(loadingModalId)
      modals.open({
        title: 'Success',
        children: (
          <Stack align="center" spacing="md">
            <IconCheck size={50} color="green" />
            <Text c="black">Announcement added successfully!</Text>
            <Button fullWidth color="green" onClick={() => modals.closeAll()}>
              Close
            </Button>
          </Stack>
        ),
        styles: { title: { color: 'black' } },
      })
    } catch (error) {
      console.error('Error adding announcement:', error)
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

  const handleDeleteAnnouncement = async (announcement) => {
    const confirmed = window.confirm('Are you sure you want to delete this announcement?')
    if (!confirmed) return

    try {
      const response = await fetch('/api/announcements/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: announcement.id
        })
      })

      if (!response.ok) throw new Error('Failed to delete announcement')
      
      notifications.show({
        title: 'Success',
        message: 'Announcement deleted successfully',
        color: 'green'
      })
      
      fetchAnnouncements()
    } catch (error) {
      console.error('Error deleting announcement:', error)
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red'
      })
    }
  }

  const handleEditClick = (announcement) => {
    editForm.setValues({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      media: announcement.media || []
    })
    setEditingAnnouncement(announcement)
    setIsEditing(true)
  }

  const handleUpdateAnnouncement = async () => {
    if (!editForm.validate().hasErrors) {
      const loadingModalId = modals.open({
        title: 'Updating Announcement',
        children: (
          <Stack align="center" spacing="md">
            <Text c="black">Please wait while we update your announcement...</Text>
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
        const mediaItems = editForm.values.media || []

        // Separate new and existing media
        const newMediaItems = mediaItems.filter(media => media.file)
        const existingMediaItems = mediaItems.filter(media => !media.file)

        // Upload new media files in batches
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
        const finalMedia = [
          ...existingMediaItems.map(item => ({
            url: item.url,
            type: item.type
          })),
          ...mediaUrls
        ]

        const response = await fetch('/api/announcements/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editForm.values.id,
            title: editForm.values.title,
            content: editForm.values.content,
            priority: editForm.values.priority,
            media: finalMedia
          })
        })

        if (!response.ok) throw new Error('Failed to update announcement')

        notifications.show({
          title: 'Success',
          message: 'Announcement updated successfully',
          color: 'green'
        })
        
        fetchAnnouncements()
        setIsEditing(false)
      } catch (error) {
        console.error('Error updating announcement:', error)
        notifications.show({
          title: 'Error',
          message: 'Failed to update announcement',
          color: 'red'
        })
      } finally {
        modals.close(loadingModalId)
      }
    }
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

  const handleEditMediaDrop = async (files) => {
    try {
      // Validate total number of media items
      const currentMediaCount = editForm.values.media?.length || 0
      if (currentMediaCount + files.length > 5) {
        notifications.show({
          title: 'Error',
          message: 'Maximum 5 media files allowed',
          color: 'red'
        })
        return
      }

      const newMedia = files.map(file => ({
        file,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        preview: URL.createObjectURL(file),
        url: null // Add this to differentiate new uploads
      }))
      
      editForm.setFieldValue('media', [
        ...(editForm.values.media || []).map(media => ({
          ...media,
          preview: media.url // Ensure existing media has preview set
        })),
        ...newMedia
      ])
    } catch (error) {
      console.error('Error handling media drop:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to process media files',
        color: 'red'
      })
    }
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
          <Text size="xl" weight={700}>Announcement Management</Text>
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
            <Text size="lg" weight={500}>Add New Announcement</Text>
            
            <TextInput
              label="Title"
              placeholder="Enter announcement title"
              {...form.getInputProps('title')}
            />
            
            <Textarea
              label="Content"
              placeholder="Enter announcement content"
              minRows={3}
              {...form.getInputProps('content')}
            />

            <Stack spacing="xs">
              <Text size="sm" weight={500}>Upload Media (Images/Videos)</Text>
              <Dropzone
                onDrop={handleMediaDrop}
                accept={[...IMAGE_MIME_TYPE, 'video/*']}
                maxSize={30 * 1024 ** 2}
              >
                <Stack align="center" spacing="xs">
                  <Group position="center">
                    <IconUpload size={20} />
                    <Text>Drag images/videos here or click to select</Text>
                  </Group>
                  <Text size="xs" color="dimmed">
                    Max 5 files, each up to 30MB
                  </Text>
                </Stack>
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
            </Stack>

            <Button onClick={handleAddAnnouncement}>Add Announcement</Button>
          </Stack>
        </Card>

        <Text size="lg" weight={500} mb="md">Current Announcements</Text>
        <TextInput
          placeholder="Search announcements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          mb="lg"
        />

        <Stack spacing="md">
          {announcements
            .filter(ann => 
              ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              ann.content.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((announcement) => (
              <Card 
                key={announcement.id} 
                shadow="sm" 
                padding="lg" 
                radius="md" 
                withBorder
              >
                <Stack spacing="xs">
                  <Group position="apart">
                    <Text weight={500} size="lg">{announcement.title}</Text>
                    <Text size="sm" color="dimmed">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </Text>
                  </Group>
                  <Text>{announcement.content}</Text>
                  
                  {announcement.media?.length > 0 && (
                    <Group spacing="xs" mt="md" style={{ flexWrap: 'wrap' }}>
                      {announcement.media.map((media, index) => (
                        <Card 
                          key={index} 
                          p="xs" 
                          style={{ 
                            width: 100,
                            flexShrink: 0,
                            position: 'relative'
                          }}
                        >
                          {media.type === 'video' ? (
                            <video
                              src={media.url}
                              style={{ 
                                width: '100%', 
                                height: '80px', 
                                objectFit: 'cover'
                              }}
                              controls
                            />
                          ) : (
                            <Image
                              src={media.url}
                              height={80}
                              width={100}
                              fit="cover"
                              alt={`Announcement media ${index + 1}`}
                            />
                          )}
                        </Card>
                      ))}
                    </Group>
                  )}
                  
                  <Group position="right" mt="md">
                    <Button
                      variant="light"
                      color="blue"
                      onClick={() => handleEditClick(announcement)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="light"
                      color="red"
                      onClick={() => handleDeleteAnnouncement(announcement)}
                    >
                      Delete
                    </Button>
                  </Group>
                </Stack>
              </Card>
            ))}
        </Stack>

        <Modal
          opened={isEditing}
          onClose={() => setIsEditing(false)}
          title="Edit Announcement"
          size="lg"
        >
          <Stack spacing="md">
            <TextInput
              label="Title"
              {...editForm.getInputProps('title')}
            />
            
            <Textarea
              label="Content"
              {...editForm.getInputProps('content')}
              minRows={3}
            />

            <Stack spacing="xs">
              <Text size="sm" weight={500}>Upload Media (Images/Videos)</Text>
              <Dropzone
                onDrop={handleEditMediaDrop}
                accept={[...IMAGE_MIME_TYPE, 'video/*']}
                maxSize={30 * 1024 ** 2}
              >
                <Stack align="center" spacing="xs">
                  <Group position="center">
                    <IconUpload size={20} />
                    <Text>Drag images/videos here or click to select</Text>
                  </Group>
                  <Text size="xs" color="dimmed">
                    Max 5 files, each up to 30MB
                  </Text>
                </Stack>
              </Dropzone>

              {editForm.values.media?.length > 0 && (
                <Stack spacing="xs">
                  <Text size="sm" weight={500}>Media Preview</Text>
                  <Group spacing="xs">
                    {editForm.values.media.map((media, index) => (
                      <Card key={index} p="xs" style={{ width: 100, position: 'relative' }}>
                        {media.type === 'video' ? (
                          <video
                            src={media.preview || media.url}
                            style={{ width: '100%', height: 80, objectFit: 'cover' }}
                          />
                        ) : (
                          <Image
                            src={media.preview || media.url}
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
            </Stack>

            <Button onClick={handleUpdateAnnouncement} color="blue">
              Update Announcement
            </Button>
          </Stack>
        </Modal>
      </Container>
    </AppShell>
  )
} 