import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { NavHeader } from '@/components/NavHeader'
import SidePanel from '@/components/SidePanel'
import MainContent from '@/components/MainContent'
import CartSidebar from '@/components/CartSidebar'
import { useState } from 'react'

export default function WelcomePage() {
  const [opened, { toggle: toggleNav, close: closeNav }] = useDisclosure()
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <AppShell
      header={{ height: 60 }}
      padding="0"
      style={{ backgroundColor: 'transparent' }}
    >
      <AppShell.Header style={{ backgroundColor: 'white' }}>
        <NavHeader 
          opened={opened} 
          toggleNav={toggleNav}
          title="Home" 
          setIsCartOpen={setIsCartOpen}
        />
      </AppShell.Header>

      <SidePanel opened={opened} onClose={closeNav} />
      <CartSidebar 
        isCartOpen={isCartOpen} 
        setIsCartOpen={setIsCartOpen} 
        activePage="home" 
      />

      <AppShell.Main>
        <MainContent />
      </AppShell.Main>
    </AppShell>
  )
}