import { Stack, Group, Title, Button, Grid, Text, TextInput, Card, LoadingOverlay, Badge } from '@mantine/core'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { notifications } from '@mantine/notifications'
import { useForm } from '@mantine/form'
import LicenseCard from './LicenseCard'
import { useSession } from 'next-auth/react'
import FadeTransition from '../../ui/FadeTransition'

export default function RedeemManagement() {
  const [licenses, setLicenses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasActiveLicense, setHasActiveLicense] = useState(false)
  const { data: session } = useSession()

  const AMARI_KEY_PATTERN = /^AMARI-[A-Z0-9]{4}-[A-Z0-9]{4}$/
  const MACHO_KEY_PATTERN = /^MACHO-FIVEM-[A-Z0-9]{5}-[A-Z0-9]{5}$/

  const form = useForm({
    initialValues: {
      amariKey: '',
      machoKey: ''
    },
    validate: {
      amariKey: (value) => {
        if (!value) return 'Amari key is required'
        if (!AMARI_KEY_PATTERN.test(value)) {
          return 'Invalid Amari key format (e.g., AMARI-SDSD-49DK)'
        }
        return null
      },
      machoKey: (value) => {
        if (!value) return 'Macho key is required'
        if (!MACHO_KEY_PATTERN.test(value)) {
          return 'Invalid Macho key format (e.g., MACHO-FIVEM-GAFYA-CDEYG)'
        }
        return null
      }
    },
  })

  useEffect(() => {
    if (session?.user?.discordId) {
      fetch(`/api/licensecheck?userId=${session.user.discordId}`)
        .then(res => res.json())
        .then(data => {
          setHasActiveLicense(data.hasLicense)
        })
    }
  }, [session?.user?.discordId])

  const handleRedeemKey = async (values) => {
    const validation = form.validate()
    if (validation.hasErrors) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amariKey: values.amariKey,
          machoKey: values.machoKey,
          userId: session?.user?.discordId,
          discordTag: session?.user?.discordTag
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      setLicenses(prev => [...prev, {
        id: data.id,
        amariKey: data.amari_key,
        machoKey: data.macho_key,
        status: data.status,
        user: data.discord_tag,
        redeemedAt: new Date(data.redeemed_at).toLocaleDateString(),
        expiresAt: new Date(data.expires_at).toLocaleDateString()
      }])

      setHasActiveLicense(true)
      notifications.show({
        title: 'Success',
        message: 'Keys redeemed successfully',
        color: 'green'
      })

      form.reset()
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to redeem keys',
        color: 'red'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderContent = () => {
    if (hasActiveLicense) {
      return (
        <FadeTransition>
          <Stack pos="relative" align="center" justify="center" h={400}>
            <Card
              withBorder
              padding="xl"
              radius="md"
              className="bg-transparent text-center"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.2)',
                maxWidth: 500
              }}
            >
              <Stack gap="md">
                <Title order={2} c="white" className="font-mono">
                  License Active
                </Title>
                <Text c="dimmed" size="lg" className="font-mono">
                  Your license has been successfully redeemed and is currently active.
                </Text>
              </Stack>
            </Card>
          </Stack>
        </FadeTransition>
      )
    }

    return (
      <FadeTransition>
        <Stack pos="relative">
          <LoadingOverlay visible={isLoading} />
          <Group justify="space-between" align="center" mb="xl">
            <div>
              <Title order={2} c="white" className="font-mono">Redeem Management</Title>
              <Text c="dimmed" size="sm" mt={4} className="font-mono">
                Redeem and manage your license keys
              </Text>
            </div>
          </Group>

          <Card
            withBorder
            padding="lg"
            radius="md"
            className="bg-transparent mb-6"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }}
          >
            <form onSubmit={form.onSubmit(handleRedeemKey)}>
              <Stack gap="md">
                <TextInput
                  {...form.getInputProps('amariKey')}
                  placeholder="Enter your Amari key"
                  className="font-mono"
                  size="md"
                />
                <Group align="flex-start" style={{ width: '100%' }}>
                  <TextInput
                    {...form.getInputProps('machoKey')}
                    placeholder="Enter your Macho key"
                    className="font-mono flex-grow"
                    size="md"
                  />
                  <Button
                    type="submit"
                    variant="filled"
                    size="md"
                    className="font-mono"
                    loading={isLoading}
                    styles={{
                      root: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: 'black',
                        '&:hover': {
                          backgroundColor: 'white'
                        }
                      }
                    }}
                  >
                    Redeem Keys
                  </Button>
                </Group>
              </Stack>
            </form>
          </Card>

          <Grid>
            {licenses.map((license) => (
              <Grid.Col key={license.id} span={{ base: 12, sm: 6 }}>
                <LicenseCard license={license} />
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </FadeTransition>
    )
  }

  return renderContent()
}