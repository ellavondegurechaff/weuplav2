import { AppShell, Container, Grid, Card, Text, Image, Group, Badge, Burger, Button, TextInput, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { ShoppingCart } from 'lucide-react'
import Head from 'next/head'
import SidePanel from '@/components/SidePanel'
import { useState, useEffect } from 'react'
import { LetterPlaceholder } from '@/components/LetterPlaceholder'
import useCartStore from '@/store/cartStore'
import CartSidebar from '@/components/CartSidebar'
import { MediaCarousel } from '@/components/MediaCarousel'

export default function ExoticsPage() {
  const [opened, { toggle: toggleNav, close: closeNav }] = useDisclosure()
  const [products, setProducts] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const addToCart = useCartStore(state => state.addToCart)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMedia, setSelectedMedia] = useState({ url: null, isVideo: false })

  useEffect(() => {
    async function fetchExotics() {
      try {
        const response = await fetch('/api/products/exotics')
        const data = await response.json()
        // The API now returns media array directly, no need for transformation
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
      image: product.media?.[0]?.url || product.image_url,
      intown_price: product.intown_price,
      shipped_price: product.shipped_price,
      quantity: 1
    })
    setIsCartOpen(true)
  }

  // Add filtered products logic
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleImageClick = async (url, isVideo = false, productId) => {
    setSelectedMedia({ url, isVideo })
    
    try {
      const response = await fetch('/api/products/track-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId })
      })
      
      if (!response.ok) {
        throw new Error('Failed to track view')
      }

      const { views } = await response.json()
      
      // Update the view count in the products state
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId 
            ? { ...product, view_count: views }
            : product
        )
      )
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }

  return (
    <>
      <Head>
        <title>GOODSHOP</title>
      </Head>
      <AppShell
        header={{ height: 60 }}
        padding="0"
        style={{ backgroundColor: 'transparent' }}
      >
        <AppShell.Header>
          <Group h="100%" px="md" style={{ justifyContent: 'space-between' }}>
            <Burger opened={opened} onClick={toggleNav} size="sm" color="#f97316" />
            <Text size="xl" fw={700} c="black">Exotics</Text>
            <button onClick={() => setIsCartOpen(true)}>
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
            <Container size="sm" mb="xl">
              <TextInput
                placeholder="Search products..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                size="sm"
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
                      backgroundColor: 'white',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Card.Section 
                      style={{ 
                        cursor: 'pointer',
                        height: '300px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {product.media?.length > 0 ? (
                        <MediaCarousel 
                          media={product.media} 
                          onImageClick={(url, isVideo) => handleImageClick(url, isVideo, product.id)}
                        />
                      ) : (
                        <div style={{ height: '100%' }}>
                          <LetterPlaceholder name={product.name} />
                        </div>
                      )}
                    </Card.Section>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={700} c="black">{product.name}</Text>
                        <Badge 
                          variant="light" 
                          color="gray"
                          leftSection={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          }
                        >
                          {product.view_count || 0}
                        </Badge>
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

                      <Text 
                        size="sm" 
                        c="dimmed" 
                        mb="md" 
                        style={{ 
                          flex: 1,
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {product.description}
                      </Text>

                      <Button 
                        variant="light" 
                        color="orange" 
                        fullWidth 
                        onClick={() => handleAddToCart(product)}
                        className="bg-transparent text-orange-700 hover:bg-orange-500/10 
                          transition-colors outline outline-2 outline-orange-500 font-semibold"
                        styles={{
                          root: {
                            padding: '0.75rem 1rem',
                            borderRadius: '0.375rem',
                            backgroundColor: 'transparent',
                            '&:hover': {
                              backgroundColor: 'rgba(249, 115, 22, 0.1)',
                            },
                          }
                        }}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Container>
        </AppShell.Main>
      </AppShell>

      <Modal
        opened={!!selectedMedia.url}
        onClose={() => setSelectedMedia({ url: null, isVideo: false })}
        size="xl"
        padding={0}
        styles={{
          modal: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
          header: {
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: 1000,
          }
        }}
      >
        {selectedMedia.isVideo ? (
          <video
            src={selectedMedia.url}
            controls
            autoPlay
            style={{
              width: '100%',
              height: '90vh',
              objectFit: 'contain',
              backgroundColor: 'rgba(0, 0, 0, 0.8)'
            }}
          />
        ) : (
          <Image
            src={selectedMedia.url}
            alt="Full size preview"
            fit="contain"
            height="90vh"
          />
        )}
      </Modal>
    </>
  )
} 