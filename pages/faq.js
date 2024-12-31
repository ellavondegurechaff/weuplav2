import { AppShell, Container, Group, Burger, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { ShoppingCart } from 'lucide-react'
import SidePanel from '@/components/SidePanel'
import CartSidebar from '@/components/CartSidebar'
import { useState } from 'react'
import { SiTelegram, SiSignal } from '@icons-pack/react-simple-icons'

export default function FAQPage() {
  const [opened, { toggle: toggleNav, close: closeNav }] = useDisclosure()
  const [isCartOpen, setIsCartOpen] = useState(false)

  const faqItems = [
    {
      question: 'How do I verify?',
      answer: 'Send us a video on SIGNAL showing Weed & Proof of Funds. Say "WeUpLA for Verification" in the video or write it on a piece of paper. Show the ID & date. Our Verification team will review it and get back to you shortly. The better your verification, the faster your approval!'
    },
    {
      question: 'How do I get started on my first order?',
      answer: 'First step, make sure you are Verified. Only clients who are Verified will get an immediate response. Once you are Verified, contact our sales rep on Signal. If you have an order in your CART, simply press copy list and send it over on SIGNAL MESSENGER. We will tell you payment and get your order out immediately! It\'s that SIMPLE.'
    },
    {
      question: 'What payments are accepted?',
      answer: '• Cashapp....... 6%\n• Zelle............ 5%\n• Crypto.......... 4%\n• Cash Mail in 0%'
    },
    {
      question: 'Do prices on the menu include shipping?',
      answer: 'Yes, all prices on the menu are shipped prices. Depending on your location, regular transit times can take around 2 - 3 days.'
    },
    {
      question: 'How long will my order take to ship?',
      answer: 'Our cutoff time is 12PM PST. If you place your order before our cutoff time you will receive tracking same day!'
    },
    {
      question: 'What if I want Overnight shipping but I\'m unable to buy 4+ Ps?',
      answer: 'You can always add 2 day shipping or Overnight shipping services to any small order for the following rates:\n\n• 2 Day Shipping = $150\n(On top of order total)\n\n• Overnight Shipping = $200\n(On top of order total)'
    },
    {
      question: 'If I want to order bulk and get transportation to my city, do you offer that service?',
      answer: 'Yes, you can work closely with our sales to order TO-YOUR-DOOR delivery. Here are our requirements:\n\n• 50 P Minimum\n(For trucking to your city)\n\n• Trucking Rates will depend on your location. Work closely with a sales rep to ensure we get you the BEST RATES.'
    },
    {
      question: 'Do you offer insurance on my shipping order?',
      answer: 'Yes, all orders are 100% insured. If your package is seized or stuck in transit we will send a new box your way!'
    }
  ]

  return (
    <AppShell
      header={{ height: 60 }}
      padding="0"
      style={{ backgroundColor: 'transparent' }}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggleNav} size="sm" color="#f97316" />
          <button onClick={() => setIsCartOpen(true)} style={{ marginLeft: 'auto' }}>
            <ShoppingCart size={24} color="#f97316" />
          </button>
        </Group>
      </AppShell.Header>

      <SidePanel opened={opened} onClose={closeNav} />
      <CartSidebar 
        isCartOpen={isCartOpen} 
        setIsCartOpen={setIsCartOpen} 
        activePage="faq" 
      />
      
      <AppShell.Main>
        <Container size="xl" py="xl">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Text 
              size="2.5rem"
              fw={700}
              c="white"
              style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '0.5px'
              }}
            >
              Frequently Asked Questions
            </Text>
          </div>

          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="flex justify-center gap-4 mb-6">
              <a 
                href="/signal" 
                className="bg-[#3A76F0] text-white px-6 py-2 rounded-lg hover:bg-[#3A76F0]/90 transition-colors flex items-center gap-2"
                style={{ minWidth: '140px' }}
              >
                <SiSignal size={24} />
                <span className="font-bold">Signal</span>
              </a>
              <a 
                href="/telegram" 
                className="bg-[#0088CC] text-white px-6 py-2 rounded-lg hover:bg-[#0088CC]/90 transition-colors flex items-center gap-2"
                style={{ minWidth: '140px' }}
              >
                <SiTelegram size={24} />
                <span className="font-bold">Telegram</span>
              </a>
            </div>
            
            <a 
              href="/allproducts" 
              className="inline-block bg-orange-400 text-white font-semibold px-8 py-2 rounded-lg hover:bg-orange-500 transition-colors"
            >
              VIEW MENU
            </a>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0)',
              borderRadius: '0.375rem',
              padding: '2rem'
            }}
          >
            {faqItems.map((item, index) => (
              <div
                key={index}
                style={{
                  marginBottom: index === faqItems.length - 1 ? 0 : '2rem'
                }}
              >
                <Text fw={600} mb="0.5rem" c="white">
                  {item.question}
                </Text>
                <Text style={{ whiteSpace: 'pre-line' }} c="white">
                  {item.answer}
                </Text>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 mt-12">
            <a 
              href="/allproducts" 
              className="inline-block bg-orange-400 text-white font-semibold px-8 py-2 rounded-lg hover:bg-orange-500 transition-colors"
            >
              VIEW MENU
            </a>
            
            <div className="flex justify-center gap-4 mt-6">
              <a 
                href="/signal" 
                className="bg-[#3A76F0] text-white px-6 py-2 rounded-lg hover:bg-[#3A76F0]/90 transition-colors flex items-center gap-2"
                style={{ minWidth: '140px' }}
              >
                <SiSignal size={24} />
                <span className="font-bold">Signal</span>
              </a>
              <a 
                href="/telegram" 
                className="bg-[#0088CC] text-white px-6 py-2 rounded-lg hover:bg-[#0088CC]/90 transition-colors flex items-center gap-2"
                style={{ minWidth: '140px' }}
              >
                <SiTelegram size={24} />
                <span className="font-bold">Telegram</span>
              </a>
            </div>
          </div>
        </Container>
      </AppShell.Main>
    </AppShell>
  )
} 