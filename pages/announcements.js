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
  Badge,
  ActionIcon
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Head from 'next/head'
import SidePanel from '@/components/SidePanel'
import { MediaCarousel } from '@/components/MediaCarousel'
import { LetterPlaceholder } from '@/components/LetterPlaceholder'
import { IconX } from '@tabler/icons-react'
import { useGesture } from '@use-gesture/react'
import { SITE_TITLE } from '@/utils/constants'

export default function AnnouncementsPage() {
  const [opened, { toggle: toggleNav, close: closeNav }] = useDisclosure()
  const [announcements, setAnnouncements] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMedia, setSelectedMedia] = useState({ url: null, isVideo: false })
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const bind = useGesture({
    onPinch: ({ offset: [scale], event }) => {
      event.preventDefault()
      setScale(Math.min(Math.max(0.5, scale), 4))
    },
    onDrag: ({ movement: [x, y], pinching }) => {
      if (scale > 1 && !pinching) {
        setPosition({ x, y })
      }
    },
    onPinchEnd: () => {
      if (scale <= 1) {
        setScale(1)
        setPosition({ x: 0, y: 0 })
      }
    }
  })

  const resetZoom = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

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
        <title>{SITE_TITLE} - Announcements</title>
      </Head>
      <AppShell
        header={{ height: 60 }}
        padding="0"
        style={{ backgroundColor: 'transparent' }}
      >
        <AppShell.Header>
          <Group h="100%" px="md" style={{ justifyContent: 'space-between' }}>
            <Burger opened={opened} onClick={toggleNav} size="sm" color="#f97316" />
            <div style={{ width: 24 }} /> {/* Keep the placeholder for symmetry */}
          </Group>
        </AppShell.Header>

        <SidePanel opened={opened} onClose={closeNav} />
        
        <AppShell.Main>
          <Container size="xl" py="xl">
            <Container size="md" mb="xl">
              <div className="flex justify-center -mt-4 mb-0">
                <Image
                  src="/announcements.png"
                  alt="Announcements"
                  width={380}
                  height={77}
                  priority
                  className="w-[320px] h-[65px] sm:w-[380px] sm:h-[77px] md:w-[420px] md:h-[86px] lg:w-[480px] lg:h-[98px] object-contain"
                />
              </div>

              <TextInput
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                radius="md"
                styles={{
                  input: {
                    backgroundColor: 'white',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    '&:focus': {
                      borderColor: 'var(--mantine-color-orange-6)',
                    },
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                }}
              />
              
              <div className="flex justify-center mt-4">
                <a 
                  href="/allproducts" 
                  className="inline-block bg-transparent text-white px-8 py-3 rounded-md hover:bg-white/10 transition-colors outline outline-3 outline-white font-semibold"
                >
                  VIEW MENU
                </a>
              </div>
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
                      flexDirection: 'column',
                      borderWidth: '7px'
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
                      <Group justify="space-between" mt="md" mb="xs" style={{ alignItems: 'flex-start' }}>
                        <Text fw={700} c="black" style={{ flex: 1, marginRight: '8px' }}>
                          {announcement.title}
                        </Text>
                        <Group gap="xs" style={{ flexShrink: 0 }}>
                          <Badge 
                            variant="light" 
                            color="gray"
                            style={{ flexShrink: 0 }}
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
                        </Group>
                      </Group>

                      <Text 
                        size="sm" 
                        c="dimmed" 
                        mb="md"
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

                      <Group gap="lg">
                        <Text size="sm" c="dimmed">
                          {new Date(announcement.created_at).toLocaleDateString()}
                        </Text>
                      </Group>
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
          size="100vw"
          fullScreen
          padding={0}
          withCloseButton={false}
          styles={{
            modal: {
              background: 'none',
              boxShadow: 'none',
              maxWidth: '100%',
              width: '100%',
              height: '100vh',
              margin: 0,
            },
            header: {
              display: 'none',
            },
            body: {
              padding: 0,
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
            },
            inner: {
              padding: 0,
              margin: 0,
            },
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
            },
            content: {
              background: 'none',
            }
          }}
        >
          <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            position: 'relative',
          }}>
            <ActionIcon
              onClick={() => setSelectedMedia({ url: null, isVideo: false })}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 1000,
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                borderRadius: '50%',
              }}
              size="lg"
            >
              <IconX size={18} />
            </ActionIcon>

            {selectedMedia.isVideo ? (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                style={{
                  maxWidth: '100%',
                  maxHeight: '100vh',
                  objectFit: 'contain',
                  background: 'none',
                }}
              />
            ) : (
              <div
                {...bind()}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'none',
                }}
              >
                <Image
                  src={selectedMedia.url}
                  alt="Full size preview"
                  fit="contain"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100vh',
                    transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                    transition: scale === 1 ? 'all 0.3s ease' : 'none',
                    background: 'none',
                  }}
                  onDoubleClick={resetZoom}
                />
              </div>
            )}
          </div>
        </Modal>
      </AppShell>
    </>
  )
} 