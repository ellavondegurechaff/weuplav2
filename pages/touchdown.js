import { useState, useEffect } from 'react'
import { AppShell, Container, TextInput, Grid } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Head from 'next/head'
import { useMediaViewer } from './hooks/useMediaViewer'
import { MediaModal } from './components/MediaModal'
import { NavHeader } from '@/components/NavHeader'
import { SidePanel } from '@/components/SidePanel'
import { CartSidebar } from '@/components/CartSidebar'
import { TouchdownCard } from '@/components/TouchdownCard'

export default function TouchdownsPage() {
  const [opened, { toggle: toggleNav, close: closeNav }] = useDisclosure()
  const [touchdowns, setTouchdowns] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const mediaViewer = useMediaViewer()

  useEffect(() => {
    fetchTouchdowns()
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

  const handleImageClick = async (url, isVideo = false, touchdownId) => {
    mediaViewer.setSelectedMedia({ url, isVideo })
    
    try {
      const response = await fetch('/api/touchdowns/track-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ touchdownId })
      })
      
      if (!response.ok) throw new Error('Failed to track view')
      const { views } = await response.json()
      
      setTouchdowns(prev => prev.map(touchdown => 
        touchdown.id === touchdownId 
          ? { ...touchdown, view_count: views }
          : touchdown
      ))
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
        <title>GOODSHOP - Touchdowns</title>
      </Head>
      
      <AppShell
        header={{ height: 60 }}
        padding="0"
        className="bg-transparent"
      >
        <AppShell.Header>
          <NavHeader 
            opened={opened}
            toggleNav={toggleNav}
            title="Touchdown"
            setIsCartOpen={setIsCartOpen}
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
                styles={{
                  input: {
                    backgroundColor: 'white',
                    '&:focus': {
                      borderColor: 'var(--mantine-color-orange-6)',
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
              {filteredTouchdowns.map((touchdown) => (
                <Grid.Col key={touchdown.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                  <TouchdownCard
                    touchdown={touchdown}
                    onImageClick={handleImageClick}
                  />
                </Grid.Col>
              ))}
            </Grid>
          </Container>
        </AppShell.Main>

        <MediaModal {...mediaViewer} />
      </AppShell>
    </>
  )
} 