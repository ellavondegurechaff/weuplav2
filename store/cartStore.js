import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      
      addToCart: (product) => set((state) => {
        const existingItem = state.cart.find(item => item.id === product.id)
        
        if (existingItem) {
          return {
            cart: state.cart.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          }
        }
        
        return { cart: [...state.cart, { ...product, quantity: 1 }] }
      }),

      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.id !== productId)
      })),

      updateQuantity: (productId, quantity) => set((state) => {
        if (quantity < 1) {
          return {
            cart: state.cart.filter(item => item.id !== productId)
          }
        }
        
        return {
          cart: state.cart.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          )
        }
      }),

      clearCart: () => set({ cart: [] }),

      getTotalPrice: () => {
        const cart = get().cart
        return cart.reduce(
          (totals, item) => ({
            intown: totals.intown + (item.intown_price * item.quantity),
            shipped: totals.shipped + (item.shipped_price * item.quantity)
          }),
          { intown: 0, shipped: 0 }
        )
      }
    }),
    {
      name: 'cart-storage'
    }
  )
)

export default useCartStore 