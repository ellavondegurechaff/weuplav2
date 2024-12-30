import React from 'react'
import { AppShell, Burger, Group, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { ShoppingCart } from 'lucide-react'
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
        activePage="home" 
      />

      <AppShell.Main>
        <MainContent />
      </AppShell.Main>
    </AppShell>
  )
}