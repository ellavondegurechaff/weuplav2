import { Center, Text } from '@mantine/core'

export function LetterPlaceholder({ name }) {
  const letter = name ? name.charAt(0).toUpperCase() : '?'
  
  return (
    <Center h="100%" bg="gray.1">
      <Text size="xl" weight={700} color="gray.5">
        {letter}
      </Text>
    </Center>
  )
} 