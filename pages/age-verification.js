import { useState } from 'react'
import { Text, TextInput, Button, Container, Stack } from '@mantine/core'
import { useRouter } from 'next/router'
import Image from 'next/image'
import useAgeVerification from '@/lib/useAgeVerification'
import { setCookie } from 'cookies-next'
import { SiSignal } from 'react-icons/si'

export default function AgeVerification() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const setVerified = useAgeVerification((state) => state.setVerified)

  const handleVerification = () => {    
    if (password === 'weupla2024') {
      setVerified(true)
      setCookie('age-verified', 'true', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      })
      router.push('/')
    } else {
      setError('Invalid password')
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url("/desktop_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Container size="xs">
        <Stack spacing="xl" align="center">
          <div className="w-48 h-48 relative mb-4">
            <img
              src="/logo.png"
              alt="WeUp LA Logo"
              width={192}
              height={192}
              style={{ 
                maxWidth: '100%', 
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>

          <Text 
            size="lg" 
            fw={600} 
            c="white" 
            ta="center"
            className="mb-6"
          >
            You must be 21 or older to access this application.
          </Text>

          <Stack spacing="md" w="100%">
            <Text fw={600} c="white" size="sm" mt="md" ta="center">
              PASSWORD:
            </Text>

            <TextInput
              placeholder="Enter Password to access menu"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              size="lg"
              styles={{
                input: {
                  backgroundColor: 'white',
                  '&:focus': {
                    borderColor: 'white'
                  }
                }
              }}
            />

            <Button
              size="md"
              variant="filled"
              styles={{
                root: {
                  backgroundColor: 'white',
                  color: '#FF4500',
                  width: '120px',
                  margin: '0 auto',
                  '&:hover': {
                    backgroundColor: '#f8f9fa'
                  }
                }
              }}
              onClick={handleVerification}
            >
              Enter
            </Button>

            <Button
              fullWidth
              size="lg"
              variant="filled"
              styles={{
                root: {
                  backgroundColor: '#3A76F0', // Signal blue color
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#2861d4'
                  }
                },
                inner: {
                  justifyContent: 'center', // Center the content
                  gap: '12px' // Equal spacing between icon and text
                }
              }}
              onClick={() => window.open('https://signal.me/#p/+18189225587', '_blank')}
              leftSection={<SiSignal size={20} />} // Slightly smaller icon for better balance
            >
              Verify on Signal for password
            </Button>

            {error && (
              <Text c="red.3" size="sm" ta="center">
                {error}
              </Text>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  )
} 