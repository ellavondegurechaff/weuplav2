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
import { ShoppingCart } from 'lucide-react'
import Head from 'next/head'
import SidePanel from '@/components/SidePanel'
import CartSidebar from '@/components/CartSidebar'
import { MediaCarousel } from '@/components/MediaCarousel'
import { LetterPlaceholder } from '@/components/LetterPlaceholder'
import { NavHeader } from '@/components/NavHeader'
import { useGesture } from '@use-gesture/react'
import { IconX } from '@tabler/icons-react'
import { SITE_TITLE } from '@/utils/constants'

export default function TouchdownsPage() {
  const [opened, { toggle: toggleNav, close: closeNav }] = useDisclosure()
  const [touchdowns, setTouchdowns] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
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
    async function fetchTouchdowns() {
      try {
        const response = await fetch('/api/touchdowns/all')
        const data = await response.json()
        setTouchdowns(data)
      } catch (error) {
        console.error('Error fetching touchdowns:', error)
      }
    }
    fetchTouchdowns()
  }, [])

  const handleImageClick = async (url, isVideo = false, touchdownId) => {
    setSelectedMedia({ url, isVideo })
    
    try {
      const response = await fetch('/api/touchdowns/track-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ touchdownId })
      })
      
      if (!response.ok) {
        throw new Error('Failed to track view')
      }

      const { views } = await response.json()
      
      // Update the view count in the touchdowns state
      setTouchdowns(prevTouchdowns => 
        prevTouchdowns.map(touchdown => 
          touchdown.id === touchdownId 
            ? { ...touchdown, view_count: views }
            : touchdown
        )
      )
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }

  const filteredTouchdowns = touchdowns.filter(touchdown => 
    touchdown.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    touchdown.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Head>
        <title>{SITE_TITLE} - Touchdown</title>
      </Head>
      <AppShell
        header={{ height: 60 }}
        padding="0"
        style={{ backgroundColor: 'transparent' }}
      >
        <AppShell.Header>
          <NavHeader 
            opened={opened} 
            toggleNav={toggleNav}
            setIsCartOpen={setIsCartOpen}
            showImage={true}
            imagePath="/touchdown.png"
            showCart={true}
            title="Touchdown"
          />
        </AppShell.Header>

        <SidePanel opened={opened} onClose={closeNav} />
        <CartSidebar 
          isCartOpen={isCartOpen} 
          setIsCartOpen={setIsCartOpen} 
          activePage="touchdowns" 
        />
        
        <AppShell.Main>
          <Container size="xl" py="xl">
            <Container size="md" mb="xl">
              <TextInput
                placeholder="Search touchdowns..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                radius="md"
                classNames={{
                  input: 'search-input'
                }}
              />
              
              <div className="flex justify-center mt-4">
                <a 
                  href="/allproducts" 
                  className="inline-block bg-transparent text-white px-8 py-3 rounded-md hover:bg-white/10 transition-colors outline outline-3 outline-white font-semibold button-text"
                >
                  VIEW MENU
                </a>
              </div>
            </Container>

            <Grid>
              {filteredTouchdowns.map((touchdown) => (
                <Grid.Col key={touchdown.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
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
                      {touchdown.media?.length > 0 ? (
                        <MediaCarousel 
                          media={touchdown.media} 
                          onImageClick={(url, isVideo) => handleImageClick(url, isVideo, touchdown.id)}
                        />
                      ) : (
                        <div style={{ height: '100%' }}>
                          <LetterPlaceholder name={touchdown.title} />
                        </div>
                      )}
                    </Card.Section>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Group justify="space-between" mt="md" mb="xs" style={{ alignItems: 'flex-start' }}>
                        <Text fw={700} c="black" style={{ flex: 1, marginRight: '8px' }}>
                          {touchdown.title}
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
                            {touchdown.view_count || 0}
                          </Badge>
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
                        {touchdown.description}
                      </Text>

                      <Group gap="lg">
                        <Text size="sm" c="dimmed">
                          {new Date(touchdown.created_at).toLocaleDateString()}
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