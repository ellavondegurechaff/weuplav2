'use client'

import { X, ShoppingCart, Plus, Minus, ArrowRight, ChevronDown } from 'lucide-react'
import useCartStore from '@/store/cartStore'
import { useEffect, useState } from 'react'
import { toast, Toaster } from 'sonner'

function CartItemImage({ src, name }) {
  return (
    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
      {src ? (
        <img 
          src={src} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-semibold">
          {name.charAt(0)}
        </div>
      )}
    </div>
  )
}

const PAYMENT_METHODS = [
  { id: 'cashapp', label: 'Cashapp', fee: 6 },
  { id: 'zelle', label: 'Zelle', fee: 5 },
  { id: 'crypto', label: 'Crypto', fee: 4 },
  { id: 'cash', label: 'Cash', fee: 0 }
]

export function CartSidebar({ isCartOpen: propIsCartOpen, setIsCartOpen: propSetIsCartOpen }) {
  const [isMounted, setIsMounted] = useState(false)
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    getTotalPrice, 
    clearCart,
    selectedPayment,
    setPaymentMethod,
    receiptType,
    setReceiptType,
    getTotalWithFees,
    isCartOpen: storeIsCartOpen,
    setCartOpen,
    lastAddedItem,
    getCartCount,
    setDiscount,
    addCustomProduct
  } = useCartStore()

  const isCartOpen = propIsCartOpen ?? storeIsCartOpen
  const setIsCartOpen = propSetIsCartOpen ?? setCartOpen

  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Enhanced notification for added items
  useEffect(() => {
    if (lastAddedItem && isMounted && lastAddedItem.timestamp > Date.now() - 1000) {
      toast.success(
        <div className="flex flex-col">
          <span className="font-medium text-black">{`Added ${lastAddedItem.quantity}x ${lastAddedItem.name}`}</span>
          <span className="text-sm text-gray-600">{`Cart total: ${lastAddedItem.totalItems} item${lastAddedItem.totalItems !== 1 ? 's' : ''}`}</span>
        </div>,
        {
          duration: 2000,
          style: {
            background: 'white',
            border: '2px solid #f97316',
            color: 'black',
            fontSize: '14px',
            maxWidth: '400px',
            padding: '16px',
          },
          className: 'font-medium shadow-lg',
        }
      )
    }
  }, [lastAddedItem, isMounted])

  // Remove the automatic cart opening effect
  // useEffect(() => {
  //   if (cart.length > 0 && !isCartOpen) {
  //     setIsCartOpen(true)
  //   }
  // }, [cart.length, isCartOpen, setIsCartOpen])

  // Add this useEffect to handle body scroll locking
  useEffect(() => {
    if (isCartOpen) {
      // Prevent background scrolling
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '15px' // Prevent layout shift
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }

    return () => {
      // Cleanup
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [isCartOpen])

  // Initialize defaults if not set
  useEffect(() => {
    if (isMounted) {
      if (!selectedPayment) setPaymentMethod('cashapp')
      if (!receiptType) setReceiptType('shipping')
    }
  }, [isMounted, selectedPayment, receiptType, setPaymentMethod, setReceiptType])

  if (!isMounted) {
    return null
  }

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '0.00'
    const numPrice = Number(price)
    if (isNaN(numPrice)) return '0.00'
    return numPrice === 0 ? 'Free' : numPrice.toFixed(2)
  }

  const copyCartToClipboard = () => {
    if (!selectedPayment || !receiptType) {
      toast.error('Please select both payment method and receipt type')
      return
    }
  
    const totals = getTotalWithFees()
    const orderText = `🛒 ORDER REQUEST
ITEMS:
${cart.map(item => {
  const price = receiptType === 'shipping' 
    ? Number(item.shipped_price || 0) 
    : Number(item.intown_price || 0)
  const formattedPrice = price === 0 ? 'Free' : `$${formatPrice(price * item.quantity)}`
  return `${item.quantity}x ${item.name} ${formattedPrice}`
}).join('\n')}

${receiptType.toUpperCase()} ORDER SELECTED ✓

ORDER SUMMARY
-------------
Total Items: ${totals.totalItems}
${receiptType === 'shipping' ? 'Shipped' : 'Intown'} Subtotal: ${totals.subtotal === 0 ? 'Free' : `$${formatPrice(totals.subtotal)}`}
${totals.discount > 0 ? `Discount Applied: -$${formatPrice(totals.discount)}\nSubtotal after Discount: ${totals.subtotalAfterDiscount === 0 ? 'Free' : `$${formatPrice(totals.subtotalAfterDiscount)}`}\n` : ''}${selectedPayment.toUpperCase()} Fee ${totals.feePercentage}% = $${formatPrice(totals.feeAmount)}
Total due = ${totals.total === 0 ? 'Free' : `$${formatPrice(totals.total)}`}`

    navigator.clipboard.writeText(orderText)
      .then(() => {
        toast.success('Order details copied to clipboard!')
      })
      .catch(err => {
        console.error('Failed to copy text: ', err)
        toast.error('Failed to copy order details. Please try again.')
      })
  }

  const handleQuantityChange = (itemId, value) => {
    const cleanValue = value.replace(/[^\d]/g, '')
    const numValue = cleanValue === '' ? 1 : parseInt(cleanValue, 10)
    
    if (!isNaN(numValue) && numValue > 0) {
      const limitedValue = Math.min(numValue, 999)
      updateQuantity(itemId, limitedValue)
    }
  }

  const AdvancedOptions = ({ isOpen, onToggle }) => {
    const [customProduct, setCustomProduct] = useState({ name: '', price: '', quantity: '1' })
    const [discountAmount, setDiscountAmount] = useState('')

    const handleAddCustomProduct = (e) => {
      e.preventDefault()
      if (!customProduct.name || !customProduct.price) return
      
      addCustomProduct(customProduct.name, customProduct.price, customProduct.quantity)
      setCustomProduct({ name: '', price: '', quantity: '1' }) // Reset form
    }

    return (
      <div className="mb-4">
        <button
          onClick={onToggle}
          className="w-full bg-transparent text-orange-700 py-3 px-4 rounded-md 
            hover:bg-orange-500/20 transition-colors flex items-center justify-between 
            outline outline-2 outline-orange-500 font-semibold"
        >
          <span>Advanced Options</span>
          <ChevronDown 
            className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            size={16} 
          />
        </button>
        
        {isOpen && (
          <div className="mt-3 space-y-4 p-4 border border-gray-200 rounded-md">
            {/* Discount Input */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">Apply Discount ($)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-black bg-white"
                  placeholder="0.00"
                />
                <button
                  onClick={() => setDiscount(discountAmount)}
                  className="px-3 py-1.5 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Custom Product Form */}
            <form onSubmit={handleAddCustomProduct}>
              <h4 className="font-medium text-sm text-black mb-2">Add Custom Product</h4>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min="1"
                  value={customProduct.quantity}
                  onChange={(e) => setCustomProduct(prev => ({ ...prev, quantity: e.target.value }))}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-black bg-white"
                  placeholder="Qty"
                />
                <input
                  value={customProduct.name}
                  onChange={(e) => setCustomProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-black bg-white"
                  placeholder="Product name"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={customProduct.price}
                  onChange={(e) => setCustomProduct(prev => ({ ...prev, price: e.target.value }))}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-black bg-white"
                  placeholder="Price"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-2 px-3 py-1.5 bg-gray-100 text-black rounded-md text-sm hover:bg-gray-200"
              >
                Add Custom Product
              </button>
            </form>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[150] md:hidden"
          onClick={() => setIsCartOpen(false)}
        />
      )}
      
      <div className={`fixed right-0 w-full sm:w-96 bg-white shadow-xl transform 
        ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
        top-0 h-full transition-transform duration-300 ease-in-out z-[160] overflow-y-auto`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 bg-white" />
          <div className="flex-1 flex flex-col">
            {/* Cart Header */}
            <div className="px-4 py-3 bg-white flex justify-between items-center border-b border-gray-200">
              <h2 className="text-lg font-semibold text-black">Your Cart</h2>
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear your cart?')) {
                        clearCart()
                      }
                    }}
                    className="px-3 py-1.5 text-red-600 hover:text-white hover:bg-red-500 rounded-md transition-colors text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                )}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 text-black hover:text-orange-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Cart Items Section */}
            <div className="flex-1 overflow-y-auto p-4 bg-white">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-black">
                  <ShoppingCart size={32} className="mb-3" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <CartItemImage src={item.image} name={item.name} />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-black truncate">{item.name}</h3>
                        <div className="flex flex-col gap-0.5 mt-1">
                          <p className="text-sm text-gray-600">
                            Intown: <span className="text-orange-600 font-semibold">
                              {formatPrice(item.intown_price) === 'Free' ? 'Free' : `$${formatPrice(item.intown_price)}`}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Shipped: <span className="text-orange-600 font-semibold">
                              {formatPrice(item.shipped_price) === 'Free' ? 'Free' : `$${formatPrice(item.shipped_price)}`}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center mt-2 space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-700"
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={3}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            className="w-12 px-2 py-0.5 bg-white border border-gray-200 rounded text-center text-sm text-black
                              focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-700"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-red-500 p-1.5"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment and Receipt Selection - Now always visible */}
            <div className="p-4 bg-white border-t border-gray-200">
              {/* Payment Method Selection */}
              <div className="mb-4">
                <h3 className="font-medium mb-2 text-black">Select Payment Method:</h3>
                <select
                  value={selectedPayment || ''}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-white text-black border border-gray-200 
                    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="" disabled>Choose payment method</option>
                  {PAYMENT_METHODS.map(method => (
                    <option key={method.id} value={method.id}>
                      {method.label} ({method.fee}% fee)
                    </option>
                  ))}
                </select>
              </div>

              {/* Receipt Type Selection */}
              <div className="mb-4">
                <h3 className="font-medium mb-2 text-black">Select Receipt Type:</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setReceiptType('intown')}
                    className={`flex-1 py-2 rounded ${
                      receiptType === 'intown' 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-white text-black hover:bg-orange-100'
                    }`}
                  >
                    Intown Receipt
                  </button>
                  <button
                    onClick={() => setReceiptType('shipping')}
                    className={`flex-1 py-2 rounded ${
                      receiptType === 'shipping' 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-white text-black hover:bg-orange-100'
                    }`}
                  >
                    Shipping Receipt
                  </button>
                </div>
              </div>

              {/* Order Summary - Only show when cart has items */}
              {cart.length > 0 && selectedPayment && receiptType && (
                <div className="mb-4">
                  <div className="space-y-2 text-black">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{getTotalWithFees().subtotal === 0 ? 'Free' : `$${formatPrice(getTotalWithFees().subtotal)}`}</span>
                    </div>
                    {getTotalWithFees().discount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Discount:</span>
                        <span>-${formatPrice(getTotalWithFees().discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>{PAYMENT_METHODS.find(m => m.id === selectedPayment)?.label} Fee ({getTotalWithFees().feePercentage}%):</span>
                      <span>${formatPrice(getTotalWithFees().feeAmount)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>{getTotalWithFees().total === 0 ? 'Free' : `$${formatPrice(getTotalWithFees().total)}`}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Copy Order Button - Disabled when cart is empty */}
              <button
                onClick={copyCartToClipboard}
                disabled={!selectedPayment || !receiptType || cart.length === 0}
                className="w-full bg-transparent text-orange-700 py-3 px-4 rounded-md 
                  hover:bg-orange-500/20 transition-colors flex items-center justify-center 
                  space-x-2 outline outline-2 outline-orange-500 font-semibold
                  disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              >
                <span>Copy Order Details</span>
                <ArrowRight size={16} className="ml-1" />
              </button>

              {/* Advanced Options */}
              <AdvancedOptions 
                isOpen={showAdvanced}
                onToggle={() => setShowAdvanced(prev => !prev)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CartSidebar 