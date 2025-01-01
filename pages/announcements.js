import { useState, useEffect } from 'react'
import { 
  AppShell, 
  Container, 
  Text, 
  Card, 
  Image, 
  Group,
  TextInput,
  Grid,
  Modal,
  Burger,
  Badge
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Head from 'next/head'
import SidePanel from '@/components/SidePanel'
import { MediaCarousel } from '@/components/MediaCarousel'
import { LetterPlaceholder } from '@/components/LetterPlaceholder'

export default function AnnouncementsPage() {
  const [opened, { toggle: toggleNav, close: closeNav }] = useDisclosure()
  const [announcements, setAnnouncements] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMedia, setSelectedMedia] = useState({ url: null, isVideo: false })

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const response = await fetch('/api/announcements/all')
        const data = await response.json()
        setAnnouncements(data)
      } catch (error) {
        console.error('Error fetching announcements:', error)
      }
    }
    fetchAnnouncements()
  }, [])

  const handleImageClick = async (url, isVideo = false, announcementId) => {
    setSelectedMedia({ url, isVideo })
    
    try {
      const response = await fetch('/api/announcements/track-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ announcementId })
      })
      
      if (!response.ok) {
        throw new Error('Failed to track view')
      }

      const { views } = await response.json()
      
      // Update the view count in the announcements state
      setAnnouncements(prevAnnouncements => 
        prevAnnouncements.map(announcement => 
          announcement.id === announcementId 
            ? { ...announcement, view_count: views }
            : announcement
        )
      )
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'red'
      case 'important': return 'orange'
      default: return null
    }
  }

  const filteredAnnouncements = announcements.filter(announcement => 
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Head>
        <title>GOODSHOP - Announcements</title>
      </Head>
      <AppShell
        header={{ height: 60 }}
        padding="0"
        style={{ backgroundColor: 'transparent' }}
      >
        <AppShell.Header>
          <Group h="100%" px="md" style={{ justifyContent: 'space-between' }}>
            <Burger opened={opened} onClick={toggleNav} size="sm" color="#f97316" />
            <Text size="xl" fw={700} c="black">Announcements</Text>
            <div style={{ width: 24 }} /> {/* Placeholder for symmetry */}
          </Group>
        </AppShell.Header>

        <SidePanel opened={opened} onClose={closeNav} />
        
        <AppShell.Main>
          <Container size="xl" py="xl">
            <Container size="md" mb="xl">
              <TextInput
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                radius="md"
                styles={{
                  input: {
                    backgroundColor: 'white',
                    '&:focus': {
                      borderColor: 'var(--mantine-color-orange-6)',
                    },
                  },
                }}
              />
            </Container>

            <Grid>
              {filteredAnnouncements.map((announcement) => (
                <Grid.Col key={announcement.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                  <Card 
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
                      {announcement.media?.length > 0 ? (
                        <Card.Section>
                          <MediaCarousel 
                            media={announcement.media} 
                            onImageClick={(url, isVideo) => handleImageClick(url, isVideo, announcement.id)}
                          />
                        </Card.Section>
                      ) : (
                        <div style={{ height: '100%' }}>
                          <LetterPlaceholder name={announcement.title} />
                        </div>
                      )}
                    </Card.Section>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={700} c="black">{announcement.title}</Text>
                        <Group spacing="xs">
                          <Badge 
                            variant="light" 
                            color="gray"
                            leftSection={
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            }
                          >
                            {announcement.view_count || 0}
                          </Badge>
                          {announcement.priority !== 'normal' && (
                            <Badge color={getPriorityColor(announcement.priority)}>
                              {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                            </Badge>
                          )}
                          <Text size="sm" c="dimmed">
                            {new Date(announcement.created_at).toLocaleDateString()}
                          </Text>
                        </Group>
                      </Group>

                      <Text 
                        size="sm" 
                        c="dimmed" 
                        style={{ 
                          flex: 1,
                          whiteSpace: 'pre-wrap',
                          position: 'relative'
                        }}
                      >
                        {announcement.content.length > 150 ? (
                          <>
                            <div style={{
                              maxHeight: '4.5em',
                              overflow: 'hidden',
                              display: announcement.isExpanded ? 'none' : 'block'
                            }}>
                              {announcement.content.slice(0, 150)}...
                            </div>
                            <div style={{
                              display: announcement.isExpanded ? 'block' : 'none'
                            }}>
                              {announcement.content}
                            </div>
                            <Text 
                              size="sm" 
                              c="orange" 
                              style={{ 
                                cursor: 'pointer',
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                background: 'white',
                                paddingLeft: '4px'
                              }}
                              onClick={(e) => {
                                e.stopPropagation()
                                setAnnouncements(prev => prev.map(a => 
                                  a.id === announcement.id 
                                    ? { ...a, isExpanded: !a.isExpanded }
                                    : a
                                ))
                              }}
                            >
                              {announcement.isExpanded ? 'Show less' : 'Read more'}
                            </Text>
                          </>
                        ) : (
                          announcement.content
                        )}
                      </Text>
                    </div>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Container>
        </AppShell.Main>

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
    </>
  )
} 