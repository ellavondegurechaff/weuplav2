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
import { useSpring, animated } from '@react-spring/web'

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
  const lastScale = useRef(1)
  const initialPinchDistance = useRef(null)
  const [lastTapTime, setLastTapTime] = useState(0)
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 })
  const doubleTapScale = 2.5 // The zoom level for double tap
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 })

  const [springProps, api] = useSpring(() => ({
    scale: 1,
    x: 0,
    y: 0,
    config: {
      tension: 300,
      friction: 30,
      mass: 1
    }
  }))

  const bind = useGesture({
    onPinch: ({ event, origin: [ox, oy], first, movement: [ms], offset: [s], memo }) => {
      event.preventDefault()

      if (first) {
        const rect = event.target.getBoundingClientRect()
        const x = ox - rect.left
        const y = oy - rect.top
        return { x, y, initialScale: scale }
      }

      const newScale = Math.min(Math.max(1, s), 3)
      const { x, y, initialScale } = memo

      const focalX = x
      const focalY = y

      const newPosition = {
        x: (focalX - (focalX * (newScale / initialScale))),
        y: (focalY - (focalY * (newScale / initialScale)))
      }

      const maxX = Math.abs((windowDimensions.width * newScale) - windowDimensions.width) / 2
      const maxY = Math.abs((windowDimensions.height * newScale) - windowDimensions.height) / 2

      newPosition.x = Math.min(Math.max(newPosition.x, -maxX), maxX)
      newPosition.y = Math.min(Math.max(newPosition.y, -maxY), maxY)

      setScale(newScale)
      setPosition(newPosition)

      api.start({
        scale: newScale,
        x: newPosition.x,
        y: newPosition.y,
        immediate: true
      })

      return memo
    },
    onPinchEnd: () => {
      if (scale < 1) {
        resetZoom()
      }
    },
    onDrag: ({ movement: [mx, my], first, active, memo }) => {
      if (scale <= 1) return
      if (first) return { x: position.x, y: position.y }

      const maxX = Math.abs((windowDimensions.width * scale) - windowDimensions.width) / 2
      const maxY = Math.abs((windowDimensions.height * scale) - windowDimensions.height) / 2

      const newX = Math.min(Math.max(position.x + mx, -maxX), maxX)
      const newY = Math.min(Math.max(position.y + my, -maxY), maxY)

      setPosition({ x: newX, y: newY })
      api.start({ x: newX, y: newY, immediate: true })

      return memo
    }
  }, {
    drag: {
      from: () => [position.x, position.y],
      filterTaps: true,
      rubberband: true,
      bounds: {
        left: -windowDimensions.width || 0,
        right: windowDimensions.width || 0,
        top: -windowDimensions.height || 0,
        bottom: windowDimensions.height || 0
      },
      delay: 100
    },
    pinch: {
      distanceBounds: { min: 0 },
      rubberband: true,
      preventDefault: true,
      from: () => [scale]
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
    api.start({
      scale: 1,
      x: 0,
      y: 0,
      immediate: false,
      config: {
        tension: 300,
        friction: 30,
        mass: 1
      }
    })
  }

  const handleDoubleTap = (e) => {
    e.preventDefault()
    const currentTime = new Date().getTime()
    const tapLength = currentTime - lastTapTime

    // Get the image element and its bounding rectangle
    const imageElement = e.currentTarget.querySelector('img')
    const rect = imageElement.getBoundingClientRect()

    // Get precise coordinates
    let x, y
    if (e.type.startsWith('touch')) {
      const touch = e.touches?.[0] || e.changedTouches?.[0]
      if (!touch) return
      x = touch.clientX - rect.left
      y = touch.clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    // Convert coordinates to percentages relative to image size
    const percentX = x / rect.width
    const percentY = y / rect.height

    if (tapLength < 300 && tapLength > 0) {
      if (scale !== 1) {
        resetZoom()
      } else {
        const newScale = doubleTapScale

        // Calculate the point to center the zoom on
        const targetX = (percentX - 0.5) * rect.width * -1 * (newScale - 1)
        const targetY = (percentY - 0.5) * rect.height * -1 * (newScale - 1)

        // Apply bounds
        const maxX = (rect.width * (newScale - 1)) / 2
        const maxY = (rect.height * (newScale - 1)) / 2

        const boundedX = Math.min(Math.max(targetX, -maxX), maxX)
        const boundedY = Math.min(Math.max(targetY, -maxY), maxY)

        setScale(newScale)
        setPosition({ 
          x: boundedX,
          y: boundedY
        })

        api.start({
          scale: newScale,
          x: boundedX,
          y: boundedY,
          immediate: false,
          config: {
            tension: 300,
            friction: 30
          }
        })
      }
    }

    setLastTapTime(currentTime)
    setTapPosition({ x, y })
  }

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
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

  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    // Initial dimensions
    updateDimensions()

    // Update dimensions on resize
    window.addEventListener('resize', updateDimensions)

    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

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
            background: 'black',
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
            background: 'black',
          },
          inner: {
            padding: 0,
            margin: 0,
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
          },
          content: {
            background: 'black',
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
              onTouchStart={(e) => {
                handleTouchStart(e)
                handleDoubleTap(e)
              }}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={handleDoubleTap}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'black',
                overflow: 'hidden',
                touchAction: 'none',
                position: 'relative',
                cursor: isDragging ? 'grabbing' : 'grab',
                willChange: 'transform'
              }}
            >
              <animated.img
                src={selectedMedia.url}
                alt="Full size preview"
                style={{
                  maxWidth: '100vw',
                  maxHeight: '100vh',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  transform: springProps.scale.to(
                    s => `scale(${s}) translate3d(${position.x}px, ${position.y}px, 0)`
                  ),
                  transformOrigin: '50% 50%',
                  willChange: 'transform',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  touchAction: 'none'
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