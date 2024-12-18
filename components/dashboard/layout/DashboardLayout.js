'use client'

import { useEffect, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LoadingOverlay, Avatar, Text, Button, Stack, Group, Badge, Box } from '@mantine/core'
import { AppShell, Container, Transition } from '@mantine/core'
import { LogOut } from 'lucide-react'
import DashboardHeader from './DashboardHeader'
import DashboardNavbar from './DashboardNavbar'
import { AnimatePresence } from 'framer-motion'
import FadeTransition from '../../ui/FadeTransition'

export default function DashboardLayout({ children, activeTab, setActiveTab }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [opened, setOpened] = useState(true)
  const [licenseStatus, setLicenseStatus] = useState('checking')

  const handleToggle = () => {
    setOpened(prev => !prev)
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  useEffect(() => {
    async function checkLicense() {
      if (session?.user?.discordId) {
        try {
          const response = await fetch(`/api/licensecheck?userId=${session.user.discordId}`)
          const data = await response.json()
          setLicenseStatus(data.status)
        } catch (error) {
          console.error('License check error:', error)
          setLicenseStatus('error')
        }
      }
    }
    checkLicense()
  }, [session])

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: !opened }
      }}
      padding={0}
    >
      <AppShell.Header style={{ 
        background: 'rgba(0, 0, 0, 0.95)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <DashboardHeader opened={opened} toggle={handleToggle} />
      </AppShell.Header>

      <AppShell.Navbar style={{ 
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Stack h="100%" justify="space-between" p="md">
          <Stack>
            {/* Centered Profile Section */}
            <Box ta="center" mb="xl">
              <Stack align="center" gap="xs">
                <Avatar 
                  size="xl" 
                  src={session?.user?.image}
                  radius="md"
                />
                <Stack gap={2}>
                  <Text size="sm" c="white" className="font-mono">
                    {session?.user?.discordTag}
                  </Text>
                  <Badge 
                    variant="dot"
                    color={licenseStatus === 'active' ? 'green' : 'red'}
                    size="sm"
                  >
                    {licenseStatus === 'checking' ? 'Checking...' : 
                     licenseStatus === 'active' ? 'Licensed' : 'No License'}
                  </Badge>
                </Stack>
              </Stack>
            </Box>

            {/* Navigation */}
            <DashboardNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
          </Stack>

          {/* Logout Button */}
          <Button
            variant="subtle"
            color="red"
            leftSection={<LogOut size={16} />}
            onClick={() => signOut()}
            className="font-mono"
          >
            Logout
          </Button>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main 
        style={{ 
          background: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(10,10,10,1) 100%)',
          minHeight: '100vh'
        }}
      >
        <AnimatePresence mode="wait">
          <FadeTransition>
            <Transition
              mounted={true}
              transition="fade"
              duration={200}
              timingFunction="ease"
            >
              {(styles) => (
                <Container size="xl" py="xl" style={styles}>
                  {children}
                </Container>
              )}
            </Transition>
          </FadeTransition>
        </AnimatePresence>
      </AppShell.Main>
    </AppShell>
  )
} 