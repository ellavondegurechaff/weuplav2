import { Card, Text, Group, ActionIcon } from '@mantine/core'
import { Download, Trash } from 'lucide-react'

export default function ScriptCard({ script }) {
  return (
    <Card
      withBorder
      className="bg-transparent border-white/20"
      style={{
        borderColor: 'rgba(255, 255, 255, 0.2)'
      }}
    >
      <Group justify="space-between" mb="xs">
        <Text className="font-mono" c="white">{script.name}</Text>
        <Group gap="xs">
          <ActionIcon variant="subtle" color="gray.0">
            <Download size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red">
            <Trash size={16} />
          </ActionIcon>
        </Group>
      </Group>

      <Text size="sm" c="dimmed" className="font-mono mb-2">
        License: {script.license}
      </Text>

      <Text size="sm" c="dimmed" className="font-mono">
        Uploaded: {script.uploaded}
      </Text>
    </Card>
  )
} 