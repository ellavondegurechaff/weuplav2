import { useState } from 'react'
import { Text, TextInput, Button, Container, Stack } from '@mantine/core'
import { useRouter } from 'next/router'
import Image from 'next/image'
import useAgeVerification from '@/lib/useAgeVerification'
import { setCookie } from 'cookies-next'

export default function AgeVerification() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const setVerified = useAgeVerification((state) => state.setVerified)

  const handleVerification = (isOver21) => {
    if (!isOver21) {
      setError('You must be 21 or older to access this site')
      return
    }
    
    if (password === 'weupla2024') {
      // Set verification status
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
        backgroundImage: 'url("/bg-orange.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Container size="xs">
        <Stack spacing="xl" align="center">
          <div className="w-48 h-48 relative mb-4">
            <Image
              src="/logo.png"
              alt="WeUp LA Logo"
              width={192}
              height={192}
              priority
            />
          </div>

          <Text 
            size="lg" 
            fw={600} 
            c="white" 
            ta="center"
            className="mb-6"
          >
            You must be 21 or older to access this application, please verify your age below.
          </Text>

          <Stack spacing="md" w="100%">
            <Button
              fullWidth
              size="lg"
              variant="filled"
              styles={{
                root: {
                  backgroundColor: 'white',
                  color: '#FF4500',
                  '&:hover': {
                    backgroundColor: '#f8f9fa'
                  }
                }
              }}
              onClick={() => handleVerification(true)}
            >
              Yes I am 21 or Older
            </Button>

            <Button
              fullWidth
              size="lg"
              variant="outline"
              color="white"
              onClick={() => handleVerification(false)}
              styles={{
                root: {
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }
              }}
            >
              No, I am under 21
            </Button>

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