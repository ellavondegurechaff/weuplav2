import { useState } from 'react'
import { Image, Card, ActionIcon, Box } from '@mantine/core'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

export function MediaCarousel({ media, onImageClick }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!media?.length) return null

  const currentMedia = media[currentIndex]
  
  const handlePrevious = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1))
  }

  const handleNext = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1))
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
      padding: 0
    }}>
      <Card.Section 
        style={{ 
          height: '100%', 
          width: '100%',
          margin: 0,
          padding: 0,
          overflow: 'hidden'
        }}
        onClick={handleMediaClick}
      >
        {(currentMedia.type === 'video' || isVideo(currentMedia.url)) ? (
          <video
            src={currentMedia.url}
            controls
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              backgroundColor: '#f5f5f5',
              display: 'block'
            }}
            playsInline
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <Image
            src={currentMedia.url}
            alt="Product media"
            style={{
              width: '100%',
              height: '300px',
              objectFit: 'cover',
              backgroundColor: '#f5f5f5',
              display: 'block',
              margin: 0,
              padding: 0
            }}
          />
        )}
      </Card.Section>

      {media.length > 1 && (
        <>
          <ActionIcon 
            variant="filled"
            onClick={handlePrevious}
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
            onClick={handleNext}
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