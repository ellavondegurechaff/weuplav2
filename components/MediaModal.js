import { Modal, ActionIcon, Image } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

export function MediaModal({ 
  selectedMedia, 
  setSelectedMedia, 
  scale, 
  position, 
  bind, 
  resetZoom 
}) {
  return (
    <Modal
      opened={!!selectedMedia.url}
      onClose={() => setSelectedMedia({ url: null, isVideo: false })}
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
        header: { display: 'none' },
        body: {
          padding: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
        },
        inner: { padding: 0, margin: 0 },
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
        content: { background: 'none' }
      }}
    >
      <div className="relative flex items-center justify-center w-screen h-screen bg-transparent">
        <ActionIcon
          onClick={() => setSelectedMedia({ url: null, isVideo: false })}
          className="absolute top-5 right-5 z-50 bg-black/50 text-white rounded-full"
          size="lg"
        >
          <IconX size={18} />
        </ActionIcon>

        {selectedMedia.isVideo ? (
          <video
            src={selectedMedia.url}
            controls
            autoPlay
            className="max-w-full max-h-screen object-contain bg-transparent"
          />
        ) : (
          <div
            {...bind()}
            className="w-full h-full flex items-center justify-center bg-transparent"
          >
            <Image
              src={selectedMedia.url}
              alt="Full size preview"
              fit="contain"
              className="max-w-full max-h-screen bg-transparent"
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transition: scale === 1 ? 'all 0.3s ease' : 'none',
              }}
              onDoubleClick={resetZoom}
            />
          </div>
        )}
      </div>
    </Modal>
  )
} 