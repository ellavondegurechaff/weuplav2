import { Card, Text, Badge, Group, ActionIcon, CopyButton, Tooltip, Stack, Divider } from '@mantine/core'
import { Copy, Calendar, User } from 'lucide-react'

export default function LicenseCard({ license }) {
  return (
    <Card
      withBorder
      padding="lg"
      radius="md"
      className="bg-transparent"
      style={{
        borderColor: 'rgba(255, 255, 255, 0.2)',
        transition: 'all 0.2s ease'
      }}
    >
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Text className="font-mono text-xs uppercase" c="dimmed">Amari License</Text>
            <Text className="font-mono" c="white" size="sm">{license.amariKey}</Text>
          </Stack>
          <CopyButton value={license.amariKey}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'}>
                <ActionIcon 
                  variant="subtle" 
                  color="gray.0" 
                  onClick={copy}
                >
                  <Copy size={16} />
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>

        <Divider color="rgba(255, 255, 255, 0.1)" />

        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Text className="font-mono text-xs uppercase" c="dimmed">Macho License</Text>
            <Text className="font-mono" c="white" size="sm">{license.machoKey}</Text>
          </Stack>
          <CopyButton value={license.machoKey}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'}>
                <ActionIcon 
                  variant="subtle" 
                  color="gray.0" 
                  onClick={copy}
                >
                  <Copy size={16} />
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>

        <Stack gap="xs" mt="sm">
          <Group justify="space-between">
            <Group gap="xs">
              <User size={14} className="text-gray-400" />
              <Text size="sm" c="dimmed" className="font-mono">
                {license.user}
              </Text>
            </Group>
            <Badge 
              variant={license.status === 'active' ? 'filled' : 'outline'}
              color={license.status === 'active' ? 'green' : 'red'}
            >
              {license.status}
            </Badge>
          </Group>
          <Group gap="xs">
            <Calendar size={14} className="text-gray-400" />
            <Text size="sm" c="dimmed" className="font-mono">
              Expires: {license.expiresAt}
            </Text>
          </Group>
        </Stack>
      </Stack>
    </Card>
  )
} 