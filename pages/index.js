import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { NavHeader } from '@/components/NavHeader'
import SidePanel from '@/components/SidePanel'
import MainContent from '@/components/MainContent'
import CartSidebar from '@/components/CartSidebar'
import { useState } from 'react'
import { SITE_TITLE } from '@/utils/constants'
import Head from 'next/head'

export default function WelcomePage() {
  const [opened, { toggle: toggleNav, close: closeNav }] = useDisclosure()
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <>
      <Head>
        <title>{SITE_TITLE} - Home</title>
      </Head>
      <AppShell
        header={{ height: 80 }}
        padding="0"
        style={{ backgroundColor: 'transparent' }}
      >
        <AppShell.Header>
          <NavHeader 
            opened={opened} 
            toggleNav={toggleNav}
            setIsCartOpen={setIsCartOpen}
            showImage={true}
            imagePath="/home.png"
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
    </>
  )
}