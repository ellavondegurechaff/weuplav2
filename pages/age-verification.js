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
    if (password === 'Weupla2025') {
      setVerified(true)
      setCookie('age-verified', 'true', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
        sameSite: 'strict'
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
      <Container size="xs" className="relative">
        <Stack spacing={0} align="center">
          <div className="w-80 h-80 relative">
            <img
              src="/logo.png"
              alt="WeUp LA Logo"
              width={320}
              height={320}
              style={{ 
                maxWidth: '100%', 
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>

          <Stack 
            spacing={2} 
            w="100%" 
            className="relative -mt-32 px-4"
          >
            <Text fw={600} c="white" size="sm" ta="center">
              PASSWORD:
            </Text>

            <TextInput
              placeholder="Enter Password to access menu"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              size="md"
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
                  backgroundColor: 'transparent',
                  color: 'white',
                  width: '120px',
                  margin: '4px auto',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }
              }}
              onClick={handleVerification}
              className="outline outline-3 outline-white"
            >
              Enter
            </Button>

            <a
              href="https://signal.me/#eu/7e6gjYQJxASldq-HchkJjhVwfcm78NwjgRDAVHfVuum2WbooUKxPgaZKjbJtwD7G"
              className="bg-transparent text-white px-6 py-3 rounded-md hover:bg-white/10 transition-colors flex items-center gap-2 justify-center w-full outline outline-3 outline-white font-semibold"
            >
              <SiSignal size={20} />
              <span>Verify on Signal for password</span>
            </a>

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