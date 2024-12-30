import { AppShell, Container, Grid, Card, Text, Image, Group, Badge, Burger, Button, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { ShoppingCart } from 'lucide-react'
import SidePanel from '@/components/SidePanel'
import { useState, useEffect } from 'react'
import { LetterPlaceholder } from '@/components/LetterPlaceholder'
import useCartStore from '@/store/cartStore'
import CartSidebar from '@/components/CartSidebar'

export default function ExoticsPage() {
  const [opened, { toggle: toggleNav, close: closeNav }] = useDisclosure()
  const [products, setProducts] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const addToCart = useCartStore(state => state.addToCart)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Fetch products for exotics category
    async function fetchExotics() {
      try {
        const response = await fetch('/api/products/exotics')
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching exotic products:', error)
      }
    }
    fetchExotics()
  }, [])

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      image: product.image_url,
      intown_price: product.intown_price,
      shipped_price: product.shipped_price,
      quantity: 1
    })
    // Optionally show cart after adding item
    setIsCartOpen(true)
  }

  // Add filtered products logic
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AppShell
      header={{ height: 60 }}
      padding="0"
      style={{ backgroundColor: 'transparent' }}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggleNav} size="sm" color="#f97316" />
          <button onClick={() => setIsCartOpen(true)} style={{ marginLeft: 'auto' }}>
            <ShoppingCart size={24} color="#f97316" />
          </button>
        </Group>
      </AppShell.Header>

      <SidePanel opened={opened} onClose={closeNav} />
      <CartSidebar 
        isCartOpen={isCartOpen} 
        setIsCartOpen={setIsCartOpen} 
        activePage="exotics" 
      />
      
      <AppShell.Main>
        <Container size="xl" py="xl">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <Text 
              size="2.5rem"
              fw={700}
              c="white"
              style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '0.5px'
              }}
            >
              Exotics
            </Text>
          </div>
          
          {/* Add search input */}
          <Container size="md" mb="xl">
            <TextInput
              placeholder="Search products..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              size="lg"
              radius="md"
              styles={{
                input: {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  '&:focus': {
                    borderColor: 'var(--mantine-color-orange-6)',
                  },
                },
              }}
            />
          </Container>

          <Grid>
            {filteredProducts.map((product) => (
              <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <Card 
                  shadow="sm" 
                  padding="lg" 
                  radius="md" 
                  withBorder 
                  bg="white"
                  style={{
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)'
                  }}
                >
                  <Card.Section>
                    {product.image_url && product.image_url.trim() ? (
                      <Image
                        src={product.image_url}
                        height={200}
                        alt={product.name}
                      />
                    ) : (
                      <div style={{ height: 200 }}>
                        <LetterPlaceholder name={product.name} />
                      </div>
                    )}
                  </Card.Section>

                  <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={700} c="black">{product.name}</Text>
                  </Group>

                  <Group gap="lg" mb="md">
                    <div>
                      <Text size="sm" fw={700} c="dark">In-town</Text>
                      <Text size="xl" fw={700} c="green.6">
                        ${product.intown_price}
                      </Text>
                    </div>
                    <div>
                      <Text size="sm" fw={700} c="dark">Shipped</Text>
                      <Text size="xl" fw={700} c="orange.6">
                        ${product.shipped_price}
                      </Text>
                    </div>
                  </Group>

                  <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                    {product.description}
                  </Text>

                  <Button 
                    variant="filled" 
                    color="orange" 
                    fullWidth 
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </AppShell.Main>
    </AppShell>
  )
} 