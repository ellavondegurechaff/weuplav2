import { AppShell, Container, Grid, Text, Group, Burger, Button, TextInput, Modal, Image, ActionIcon } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { ShoppingCart } from 'lucide-react'
import Head from 'next/head'
import SidePanel from '@/components/SidePanel'
import { useState, useEffect, useRef } from 'react'
import useCartStore from '@/store/cartStore'
import CartSidebar from '@/components/CartSidebar'
import ProductCard from '@/components/ProductCard'
import { useGesture } from '@use-gesture/react'
import { IconX, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
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
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0)
  const startXRef = useRef(0)
  const currentXRef = useRef(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragDistanceRef = useRef(0)
  const dragThresholdRef = useRef(50)
  const dragDirectionRef = useRef(null)

  const bind = useGesture({
    onPinch: ({ offset: [s], event }) => {
      event.preventDefault()
      const newScale = Math.min(Math.max(1, s), 3)
      setScale(newScale)
    },
    onPinchEnd: () => {
      setScale(1)
    }
  }, {
    drag: false,
    pinch: {
      from: () => [scale],
      filterTaps: true
    }
  })

  const handleTouchStart = (e) => {
    if (e.touches.length > 1) return // Ignore multi-touch
    setIsDragging(true)
    startXRef.current = e.touches[0].clientX
    dragDirectionRef.current = null
  }

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length > 1) return
    
    const currentX = e.touches[0].clientX
    const deltaX = currentX - startXRef.current
    
    if (Math.abs(deltaX) > dragThresholdRef.current) {
      dragDirectionRef.current = deltaX > 0 ? 'right' : 'left'
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    if (dragDirectionRef.current && selectedMedia.productMedia) {
      const currentIndex = selectedMedia.productMedia.findIndex(m => m.url === selectedMedia.url)
      
      if (dragDirectionRef.current === 'right' && currentIndex > 0) {
        navigateMedia('prev', currentIndex)
      } else if (dragDirectionRef.current === 'left' && currentIndex < selectedMedia.productMedia.length - 1) {
        navigateMedia('next', currentIndex)
      }
    }
  }

  const navigateMedia = (direction, currentIndex) => {
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1
    if (newIndex >= 0 && newIndex < selectedMedia.productMedia.length) {
      setSelectedMedia({
        url: selectedMedia.productMedia[newIndex].url,
        isVideo: isVideo(selectedMedia.productMedia[newIndex].url),
        productMedia: selectedMedia.productMedia
      })
    }
  }

  const isVideo = (url) => {
    const videoExtensions = ['.mp4', '.mov', '.MP4', '.MOV']
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext.toLowerCase()))
  }

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

  const handleImageClick = async (url, isVideo = false, productId, productMedia) => {
    setSelectedMedia({ 
      url, 
      isVideo,
      productMedia
    })
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
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                overflow: 'hidden',
                touchAction: 'none',
                position: 'relative',
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
            >
              <Image
                src={selectedMedia.url}
                alt="Full size preview"
                fit="contain"
                style={{
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  transform: `scale(${scale})`,
                  transformOrigin: 'center center',
                  willChange: 'transform',
                  transition: 'none',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  margin: 'auto'
                }}
                onDoubleClick={resetZoom}
              />
            </div>
          )}

          {selectedMedia.productMedia?.length > 1 && (
            <>
              <ActionIcon 
                variant="filled"
                onClick={() => {
                  const currentIndex = selectedMedia.productMedia.findIndex(m => m.url === selectedMedia.url)
                  if (currentIndex > 0) {
                    setSelectedMedia({
                      url: selectedMedia.productMedia[currentIndex - 1].url,
                      isVideo: isVideo(selectedMedia.productMedia[currentIndex - 1].url),
                      productMedia: selectedMedia.productMedia
                    })
                  }
                }}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <IconChevronLeft size={24} />
              </ActionIcon>
              <ActionIcon 
                variant="filled"
                onClick={() => {
                  const currentIndex = selectedMedia.productMedia.findIndex(m => m.url === selectedMedia.url)
                  if (currentIndex < selectedMedia.productMedia.length - 1) {
                    setSelectedMedia({
                      url: selectedMedia.productMedia[currentIndex + 1].url,
                      isVideo: isVideo(selectedMedia.productMedia[currentIndex + 1].url),
                      productMedia: selectedMedia.productMedia
                    })
                  }
                }}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <IconChevronRight size={24} />
              </ActionIcon>
            </>
          )}
        </div>
      </Modal>
    </>
  )
} 