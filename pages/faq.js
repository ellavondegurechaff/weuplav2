import { AppShell, Container, Group, Burger, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { ShoppingCart } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import SidePanel from '@/components/SidePanel'
import CartSidebar from '@/components/CartSidebar'
import { useState } from 'react'
import { 
  SiTelegram, 
  SiSignal, 
  SiCashapp, 
  SiBitcoin, 
  SiZelle 
} from '@icons-pack/react-simple-icons'

// Custom markdown components for styling
const MarkdownComponents = {
  strong: ({ children }) => (
    <span className="font-bold text-white">{children}</span>
  ),
  em: ({ children }) => (
    <span className="italic text-white">{children}</span>
  ),
  p: ({ children }) => (
    <p className="text-white text-lg whitespace-pre-line">{children}</p>
  )
}

// Create a custom component for overnight shipping answer
const OvernightShippingAnswer = () => (
  <div className="text-white text-lg italic">
    <p>You can always add 2 day shipping or Overnight shipping services to any small order for the following rates:</p>
    
    <div className="mt-4">
      <div>
        <p className="flex items-start">
          • <strong>2 Day Shipping = $150</strong>
        </p>
        <p className="ml-3">(On top of order total)</p>
      </div>
      
      <div className="mt-2">
        <p className="flex items-start">
          • <strong>Overnight Shipping = $200</strong>
        </p>
        <p className="ml-3">(On top of order total)</p>
      </div>
    </div>
  </div>
)

// Create a custom component for shipping prices answer
const ShippingPricesAnswer = () => (
  <div className="text-white text-lg italic">
    <p>Yes, all prices on the menu are shipped prices. Depending on your location, regular transit times can take around 2 - 3 days.</p>
    
    <p className="mt-4 font-bold underline text-black">
      Ordering 4+ Ps will automatically upgrade your order to FREE OVERNIGHT SHIPPING!
    </p>
  </div>
)

// Create a custom component for getting started answer
const GettingStartedAnswer = () => (
  <div className="text-white text-lg italic">
    <p>
      First step, make sure you are <span className="underline">Verified</span>. Only clients who are <span className="underline">Verified</span> will get an immediate response. Once you are <span className="underline">Verified</span>, contact our sales rep on <span className="underline">Signal</span>. If you have an order in your <strong>CART</strong>, simply press copy list and send it over on <span className="underline">SIGNAL MESSENGER</span>. We will take payment and get your order out immediately! It's that <strong>SIMPLE</strong>.
    </p>
  </div>
)

// Create a custom component for verification answer
const VerificationAnswer = () => (
  <div className="text-white text-lg italic">
    <p>
      Send us a video to our <span className="underline">SIGNAL</span> showing Weed & Proof of Funds. Say "<strong>WeUpLA Verification</strong>" in the video or write it on a piece of paper. Show time & date. Our Verification team will review it and get back to you shortly. The better your verification, the faster we will approve!
    </p>
  </div>
)

export default function FAQPage() {
  const [opened, { toggle: toggleNav, close: closeNav }] = useDisclosure()
  const [isCartOpen, setIsCartOpen] = useState(false)

  const faqItems = [
    {
      question: 'How do I Verify?',
      answer: <VerificationAnswer />
    },
    {
      question: 'How do I get started on my first order?',
      answer: <GettingStartedAnswer />
    },
    {
      question: 'What payments are accepted?',
      answer: (
        <div className="flex flex-col gap-2 text-white text-lg italic">
          <p className="flex items-center gap-2">
            <SiCashapp size={20} />
            • Cashapp - <strong>6%</strong>
          </p>
          <p className="flex items-center gap-2">
            <SiZelle size={20} />
            • Zelle - <strong>5%</strong>
          </p>
          <p className="flex items-center gap-2">
            <SiBitcoin size={20} />
            • Crypto - <strong>4%</strong>
          </p>
          <p className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
            </svg>
            • Cash - <strong>0%</strong>
          </p>
        </div>
      )
    },
    {
      question: 'Do prices on the menu include shipping?',
      answer: <ShippingPricesAnswer />
    },
    {
      question: 'How long will my order take to ship?',
      answer: '*Our cutoff time is **12PM PST**. If you place your order before our cutoff time you will receive tracking same day.*'
    },
    {
      question: 'What if I want Overnight shipping but I\'m unable to buy 4+ Ps?',
      answer: <OvernightShippingAnswer />
    },
    {
      question: 'If I want to order bulk and get transportation to my city, do you offer that service?',
      answer: (
        <div className="text-white text-lg italic">
          <p>Yes, you can work closely with our sales to order <strong>TO-YOUR-DOOR</strong> delivery. Here are our requirements:</p>
          
          <div className="flex mt-4">
            <div className="flex-1">
              <p className="flex items-start">
                • <strong>50 P Minimum</strong>
              </p>
              <p className="ml-3">(For trucking to your city)</p>
            </div>
            
            <div className="flex-1">
              <p>• Trucking Rates will depend on your location. Work closely with a sales rep to ensure we get you the <strong>BEST RATES</strong>.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      question: 'Do you offer insurance on my shipping order?',
      answer: '*Yes, all orders are **100% insured**. If your package is seized or stuck in transit we will send a new box your way!*'
    }
  ]

  return (
    <AppShell
      header={{ height: 60 }}
      padding="0"
      style={{ backgroundColor: 'transparent' }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" style={{ justifyContent: 'space-between' }}>
          <Burger opened={opened} onClick={toggleNav} size="sm" color="#f97316" />
          <Text size="xl" fw={700} c="black">FAQ</Text>
          <button onClick={() => setIsCartOpen(true)}>
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
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <Text 
              size="2.5rem"
              fw={700}
              c="white"
              style={{
                letterSpacing: '0.5px'
              }}
            >
              Frequently Asked Questions
            </Text>
          </div>

          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="flex justify-center gap-4 mb-6">
              <a 
                href="https://signal.me/#eu/EnEaHC7NjCVwnGkTEFNmNrnoxzrJx4KlTjPUK3kAmgVGBNmrO7VL1qXppTsEAyn0" 
                className="bg-[#3A76F0] text-white px-6 py-3 rounded-md hover:bg-[#3A76F0]/90 transition-colors flex items-center gap-2 outline outline-3 outline-black font-semibold"
                style={{ minWidth: '140px' }}
              >
                <SiSignal size={24} />
                <span>Signal</span>
              </a>
              <a 
                href="https://t.me/WeUpLA_DM"
                className="bg-[#0088CC] text-white px-6 py-3 rounded-md hover:bg-[#0088CC]/90 transition-colors flex items-center gap-2 outline outline-3 outline-black font-semibold"
                style={{ minWidth: '140px' }}
              >
                <SiTelegram size={24} />
                <span>Telegram</span>
              </a>
            </div>
            
            <a 
              href="/allproducts" 
              className="inline-block bg-orange-400 text-white px-8 py-3 rounded-md hover:bg-orange-500/90 transition-colors outline outline-3 outline-black font-semibold"
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
                  marginBottom: index === faqItems.length - 1 ? 0 : '2.5rem'
                }}
              >
                <Text 
                  fw={700} 
                  mb="0.75rem" 
                  c="black"
                  size="23px"
                  className="flex gap-2 items-start"
                >
                  <span>{item.question}</span>
                </Text>
                <div className="flex gap-2 items-start">
                  {typeof item.answer === 'string' ? (
                    <ReactMarkdown components={MarkdownComponents}>
                      {item.answer}
                    </ReactMarkdown>
                  ) : (
                    item.answer
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 mt-12">
            <a 
              href="/allproducts" 
              className="inline-block bg-orange-400 text-white px-8 py-3 rounded-md hover:bg-orange-500/90 transition-colors outline outline-3 outline-black font-semibold"
            >
              VIEW MENU
            </a>
            
            <div className="flex justify-center gap-4 mt-6">
              <a 
                href="https://signal.me/#eu/EnEaHC7NjCVwnGkTEFNmNrnoxzrJx4KlTjPUK3kAmgVGBNmrO7VL1qXppTsEAyn0" 
                className="bg-[#3A76F0] text-white px-6 py-3 rounded-md hover:bg-[#3A76F0]/90 transition-colors flex items-center gap-2 outline outline-3 outline-black font-semibold"
                style={{ minWidth: '140px' }}
              >
                <SiSignal size={24} />
                <span>Signal</span>
              </a>
              <a 
                href="https://t.me/WeUpLA_DM"
                className="bg-[#0088CC] text-white px-6 py-3 rounded-md hover:bg-[#0088CC]/90 transition-colors flex items-center gap-2 outline outline-3 outline-black font-semibold"
                style={{ minWidth: '140px' }}
              >
                <SiTelegram size={24} />
                <span>Telegram</span>
              </a>
            </div>
          </div>
        </Container>
      </AppShell.Main>
    </AppShell>
  )
} 