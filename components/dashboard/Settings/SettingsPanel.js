import { Stack, Title, Switch, Text, Paper, Group } from '@mantine/core'

export default function SettingsPanel() {
  return (
    <Stack>
      <Title order={2} c="white" className="font-mono mb-6">Settings</Title>
      
      <Paper 
        p="lg"
        className="bg-transparent border border-white/20"
      >
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text c="white" className="font-mono mb-1">Dark Mode</Text>
              <Text size="sm" c="dimmed" className="font-mono">
                Toggle dark/light theme
              </Text>
            </div>
            <Switch defaultChecked size="lg" />
          </Group>

          <Group justify="space-between">
            <div>
              <Text c="white" className="font-mono mb-1">Notifications</Text>
              <Text size="sm" c="dimmed" className="font-mono">
                Enable push notifications
              </Text>
            </div>
            <Switch size="lg" />
          </Group>
        </Stack>
      </Paper>
    </Stack>
  )
} 