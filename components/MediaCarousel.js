import { useState, useRef } from 'react'
import { Image, Card, ActionIcon, Box } from '@mantine/core'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { useGesture } from '@use-gesture/react'
import { transform } from '@mantine/core'

export function MediaCarousel({ media, onImageClick }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef(0)
  const currentXRef = useRef(0)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef(null)

  const bind = useGesture({
    onPinch: ({ offset: [scale], event }) => {
      event.preventDefault()
      setScale(Math.min(Math.max(0.5, scale), 3))
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

  if (!media?.length) return null

  const currentMedia = media[currentIndex]
  
  const navigate = (direction) => {
    if (direction === 'prev') {
      setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1))
    } else {
      setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1))
    }
  }

  const handleDragStart = (e) => {
    setIsDragging(true)
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX
    startXRef.current = clientX
    currentXRef.current = clientX
  }

  const handleDragMove = (e) => {
    if (!isDragging) return
    
    // Only prevent default for horizontal movements
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX
    const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY
    
    // Calculate movement delta
    const deltaX = clientX - startXRef.current
    const deltaY = Math.abs(clientY - (e.type === 'mousemove' ? e.clientY : e.touches[0].clientY))
    
    // Only prevent default if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > deltaY) {
      e.preventDefault()
    }
    
    currentXRef.current = clientX
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    
    const diff = currentXRef.current - startXRef.current
    const minSwipeDistance = 50

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        navigate('prev')
      } else {
        navigate('next')
      }
    }
  }

  const handleMediaClick = (e) => {
    e.preventDefault()
    onImageClick?.(currentMedia.url, isVideo(currentMedia.url))
  }

  const isVideo = (url) => {
    const videoExtensions = ['.mp4', '.mov', '.MP4', '.MOV']
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext.toLowerCase()))
  }

  return (
    <Box style={{ 
      height: '300px', 
      position: 'relative',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      background: 'none'
    }}>
      <Card.Section 
        {...bind()}
        style={{ 
          height: '100%', 
          width: '100%',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'pan-x pan-y pinch-zoom',
          background: 'none'
        }}
        onClick={handleMediaClick}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {(currentMedia.type === 'video' || isVideo(currentMedia.url)) ? (
          <video
            src={currentMedia.url}
            controls
            autoPlay
            muted
            loop
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              background: 'none',
              display: 'block'
            }}
            playsInline
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              background: 'none'
            }}
          >
            <Image
              ref={imageRef}
              src={currentMedia.url}
              alt="Product media"
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'contain',
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transition: scale === 1 ? 'all 0.3s ease' : 'none',
                background: 'none'
              }}
              onDoubleClick={resetZoom}
            />
          </div>
        )}
      </Card.Section>

      {media.length > 1 && (
        <>
          <ActionIcon 
            variant="filled"
            onClick={() => navigate('prev')}
            size="sm"
            radius="xl"
            color="gray.6"
            style={{
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
          >
            <IconChevronLeft size={16} />
          </ActionIcon>

          <ActionIcon 
            variant="filled"
            onClick={() => navigate('next')}
            size="sm"
            radius="xl"
            color="gray.6"
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
          >
            <IconChevronRight size={16} />
          </ActionIcon>
        </>
      )}
    </Box>
  )
} 