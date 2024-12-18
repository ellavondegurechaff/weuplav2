import { Group, Burger, Title } from '@mantine/core'

export default function DashboardHeader({ opened, toggle }) {
  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Burger 
          opened={opened} 
          onClick={toggle} 
          size="sm"
          color="white"
        />
        <Title order={4} c="white" className="font-mono">AMARI PANEL</Title>
      </Group>
    </Group>
  )
} 