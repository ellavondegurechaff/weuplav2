import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Utility functions for precise calculations
const roundToTwo = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

const validateNumber = (value, fallback = 0) => {
  const num = Number(value)
  return !isNaN(num) && isFinite(num) ? Math.max(0, num) : fallback
}

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      selectedPayment: 'cashapp',
      receiptType: 'shipping',
      isCartOpen: false,
      lastAddedItem: null,
      discount: 0,
      
      setCartOpen: (isOpen) => set({ isCartOpen: Boolean(isOpen) }),
      
      addToCart: (product) => {
        try {
          if (!product?.id || !product?.name) {
            console.error('Invalid product data:', product)
            throw new Error('Invalid product data')
          }

          set((state) => {
            const existingItem = state.cart.find(item => item.id === product.id)
            const addedQuantity = 1
            
            const newCart = existingItem
              ? state.cart.map(item =>
                  item.id === product.id
                    ? { ...item, quantity: validateNumber(item.quantity + 1, 1) }
                    : item
                )
              : [...state.cart, { 
                  ...product, 
                  quantity: 1,
                  intown_price: validateNumber(product.intown_price),
                  shipped_price: validateNumber(product.shipped_price)
                }]

            const totalItems = newCart.reduce((sum, item) => 
              sum + validateNumber(item.quantity, 1), 0)

            return { 
              cart: newCart,
              lastAddedItem: {
                name: product.name,
                quantity: addedQuantity,
                totalItems,
                timestamp: Date.now()
              }
            }
          })
        } catch (error) {
          console.error('Error adding to cart:', error)
          throw new Error('Failed to add item to cart')
        }
      },

      removeFromCart: (productId) => {
        if (!productId) {
          console.error('Invalid product ID for removal')
          return
        }
        set((state) => ({
          cart: state.cart.filter(item => item.id !== productId)
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (!productId) {
          console.error('Invalid product ID for quantity update')
          return
        }

        const validQuantity = validateNumber(quantity, 1)
        
        set((state) => {
          if (validQuantity < 1) {
            return {
              cart: state.cart.filter(item => item.id !== productId)
            }
          }
          
          return {
            cart: state.cart.map(item =>
              item.id === productId
                ? { ...item, quantity: Math.min(999, validQuantity) } // Add maximum quantity limit
                : item
            )
          }
        })
      },

      clearCart: () => set({ 
        cart: [],
        isCartOpen: false,
        selectedPayment: 'cashapp', // Reset to default instead of null
        receiptType: 'shipping', // Reset to default instead of null
        lastAddedItem: null,
        discount: 0 // Reset discount
      }),

      getTotalPrice: () => {
        try {
          const cart = get().cart || []
          return cart.reduce(
            (totals, item) => ({
              intown: roundToTwo(
                totals.intown + (
                  validateNumber(item.intown_price) * 
                  validateNumber(item.quantity, 1)
                )
              ),
              shipped: roundToTwo(
                totals.shipped + (
                  validateNumber(item.shipped_price) * 
                  validateNumber(item.quantity, 1)
                )
              )
            }),
            { intown: 0, shipped: 0 }
          )
        } catch (error) {
          console.error('Error calculating total price:', error)
          return { intown: 0, shipped: 0 }
        }
      },

      setPaymentMethod: (method) => {
        const validMethods = ['cashapp', 'zelle', 'crypto', 'cash']
        if (!validMethods.includes(method)) {
          console.error('Invalid payment method:', method)
          return
        }
        set({ selectedPayment: method })
      },
      
      setReceiptType: (type) => {
        const validTypes = ['intown', 'shipping']
        if (!validTypes.includes(type)) {
          console.error('Invalid receipt type:', type)
          return
        }
        set({ receiptType: type })
      },

      getPaymentFee: () => {
        const { selectedPayment = 'cashapp' } = get()
        const fees = {
          cashapp: 0.06,
          zelle: 0.05,
          crypto: 0.04,
          cash: 0
        }
        return fees[selectedPayment] || 0
      },

      getTotalWithFees: () => {
        try {
          const { cart = [], selectedPayment = 'cashapp', receiptType = 'shipping', discount = 0 } = get()
          
          // Calculate base total with validation
          const baseTotal = roundToTwo(cart.reduce((total, item) => {
            const price = receiptType === 'shipping' 
              ? validateNumber(item.shipped_price)
              : validateNumber(item.intown_price)
            const quantity = validateNumber(item.quantity, 1)
            return total + (price * quantity)
          }, 0))

          // Validate and apply discount
          const validDiscount = validateNumber(discount)
          const totalAfterDiscount = roundToTwo(Math.max(0, baseTotal - validDiscount))
          
          // Calculate fees
          const fee = get().getPaymentFee()
          const feeAmount = roundToTwo(totalAfterDiscount * fee)
          const totalWithFee = roundToTwo(totalAfterDiscount + feeAmount)
          
          return {
            subtotal: baseTotal,
            discount: validDiscount,
            subtotalAfterDiscount: totalAfterDiscount,
            feePercentage: Number((fee * 100).toFixed(1)),
            feeAmount: feeAmount,
            total: totalWithFee,
            totalItems: cart.reduce((sum, item) => 
              sum + validateNumber(item.quantity, 1), 0)
          }
        } catch (error) {
          console.error('Error calculating total with fees:', error)
          return {
            subtotal: 0,
            discount: 0,
            subtotalAfterDiscount: 0,
            feePercentage: 0,
            feeAmount: 0,
            total: 0,
            totalItems: 0
          }
        }
      },

      getCartCount: () => {
        try {
          const cart = get().cart || []
          return cart.reduce((sum, item) => 
            sum + validateNumber(item.quantity, 1), 0)
        } catch (error) {
          console.error('Error getting cart count:', error)
          return 0
        }
      },

      setDiscount: (amount) => {
        try {
          const validAmount = validateNumber(amount)
          const currentTotal = get().getTotalWithFees().subtotal
          
          // Ensure discount doesn't exceed total
          const finalDiscount = Math.min(validAmount, currentTotal)
          
          set({ discount: finalDiscount })
        } catch (error) {
          console.error('Error setting discount:', error)
          set({ discount: 0 })
        }
      },

      addCustomProduct: (name, price, quantity) => {
        try {
          // Input validation
          if (!name?.trim()) {
            throw new Error('Product name is required')
          }

          const validPrice = validateNumber(price, 0)
          if (validPrice < 0) {
            throw new Error('Price cannot be negative')
          }

          const validQuantity = validateNumber(quantity, 1)
          
          const customProduct = {
            id: `custom-${Date.now()}`,
            name: name.trim(),
            intown_price: validPrice,
            shipped_price: validPrice,
            quantity: validQuantity,
            isCustom: true
          }

          set((state) => ({
            cart: [...state.cart, customProduct],
            lastAddedItem: {
              name: customProduct.name,
              quantity: customProduct.quantity,
              totalItems: get().getCartCount() + customProduct.quantity,
              timestamp: Date.now()
            }
          }))
        } catch (error) {
          console.error('Error adding custom product:', error)
          throw new Error(error.message || 'Failed to add custom product')
        }
      }
    }),
    {
      name: 'cart-storage'
    }
  )
)

export default useCartStore 