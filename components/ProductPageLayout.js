import { AppShell, Container, Grid, Text, Group, Burger, Button, TextInput, Modal, Image } from '@mantine/core'
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
        onClose={() => {
          setIsModalOpen(false)
        }}
        transitionProps={{
          duration: 200,
          onExitComplete: () => {
            setSelectedMedia({ url: null, isVideo: false })
            resetZoom()
          }
        }}
        size="xl"
        padding={0}
        closeButtonProps={{
          icon: <IconX size={16} />,
          iconSize: 16,
        }}
        styles={{
          modal: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
          header: {
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 1000,
            margin: 0,
            padding: 0,
            height: 'auto',
            backgroundColor: 'transparent',
            border: 'none',
          },
          close: {
            color: 'white',
            backgroundColor: 'transparent',
            width: '24px',
            height: '24px',
            minHeight: '24px',
            minWidth: '24px',
            borderRadius: '50%',
            padding: 0,
            border: 'none',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
            svg: {
              width: '14px',
              height: '14px',
            }
          },
          body: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            padding: 0,
          },
          inner: {
            padding: 0,
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
              backgroundColor: 'rgba(0, 0, 0, 0.9)'
            }}
          />
        ) : (
          <div
            {...bind()}
            style={{
              width: '100%',
              height: '90vh',
              overflow: 'hidden',
              touchAction: 'none',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Image
              src={selectedMedia.url}
              alt="Full size preview"
              fit="contain"
              height="90vh"
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transition: scale === 1 ? 'all 0.3s ease' : 'none'
              }}
              onDoubleClick={resetZoom}
            />
          </div>
        )}
      </Modal>
    </>
  )
} 