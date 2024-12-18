import { Stack, Group, Title, Button, Grid, LoadingOverlay } from '@mantine/core'
import { Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import ScriptCard from './ScriptCard'
import ScriptUploadModal from './ScriptUploadModal'

export default function ScriptManagement() {
  const [scripts, setScripts] = useState([])
  const [uploadModalOpened, setUploadModalOpened] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchScripts()
  }, [])

  const fetchScripts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/scripts')
      const data = await response.json()
      setScripts(data)
    } catch (error) {
      console.error('Failed to fetch scripts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = (newScript) => {
    setScripts(prev => [...prev, newScript])
  }

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Group justify="space-between" mb="lg">
        <Title order={2} c="white" className="font-mono">Script Management</Title>
        <Button
          leftSection={<Plus size={14} />}
          className="font-mono"
          variant="filled"
          onClick={() => setUploadModalOpened(true)}
          styles={{
            root: {
              backgroundColor: 'white',
              color: 'black',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }
            }
          }}
        >
          Upload Script
        </Button>
      </Group>

      <Grid>
        {scripts.map((script) => (
          <Grid.Col key={script.id} span={{ base: 12, md: 6 }}>
            <ScriptCard script={script} onDelete={fetchScripts} />
          </Grid.Col>
        ))}
      </Grid>

      <ScriptUploadModal
        opened={uploadModalOpened}
        onClose={() => setUploadModalOpened(false)}
        onUpload={handleUpload}
      />
    </Stack>
  )
} 