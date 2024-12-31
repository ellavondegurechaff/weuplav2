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
  Burger
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { ShoppingCart } from 'lucide-react'
import Head from 'next/head'
import SidePanel from '@/components/SidePanel'
import CartSidebar from '@/components/CartSidebar'
import { MediaCarousel } from '@/components/MediaCarousel'
import { LetterPlaceholder } from '@/components/LetterPlaceholder'

export default function TouchdownsPage() {
  const [opened, { toggle: toggleNav, close: closeNav }] = useDisclosure()
  const [touchdowns, setTouchdowns] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMedia, setSelectedMedia] = useState({ url: null, isVideo: false })

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

  const handleImageClick = (url, isVideo = false) => {
    setSelectedMedia({ url, isVideo })
  }

  const filteredTouchdowns = touchdowns.filter(touchdown => 
    touchdown.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    touchdown.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Head>
        <title>GOODSHOP - Touchdowns</title>
      </Head>
      <AppShell
        header={{ height: 60 }}
        padding="0"
        style={{ backgroundColor: 'transparent' }}
      >
        <AppShell.Header>
          <Group h="100%" px="md" style={{ justifyContent: 'space-between' }}>
            <Burger opened={opened} onClick={toggleNav} size="sm" color="#f97316" />
            <Text size="xl" fw={700} c="black">Touchdowns</Text>
            <button onClick={() => setIsCartOpen(true)}>
              <ShoppingCart size={24} color="#f97316" />
            </button>
          </Group>
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
                      <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={700} c="black">{touchdown.title}</Text>
                      </Group>

                      <Text 
                        size="sm" 
                        c="dimmed" 
                        style={{ 
                          flex: 1,
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {touchdown.description}
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