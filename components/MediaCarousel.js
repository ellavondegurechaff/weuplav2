import { useState, useRef, useEffect } from 'react'
import { Image, Card, ActionIcon, Box } from '@mantine/core'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

export function MediaCarousel({ media, onImageClick }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef(0)
  const currentXRef = useRef(0)
  const imageRef = useRef(null)

  // Reset currentIndex if media array changes
  useEffect(() => {
    if (currentIndex >= media?.length) {
      setCurrentIndex(0)
    }
  }, [media, currentIndex])

  if (!media?.length) return null

  // Ensure currentIndex is within bounds
  const safeIndex = Math.min(currentIndex, media.length - 1)
  const currentMedia = media[safeIndex]
  
  // Safety check for currentMedia
  if (!currentMedia) return null

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
    
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX
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
    onImageClick?.(currentMedia.url, isVideo(currentMedia.url), media)
  }

  const isVideo = (url) => {
    if (!url) return false
    const videoExtensions = ['.mp4', '.mov', '.MP4', '.MOV']
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext.toLowerCase()))
  }

  const isCurrentMediaVideo = currentMedia?.type === 'video' || isVideo(currentMedia?.url)

  return (
    <Box style={{ 
      height: '100%',
      position: 'relative',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      background: 'none',
      aspectRatio: '1 / 1',
      maxHeight: 'calc(100vh - 60px)',
      width: '100%'
    }}>
      <Card.Section 
        style={{ 
          height: '100%', 
          width: '100%',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'pan-x pan-y',
          background: 'none',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={(e) => {
          if (!isDragging) {
            handleMediaClick(e)
          }
        }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {isCurrentMediaVideo ? (
          <video
            src={currentMedia.url}
            controls
            autoPlay
            muted
            loop
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              background: 'none',
              display: 'block',
              position: 'absolute',
              top: 0,
              left: 0
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
              background: 'none',
              position: 'relative'
            }}
          >
            <Image
              ref={imageRef}
              src={currentMedia.url}
              alt="Product media"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                background: 'none',
                position: 'absolute',
                top: 0,
                left: 0
              }}
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