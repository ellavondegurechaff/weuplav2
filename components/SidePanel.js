import { Drawer, Stack, Text, Button, Group, Collapse, Image } from '@mantine/core'
import { Home, ShoppingCart, MessageCircle, Send, HelpCircle, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function SidePanel({ opened, onClose }) {
  const [isProductsOpen, setIsProductsOpen] = useState(false)

  const productItems = [
    { label: 'All Products', href: '/allproducts' },
    { label: 'Exotics', href: '/exotics' },
    { label: 'Highs', href: '/highs' },
    { label: 'Mids', href: '/mids' },
    { label: 'Lows', href: '/lows' },
    { label: 'Dispos/Carts/Edibles', href: '/dce' }
  ]

  const menuItems = [
    { icon: <Home size={20} />, label: 'Home', href: '/' },
    { icon: <Send size={20} />, label: 'Contact Us', href: '/contact' },
    { icon: <HelpCircle size={20} />, label: 'FAQ', href: '/faq' }
  ]

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
        className={`fixed top-0 left-0 w-64 h-full bg-white transform 
          ${opened ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out z-[140] overflow-hidden flex flex-col`}
      >
        <div className="h-full flex flex-col overflow-hidden justify-between">
          <div className="flex flex-col h-full">
            <div className="px-6 h-16 flex items-center justify-between bg-[#FF4500]">
              <div className="flex items-center space-x-3">
                <img 
                  src="/logo.png" 
                  alt="WeUpLA Logo" 
                  className="h-8 w-8 object-contain"
                />
                <span className="text-lg font-semibold text-white font-['Helvetica']">WeUpLA</span>
              </div>
              <button
                onClick={onClose}
                className="text-white text-2xl hover:text-gray-300 transition-colors"
                aria-label="Close sidebar"
              >
                ×
              </button>
            </div>

            <nav className="flex-1">
              <Stack gap="xs">
                <Link
                  href="/"
                  style={{ textDecoration: 'none', width: '100%' }}
                  onClick={onClose}
                >
                  <Button
                    variant="subtle"
                    color="dark"
                    fullWidth
                    leftSection={<Home size={20} />}
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
                    Home
                  </Button>
                </Link>

                <Button
                  variant="subtle"
                  color="dark"
                  fullWidth
                  rightSection={<ChevronDown size={16} />}
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  styles={{
                    root: {
                      color: 'black',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.05)'
                      }
                    },
                    inner: {
                      justifyContent: 'space-between'
                    },
                    rightSection: {
                      color: 'black'
                    }
                  }}
                >
                  Products
                </Button>
                
                <Collapse in={isProductsOpen}>
                  <Stack gap="xs" pl="md">
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
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                  </Stack>
                </Collapse>

                {menuItems.slice(1).map((item, index) => (
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
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </Stack>
            </nav>
          </div>

          <div className="p-4 space-y-2">
            <button
              className="w-full py-3 px-4 bg-[#FF4500] text-white font-semibold rounded-md hover:bg-[#FF4500]/90 transition-colors"
              onClick={() => {
                if (navigator.standalone) {
                  alert('App is already installed on your homescreen!')
                  return
                }
                
                // Show installation instructions for iOS
                if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
                  alert('To install this app on your iPhone:\n\n1. Tap the Share button\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in the top right')
                } else {
                  alert('To install, use the browser\'s "Add to Home Screen" or "Install" feature.')
                }
              }}
            >
              Add to Homescreen
            </button>
            <button
              className="w-full py-3 px-4 bg-[#0088CC] text-white font-semibold rounded-md hover:bg-[#0088CC]/90 transition-colors"
              onClick={() => {
                window.location.href = 'https://t.me/yourusername'
              }}
            >
              Telegram
            </button>
            <button
              className="w-full py-3 px-4 bg-[#3A76F0] text-white font-semibold rounded-md hover:bg-[#3A76F0]/90 transition-colors"
              onClick={() => {
                window.location.href = 'signal://+1234567890'
              }}
            >
              Signal
            </button>
          </div>
        </div>
      </div>
    </>
  )
} 