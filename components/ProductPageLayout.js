import { AppShell, Container, Grid, Text, Group, Burger, Button, TextInput, Modal, Image, ActionIcon } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { ShoppingCart } from 'lucide-react'
import Head from 'next/head'
import SidePanel from '@/components/SidePanel'
import { useState, useEffect } from 'react'
import useCartStore from '@/store/cartStore'
import CartSidebar from '@/components/CartSidebar'
import ProductCard from '@/components/ProductCard'
import { useGesture } from '@use-gesture/react'
import { IconX } from '@tabler/icons-react'
import { NavHeader } from '@/components/NavHeader'

export function ProductPageLayout({ 
  pageTitle, 
  activePage,
  fetchUrl 
}) {
  const [opened, { toggle: toggleNav, close: closeNav }] = useDisclosure()
  const [products, setProducts] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMedia, setSelectedMedia] = useState({ url: null, isVideo: false })
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [origin, setOrigin] = useState({ x: 0, y: 0 })

  const bind = useGesture({
    onPinch: ({ origin: [ox, oy], offset: [s], event }) => {
      event.preventDefault()
      
      if (s === 1) {
        setOrigin({ x: ox, y: oy })
      }
      
      const newScale = Math.min(Math.max(0.5, s), 4)
      setScale(newScale)
      
      if (newScale > 1) {
        const x = (ox - origin.x) * (1 - newScale)
        const y = (oy - origin.y) * (1 - newScale)
        setPosition({ x, y })
      } else {
        setPosition({ x: 0, y: 0 })
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
    async function fetchProducts() {
      try {
        const response = await fetch(fetchUrl)
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error(`Error fetching products: ${error}`)
      }
    }
    fetchProducts()
  }, [fetchUrl])

  const handleImageClick = async (url, isVideo = false, productId) => {
    setSelectedMedia({ url, isVideo })
    setIsModalOpen(true)
    
    try {
      const response = await fetch('/api/products/track-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId })
      })
      
      if (!response.ok) {
        throw new Error('Failed to track view')
      }

      const { views } = await response.json()
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId 
            ? { ...product, view_count: views }
            : product
        )
      )
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Head>
        <title>GOODSHOP</title>
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
            title={pageTitle}
            setIsCartOpen={setIsCartOpen}
          />
        </AppShell.Header>

        <SidePanel opened={opened} onClose={closeNav} />
        <CartSidebar 
          isCartOpen={isCartOpen} 
          setIsCartOpen={setIsCartOpen} 
          activePage={activePage} 
        />
        
        <AppShell.Main>
          <Container size="xl" py="xl">
            <Container size="sm" mb="xl">
              <TextInput
                placeholder="Search products..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                size="sm"
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
              {filteredProducts.map((product) => (
                <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                  <ProductCard 
                    product={product}
                    onImageClick={handleImageClick}
                  />
                </Grid.Col>
              ))}
            </Grid>
          </Container>
        </AppShell.Main>
      </AppShell>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
            onClick={() => setIsModalOpen(false)}
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
                overflow: 'hidden',
                touchAction: 'none'
              }}
            >
              <Image
                src={selectedMedia.url}
                alt="Full size preview"
                fit="contain"
                style={{
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  transformOrigin: 'center center',
                  willChange: 'transform',
                  transition: 'none',
                  userSelect: 'none',
                }}
                onDoubleClick={resetZoom}
              />
            </div>
          )}
        </div>
      </Modal>
    </>
  )
} 