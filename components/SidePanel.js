import { Drawer, Stack, Text, Button, Group, Collapse, Image } from '@mantine/core'
import { Home, ShoppingCart, MessageCircle, Send, HelpCircle, ChevronDown, Cannabis, Box, Bell } from 'lucide-react'
import { SiTelegram, SiSignal } from '@icons-pack/react-simple-icons'
import { useState } from 'react'
import Link from 'next/link'

export default function SidePanel({ opened, onClose }) {
  const [isProductsOpen, setIsProductsOpen] = useState(false)

  const productItems = [
    { label: 'ALL PRODUCTS', href: '/allproducts' },
    { label: 'EXOTICS ($1200+)', href: '/exotics' },
    { label: 'HIGHS ($900 - $1150)', href: '/highs' },
    { label: 'MIDS ($600 - $850)', href: '/mids' },
    { label: 'LOWS (UNDER $600)', href: '/lows' },
    { label: 'DISPOS/CARTS/EDIBLES', href: '/dce' }
  ]

  const menuItems = [
    { 
      icon: <img src="/home.svg" alt="Home" width="24" height="24" />, 
      label: 'HOME', 
      href: '/' 
    },
    { 
      icon: <img src="/announcements.svg" alt="Announcements" width="24" height="24" />, 
      label: 'ANNOUNCEMENTS', 
      href: '/announcements' 
    },
    { 
      icon: <img src="/contact us.svg" alt="Contact" width="24" height="24" />, 
      label: 'CONTACT US', 
      href: '/' 
    },
    { 
      icon: <img src="/touchdown.svg" alt="Touchdown" width="24" height="24" />, 
      label: 'TOUCHDOWN', 
      href: '/touchdown' 
    },
    { 
      icon: <img src="/faq.svg" alt="FAQ" width="24" height="24" />, 
      label: 'FAQ', 
      href: '/faq' 
    }
  ]

  const ContactButton = () => (
    <Link
      href="/"
      style={{ textDecoration: 'none', width: '100%' }}
      onClick={onClose}
    >
      <Button
        variant="subtle"
        color="dark"
        fullWidth
        leftSection={<Send size={20} />}
        justify="start"
        styles={{
          root: {
            color: 'black',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)'
            }
          },
          inner: {
            justifyContent: 'flex-start'
          }
        }}
      >
        Contact Us
      </Button>
    </Link>
  )

  const commonButtonStyles = {
    root: {
      color: 'black',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)'
      },
      padding: '8px 12px',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      height: 'auto'
    },
    inner: {
      justifyContent: 'flex-start',
      width: '100%'
    },
    label: {
      width: '100%',
      textAlign: 'left'
    }
  }

  return (
    <>
      {/* Overlay */}
      {opened && (
        <div 
          className="fixed inset-0 bg-black/50 z-[130] md:hidden"
          onClick={onClose}
        />
      )}
      
      <div 
        className={`fixed top-0 left-0 w-80 h-full bg-white transform 
          ${opened ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out z-[140] overflow-hidden flex flex-col`}
      >
        <div className="h-full flex flex-col overflow-hidden justify-between">
          <div className="px-6 h-[60px] flex items-center justify-between bg-[#FF4500]">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="WeUpLA Logo" 
                className="h-16 w-16 object-contain"
              />
              <img 
                src="/nav_menu.png" 
                alt="WeUpLA" 
                className="h-6 object-contain"
              />
            </div>
            <button
              onClick={onClose}
              className="text-white text-2xl hover:text-gray-300 transition-colors"
              aria-label="Close sidebar"
            >
              ×
            </button>
          </div>

          <nav className="flex-1 pl-1 pr-2 py-2">
            <Stack gap="xs">
              {menuItems.slice(0, 2).map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  style={{ textDecoration: 'none', width: '100%' }}
                  onClick={onClose}
                >
                  <Button
                    variant="subtle"
                    color="dark"
                    fullWidth
                    leftSection={item.icon}
                    justify="start"
                    className="sidepanel-nav-text"
                    styles={commonButtonStyles}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}

              <Button
                variant="subtle"
                color="dark"
                fullWidth
                leftSection={<img src="/products.svg" alt="Products" width="24" height="24" />}
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className="sidepanel-nav-text"
                styles={{
                  ...commonButtonStyles,
                  label: {
                    ...commonButtonStyles.label,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }
                }}
              >
                PRODUCTS<ChevronDown size={16} />
              </Button>
              
              <Collapse in={isProductsOpen}>
                <Stack gap="xs" pl={2}>
                  {productItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      style={{ textDecoration: 'none', width: '100%' }}
                      onClick={onClose}
                    >
                      <Button
                        variant="subtle"
                        color="dark"
                        fullWidth
                        justify="start"
                        styles={{
                          ...commonButtonStyles,
                          root: {
                            ...commonButtonStyles.root,
                            padding: '6px 20px'
                          }
                        }}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </Stack>
              </Collapse>

              {menuItems.slice(2).map((item, index) => (
                <Link
                  key={index + 2}
                  href={item.href}
                  style={{ textDecoration: 'none', width: '100%' }}
                  onClick={onClose}
                >
                  <Button
                    variant="subtle"
                    color="dark"
                    fullWidth
                    leftSection={item.icon}
                    justify="start"
                    className="sidepanel-nav-text"
                    styles={commonButtonStyles}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </Stack>
          </nav>

          <div className="p-4 space-y-3">
            <button
              className="w-full py-3 px-4 bg-transparent text-[#FF4500] font-semibold rounded-md hover:bg-white/10 transition-colors flex items-center justify-center gap-2 outline outline-3 outline-[#FF4500] sidepanel-button-text"
              onClick={() => {
                if (navigator.standalone) {
                  alert('App is already installed on your homescreen!')
                  return
                }
                
                // Show installation instructions based on device/browser
                if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
                  alert('To add this website to your home screen:\n\n1. Tap the Share button\n2. Scroll down and tap "Add to Home Screen"\n3. Note: This will open in Safari as it\'s a web app')
                } else if (/Chrome/.test(navigator.userAgent)) {
                  alert('To add this website to your home screen:\n\n1. Tap the three dots menu (⋮)\n2. Tap "Add to Home screen"\n3. Note: This will open in Chrome as it\'s a web app')
                } else {
                  alert('To add this website to your home screen, use your browser\'s "Add to Home Screen" or "Install" feature.\n\nNote: This will open in your default browser as it\'s a web app.')
                }
              }}
            >
              ADD TO HOMESCREEN
            </button>
            
            <a
              href="https://signal.me/#eu/EnEaHC7NjCVwnGkTEFNmNrnoxzrJx4KlTjPUK3kAmgVGBNmrO7VL1qXppTsEAyn0"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-transparent text-[#3A76F0] font-semibold rounded-md hover:bg-white/10 transition-colors flex items-center justify-center gap-2 outline outline-3 outline-[#3A76F0] sidepanel-button-text"
            >
              <SiSignal size={24} />
              <span>Signal</span>
            </a>
            
            <button
              className="w-full py-3 px-4 bg-transparent hover:bg-white/10 text-[#3A76F0] font-semibold rounded-md transition-colors flex items-center justify-center gap-2 outline outline-3 outline-[#3A76F0] sidepanel-button-text"
              onClick={() => {
                window.location.href = 'https://t.me/WeUpLA_DM'
              }}
            >
              <SiTelegram size={24} />
              <span>Telegram</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
} 