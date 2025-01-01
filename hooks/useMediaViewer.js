'use client'

import { useState } from 'react'

export function useMediaViewer() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState({ url: '', isVideo: false })

  const close = () => {
    setIsOpen(false)
    setSelectedMedia({ url: '', isVideo: false })
  }

  const open = () => setIsOpen(true)

  return {
    isOpen,
    selectedMedia,
    setSelectedMedia: (media) => {
      setSelectedMedia(media)
      setIsOpen(true)
    },
    open,
    close
  }
} 