import { Drawer, Stack, Text, Button, Group, Collapse, Image } from '@mantine/core'
import { Home, ShoppingCart, MessageCircle, Send, HelpCircle, ChevronDown, Cannabis, Box, Bell } from 'lucide-react'
import { SiTelegram, SiSignal } from '@icons-pack/react-simple-icons'
import { useState } from 'react'
import Link from 'next/link'

export default function SidePanel({ opened, onClose }) {
  const [isProductsOpen, setIsProductsOpen] = useState(false)

  const productItems = [
    { label: 'All Products', href: '/allproducts' },
    { label: 'Exotics ($1200+)', href: '/exotics' },
    { label: 'Highs ($900 - $1150)', href: '/highs' },
    { label: 'Mids ($600 - $850)', href: '/mids' },
    { label: 'Lows (Under $600)', href: '/lows' },
    { label: 'Dispos/Carts/Edibles', href: '/dce' }
  ]

  const menuItems = [
    { icon: <Home size={20} />, label: 'Home', href: '/' },
    { icon: <Bell size={20} />, label: 'Announcements', href: '/announcements' },
    { icon: <Send size={20} />, label: 'Contact Us', href: '/' },
    { icon: <Box size={20} />, label: 'Touchdown', href: '/touchdown' },
    { icon: <HelpCircle size={20} />, label: 'FAQ', href: '/faq' }
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
        className={`fixed top-0 left-0 w-64 h-full bg-[#f2f0d6] transform 
          ${opened ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out z-[140] overflow-hidden flex flex-col`}
      >
        <div className="h-full flex flex-col overflow-hidden justify-between">
          <div className="flex flex-col h-full">
            <div className="px-6 h-[60px] flex items-center justify-between bg-[#FF4500]">
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

                <Link
                  href="/announcements"
                  style={{ textDecoration: 'none', width: '100%' }}
                  onClick={onClose}
                >
                  <Button
                    variant="subtle"
                    color="dark"
                    fullWidth
                    leftSection={<Bell size={20} />}
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
                    Announcements
                  </Button>
                </Link>

                <Button
                  variant="subtle"
                  color="dark"
                  fullWidth
                  leftSection={<Cannabis size={20} />}
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
                      justifyContent: 'flex-start'
                    },
                    label: {
                      flex: 1
                    },
                    rightSection: {
                      marginLeft: 'auto',
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
                          leftSection={item.icon}
                          justify="start"
                          styles={{
                            root: {
                              color: 'black',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.05)'
                              },
                              fontSize: '0.9rem',
                              padding: '8px 12px'
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

                <ContactButton />

                <Link
                  href="/touchdown"
                  style={{ textDecoration: 'none', width: '100%' }}
                  onClick={onClose}
                >
                  <Button
                    variant="subtle"
                    color="dark"
                    fullWidth
                    leftSection={<Box size={20} />}
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
                    Touchdown
                  </Button>
                </Link>

                <Link
                  href="/faq"
                  style={{ textDecoration: 'none', width: '100%' }}
                  onClick={onClose}
                >
                  <Button
                    variant="subtle"
                    color="dark"
                    fullWidth
                    leftSection={<HelpCircle size={20} />}
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
                    FAQ
                  </Button>
                </Link>
              </Stack>
            </nav>
          </div>

          <div className="p-4 space-y-3">
            <button
              className="w-full py-3 px-4 bg-transparent text-[#FF4500] font-semibold rounded-md hover:bg-white/10 transition-colors flex items-center justify-center gap-2 outline outline-3 outline-[#FF4500]"
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
            
            <a
              href="https://signal.me/#eu/EnEaHC7NjCVwnGkTEFNmNrnoxzrJx4KlTjPUK3kAmgVGBNmrO7VL1qXppTsEAyn0"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-transparent text-[#3A76F0] font-semibold rounded-md hover:bg-white/10 transition-colors flex items-center justify-center gap-2 outline outline-3 outline-[#3A76F0]"
            >
              <SiSignal size={24} />
              <span className="font-bold">Signal</span>
            </a>
            
            <button
              className="w-full py-3 px-4 bg-transparent hover:bg-white/10 text-[#0088CC] font-semibold rounded-md transition-colors flex items-center justify-center gap-2 outline outline-3 outline-[#0088CC]"
              onClick={() => {
                window.location.href = 'https://t.me/WeUpLA_DM'
              }}
            >
              <SiTelegram size={24} />
              <span className="font-bold">Telegram</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
} 