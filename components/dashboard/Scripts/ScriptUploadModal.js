import { Modal, Group, Text, Button, Stack, TextInput } from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import { FileText, Upload, X } from 'lucide-react'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'

export default function ScriptUploadModal({ opened, onClose, onUpload }) {
  const [file, setFile] = useState(null)
  const [amariKey, setAmariKey] = useState('')
  const [machoKey, setMachoKey] = useState('')

  const handleDrop = (files) => {
    const uploadedFile = files[0]
    if (!uploadedFile.name.endsWith('.lua')) {
      notifications.show({
        title: 'Invalid File',
        message: 'Please upload a .lua file',
        color: 'red'
      })
      return
    }
    setFile(uploadedFile)
  }

  const handleUpload = async () => {
    if (!file || !amariKey || !machoKey) {
      notifications.show({
        title: 'Missing Fields',
        message: 'Please fill in all fields and upload a file',
        color: 'red'
      })
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('amariKey', amariKey)
    formData.append('machoKey', machoKey)

    try {
      const response = await fetch('/api/scripts/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      notifications.show({
        title: 'Success',
        message: 'Script uploaded successfully',
        color: 'green'
      })

      onUpload(data)
      onClose()
      setFile(null)
      setAmariKey('')
      setMachoKey('')
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to upload script',
        color: 'red'
      })
    }
  }

  return (
    <Modal 
      opened={opened} 
      onClose={onClose}
      title="Upload Script"
      centered
      styles={{
        title: {
          color: 'white',
          fontFamily: 'monospace'
        },
        body: {
          background: 'transparent'
        }
      }}
    >
      <Stack gap="md">
        <Dropzone
          onDrop={handleDrop}
          accept={['.lua']}
          maxSize={5 * 1024 * 1024}
          className="border-dashed border-2 border-white/20 bg-transparent"
        >
          <Group justify="center" gap="xl" style={{ minHeight: 120, pointerEvents: 'none' }}>
            {file ? (
              <Stack align="center" gap="xs">
                <FileText size={32} className="text-white/70" />
                <Text className="font-mono" size="sm" c="dimmed">
                  {file.name}
                </Text>
              </Stack>
            ) : (
              <Stack align="center" gap="xs">
                <Upload size={32} className="text-white/70" />
                <Text className="font-mono" size="sm" c="dimmed">
                  Drag & drop or click to upload .lua file
                </Text>
              </Stack>
            )}
          </Group>
        </Dropzone>

        <TextInput
          label="Amari Key"
          placeholder="Enter your Amari key"
          value={amariKey}
          onChange={(e) => setAmariKey(e.target.value)}
          className="font-mono"
        />

        <TextInput
          label="Macho Key"
          placeholder="Enter your Macho key"
          value={machoKey}
          onChange={(e) => setMachoKey(e.target.value)}
          className="font-mono"
        />

        <Group justify="flex-end" mt="md">
          <Button
            variant="subtle"
            color="red"
            onClick={onClose}
            leftSection={<X size={14} />}
            className="font-mono"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            leftSection={<Upload size={14} />}
            className="font-mono"
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
            Upload
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
} 