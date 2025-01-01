import { Card, Text, Badge, Group, Button } from '@mantine/core'
import { LetterPlaceholder } from '@/components/LetterPlaceholder'
import { MediaCarousel } from '@/components/MediaCarousel'
import useCartStore from '@/store/cartStore'
import { useState, useRef } from 'react'
import { useGesture } from '@use-gesture/react'
import { animated, useSpring } from '@react-spring/web'

export default function ProductCard({ product, onImageClick }) {
  const addToCart = useCartStore(state => state.addToCart)
  const videoRef = useRef(null)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const isHorizontalSwipe = useRef(false)

  const [style, api] = useSpring(() => ({
    scale: 1,
    x: 0,
    y: 0,
    config: { tension: 300, friction: 20 }
  }))

  const containerRef = useRef(null)
  const initialDistance = useRef(0)

  const bind = useGesture({
    onPinch: ({ offset: [scale], event }) => {
      if (event.touches.length === 2) {
        event.preventDefault()
        api.start({
          scale: Math.min(Math.max(0.5, scale), 3),
        })
      }
    },
    onPinchEnd: () => {
      // Reset to original size smoothly
      api.start({ scale: 1, x: 0, y: 0 })
    },
    onDrag: ({ offset: [x, y], pinching }) => {
      // Only allow dragging when zoomed in
      if (style.scale.get() > 1) {
        api.start({ x, y })
      }
    }
  }, {
    drag: {
      from: () => [style.x.get(), style.y.get()],
      filterTaps: true,
      threshold: 5,
    },
    pinch: {
      distanceBounds: { min: 0 },
      rubberband: true
    }
  })

  const handleTouchStart = (e) => {
    // Store initial touch coordinates
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    isHorizontalSwipe.current = false
  }

  const handleTouchMove = (e) => {
    if (!videoRef.current) return

    const deltaX = e.touches[0].clientX - touchStartX.current
    const deltaY = e.touches[0].clientY - touchStartY.current

    // Determine if the swipe is more horizontal than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      isHorizontalSwipe.current = true
      // Play video only during horizontal swipes
      if (!videoRef.current.playing) {
        videoRef.current.play()
      }
    } else {
      isHorizontalSwipe.current = false
      if (videoRef.current.playing) {
        videoRef.current.pause()
      }
    }
  }

  const handleTouchEnd = () => {
    if (videoRef.current && videoRef.current.playing) {
      videoRef.current.pause()
    }
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      image: product.media?.[0]?.url || product.image_url,
      intown_price: product.intown_price,
      shipped_price: product.shipped_price,
      quantity: 1
    })
  }

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder 
      bg="white"
      style={{
        backgroundColor: 'white',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderWidth: '7px'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Card.Section 
        style={{ 
          cursor: 'pointer',
          height: '300px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {product.media?.length > 0 ? (
          <div ref={containerRef} className="overflow-hidden">
            <animated.div
              {...bind()}
              style={{
                ...style,
                touchAction: 'pan-x pan-y',
                transform: style.scale.to(s => `scale(${s})`),
              }}
              className="w-full h-full origin-center"
            >
              <MediaCarousel 
                media={product.media} 
                onImageClick={(url, isVideo) => onImageClick(url, isVideo, product.id)}
              />
            </animated.div>
          </div>
        ) : (
          <div style={{ height: '100%' }}>
            <LetterPlaceholder name={product.name} />
          </div>
        )}
      </Card.Section>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Group justify="space-between" mt="md" mb="xs" style={{ alignItems: 'flex-start' }}>
          <Text fw={700} c="black" style={{ flex: 1, marginRight: '8px' }}>
            {product.name}
          </Text>
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
            {product.view_count || 0}
          </Badge>
        </Group>

        <Group gap="lg" mb="md">
          <div>
            <Text size="sm" fw={700} c="dark">In-town</Text>
            <Text size="xl" fw={700} c="green.6">
              ${product.intown_price}
            </Text>
          </div>
          <div>
            <Text size="sm" fw={700} c="dark">Shipped</Text>
            <Text size="xl" fw={700} c="orange.6">
              ${product.shipped_price}
            </Text>
          </div>
        </Group>

        <Text 
          size="sm" 
          c="dimmed" 
          mb="md" 
          style={{ 
            flex: 1,
            whiteSpace: 'pre-wrap'
          }}
        >
          {product.description}
        </Text>

        <Button 
          variant="light" 
          color="orange" 
          fullWidth 
          onClick={handleAddToCart}
          className="bg-transparent text-orange-500 hover:bg-orange-500/10 
            transition-colors outline outline-2 outline-orange-500 font-semibold"
          styles={{
            root: {
              padding: '0.75rem 1rem',
              borderRadius: '0.375rem',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
              },
            }
          }}
        >
          Add to Cart
        </Button>
      </div>
    </Card>
  )
} 