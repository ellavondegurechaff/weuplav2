import React, { useState } from 'react';
import { Container, AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Clock, MapPin, CreditCard, Package } from 'lucide-react';
import { SiTelegram, SiSignal, SiCashapp, SiBitcoin, SiZelle } from '@icons-pack/react-simple-icons'
import CartSidebar from '@/components/CartSidebar'
import { NavHeader } from '@/components/NavHeader'
import SidePanel from '@/components/SidePanel'

export default function MainContent() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [opened, { toggle, close }] = useDisclosure(false)

  return (
    <AppShell
      header={{ height: 60 }}
      padding="0"
      style={{ backgroundColor: 'transparent' }}
    >
      <AppShell.Header>
        <NavHeader 
          opened={opened} 
          toggleNav={toggle}
          setIsCartOpen={setIsCartOpen}
          showImage={true}
          imagePath="/home.png"
          showCart={true}
          title="Home"
        />
      </AppShell.Header>

      <SidePanel opened={opened} onClose={close} />
      
      <AppShell.Main>
        <Container 
          size="xl" 
          className="px-4 pb-6 text-white main-content-text -mt-12"
        >
          {/* Contact Us Image - Increased size */}
          <div className="flex justify-center mb-3">
            <img 
              src="/contact_us.png" 
              alt="Contact Us"
              className="max-w-[300px] h-auto relative z-10"
            />
          </div>

          {/* Social Media Buttons with consistent gap */}
          <div className="flex flex-col items-center gap-1 mb-3">
            <div className="flex justify-center gap-4 mb-2">
              <a 
                href="https://signal.me/#eu/EnEaHC7NjCVwnGkTEFNmNrnoxzrJx4KlTjPUK3kAmgVGBNmrO7VL1qXppTsEAyn0"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent text-white px-6 py-3 rounded-md hover:bg-white/10 transition-colors flex items-center gap-2 outline outline-3 outline-white font-semibold button-text"
                style={{ width: '160px', justifyContent: 'center' }}
              >
                <SiSignal size={24} />
                <span>Signal</span>
              </a>
              <a 
                href="https://t.me/WeUpLA_DM"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent text-white px-6 py-3 rounded-md hover:bg-white/10 transition-colors flex items-center gap-2 outline outline-3 outline-white font-semibold button-text"
                style={{ width: '160px', justifyContent: 'center' }}
              >
                <SiTelegram size={24} />
                <span>Telegram</span>
              </a>
            </div>
            
            <a 
              href="/allproducts" 
              className="inline-block bg-transparent text-white px-8 py-3 rounded-md hover:bg-white/10 transition-colors outline outline-3 outline-white font-semibold button-text"
            >
              VIEW MENU
            </a>
          </div>

          {/* Main Content - Centered */}
          <div className="max-w-2xl mx-auto text-center text-white">
            {/* Shipping and Hours Section */}
            <div className="flex justify-center items-center gap-8 mb-6">
              <div>
                <h2 className="font-bold mb-1 text-white"><u>SHIPPING</u></h2>
                <p className="font-bold text-white">100% Insured</p>
                <p className="font-bold text-white">Available 24/7</p>
              </div>
              <div className="h-12 w-px bg-gray-300" />
              <div>
                <h2 className="font-bold mb-1 text-white"><u>INTOWN</u></h2>
                <p className="font-bold text-white">Monday - Sunday</p>
                <p className="font-bold text-white">1pm - 6pm</p>
              </div>
            </div>

            <p className="mb-8 font-bold text-white">
              Menu Updated Daily. Over 100+ Flavors available at all times. Best Prices 
              guaranteed. All Touchdowns are insured with fast and discreet shipping 
              methods. Contact us now to place your orders.
            </p>

            <div className="mb-8">
              <h3 className="font-bold mb-4 text-white"><u>PAYMENTS ACCEPTED</u></h3>
              <div className="grid grid-cols-2 gap-y-2 gap-x-8 max-w-[300px] mx-auto font-bold text-white">
                <div className="flex items-center gap-2">
                  <SiCashapp size={20} className="min-w-[20px]" />
                  <span className="whitespace-nowrap text-sm">Cashapp - 6%</span>
                </div>
                <div className="flex items-center gap-2">
                  <SiBitcoin size={20} className="min-w-[20px]" />
                  <span className="whitespace-nowrap text-sm">Crypto - 4%</span>
                </div>
                <div className="flex items-center gap-2">
                  <SiZelle size={20} className="min-w-[20px]" />
                  <span className="whitespace-nowrap text-sm">Zelle - 5%</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 min-w-[20px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                  </svg>
                  <span className="whitespace-nowrap text-sm">Cash - 0%</span>
                </div>
              </div>
            </div>

            <div className="mb-8 font-bold text-white">
              <p>✓ Transporation Service Available</p>
              <p>✓ Bread Routing Available</p>
              <p>For Bulk Players 🏃</p>
            </div>

            {/* Bottom Menu Button and Social Media Buttons */}
            <div className="flex flex-col items-center gap-2">
              <a 
                href="/allproducts" 
                className="inline-block bg-transparent text-white px-8 py-3 rounded-md hover:bg-white/10 transition-colors outline outline-3 outline-white font-semibold button-text"
              >
                VIEW MENU
              </a>
              
              <div className="flex justify-center gap-4 mt-2">
                <a 
                  href="https://signal.me/#eu/EnEaHC7NjCVwnGkTEFNmNrnoxzrJx4KlTjPUK3kAmgVGBNmrO7VL1qXppTsEAyn0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-transparent text-white px-6 py-3 rounded-md hover:bg-white/10 transition-colors flex items-center gap-2 outline outline-3 outline-white font-semibold button-text"
                  style={{ width: '160px', justifyContent: 'center' }}
                >
                  <SiSignal size={24} />
                  <span>Signal</span>
                </a>
                <a 
                  href="https://t.me/WeUpLA_DM"
                  className="bg-transparent text-white px-6 py-3 rounded-md hover:bg-white/10 transition-colors flex items-center gap-2 outline outline-3 outline-white font-semibold button-text"
                  style={{ width: '160px', justifyContent: 'center' }}
                >
                  <SiTelegram size={24} />
                  <span>Telegram</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </AppShell.Main>

      <CartSidebar 
        isCartOpen={isCartOpen} 
        setIsCartOpen={setIsCartOpen}
        activePage="home"
      />
    </AppShell>
  )
}