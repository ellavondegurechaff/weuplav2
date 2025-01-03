import { Group, Burger, Text } from '@mantine/core'
import { ShoppingCart } from 'lucide-react'
import useCartStore from '@/store/cartStore'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export function NavHeader({ 
  opened, 
  toggleNav, 
  title = '',
  setIsCartOpen, 
  showImage = false,
  imagePath = '',
  showCart = true
}) {
  const [isMounted, setIsMounted] = useState(false)
  const cart = useCartStore(state => state.cart)
  const getCartCount = useCartStore(state => state.getCartCount)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Group h="100%" px="md" style={{ justifyContent: 'space-between' }}>
      <Burger opened={opened} onClick={toggleNav} size="sm" color="#f97316" />
      
      {showImage && imagePath ? (
        <div className="flex-1 flex justify-center">
          <Image
            src={imagePath}
            alt={title || 'Header Image'}
            width={200}
            height={40}
            priority
            className="h-[40px] w-auto object-contain max-w-[160px] sm:max-w-[200px]"
            style={{ marginTop: '10px', marginBottom: '10px' }}
          />
        </div>
      ) : (
        <Text className="header-title-text">
          {title}
        </Text>
      )}

      {showCart ? (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-2"
        >
          <ShoppingCart size={24} color="#f97316" />
          {isMounted && cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs 
              rounded-full h-5 w-5 flex items-center justify-center">
              {getCartCount()}
            </span>
          )}
        </button>
      ) : (
        <div className="w-[40px]" /> 
      )}
    </Group>
  )
} 