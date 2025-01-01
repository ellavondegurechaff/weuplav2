'use client'

import { Modal } from '@mantine/core'

export function MediaModal({ isOpen, close, selectedMedia }) {
  return (
    <Modal 
      opened={isOpen} 
      onClose={close}
      size="xl"
      padding={0}
      withCloseButton={false}
      centered
    >
      {selectedMedia.isVideo ? (
        <video 
          src={selectedMedia.url} 
          controls 
          autoPlay 
          className="w-full h-auto"
        />
      ) : (
        <img 
          src={selectedMedia.url} 
          alt="Media preview" 
          className="w-full h-auto"
        />
      )}
    </Modal>
  )
} 