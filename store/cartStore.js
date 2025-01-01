import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      selectedPayment: null, // 'cashapp', 'zelle', 'crypto', 'cash'
      receiptType: null, // 'intown', 'shipping'
      isCartOpen: false,
      lastAddedItem: null,
      
      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      
      addToCart: (product) => set((state) => {
        const existingItem = state.cart.find(item => item.id === product.id)
        let addedQuantity = 1
        
        const newCart = existingItem
          ? state.cart.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...state.cart, { ...product, quantity: 1 }]

        // Calculate total items in cart for notification
        const totalItems = newCart.reduce((sum, item) => sum + item.quantity, 0)

        return { 
          cart: newCart,
          lastAddedItem: {
            name: product.name,
            quantity: addedQuantity,
            totalItems,
            timestamp: Date.now()
          }
        }
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

      clearCart: () => set({ 
        cart: [],
        isCartOpen: false,
        selectedPayment: null,
        receiptType: null,
        lastAddedItem: null
      }),

      getTotalPrice: () => {
        const cart = get().cart
        return cart.reduce(
          (totals, item) => ({
            intown: totals.intown + (item.intown_price * item.quantity),
            shipped: totals.shipped + (item.shipped_price * item.quantity)
          }),
          { intown: 0, shipped: 0 }
        )
      },

      setPaymentMethod: (method) => set({ selectedPayment: method }),
      
      setReceiptType: (type) => set({ receiptType: type }),

      getPaymentFee: () => {
        const { selectedPayment } = get()
        const fees = {
          cashapp: 0.06,
          zelle: 0.05,
          crypto: 0.04,
          cash: 0
        }
        return fees[selectedPayment] || 0
      },

      getTotalWithFees: () => {
        const { cart, selectedPayment, receiptType } = get()
        
        // Calculate base total
        const baseTotal = cart.reduce((total, item) => {
          const price = receiptType === 'shipping' ? item.shipped_price : item.intown_price
          return total + (parseFloat(price) * item.quantity)
        }, 0)

        // Calculate fee
        const fee = get().getPaymentFee()
        const feeAmount = Math.round(baseTotal * fee) // Round to nearest dollar
        
        return {
          subtotal: baseTotal,
          feePercentage: fee * 100,
          feeAmount: feeAmount,
          total: baseTotal + feeAmount,
          totalItems: cart.reduce((sum, item) => sum + item.quantity, 0)
        }
      },

      getCartCount: () => {
        const cart = get().cart
        return cart.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage'
    }
  )
)

export default useCartStore 