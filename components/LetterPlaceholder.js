import { Text, Box } from '@mantine/core'

export function LetterPlaceholder({ name }) {
  const letter = name?.charAt(0)?.toUpperCase() || '?'
  
  return (
    <Box 
      bg="dark.6" 
      h="100%" 
      w="100%"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text size="40px" fw={700} c="dimmed">
        {letter}
      </Text>
    </Box>
  )
} 