'use client'

import { X, ShoppingCart, Plus, Minus, ArrowRight } from 'lucide-react'
import useCartStore from '@/store/cartStore'
import { useEffect, useState } from 'react'

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

export function CartSidebar({ isCartOpen, setIsCartOpen }) {
  const [isMounted, setIsMounted] = useState(false)
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart, 
    selectedPayment,
    setPaymentMethod,
    receiptType,
    setReceiptType,
    getTotalWithFees
  } = useCartStore()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return typeof numPrice === 'number' ? numPrice.toFixed(2) : '0.00'
  }

  const copyCartToClipboard = () => {
    if (!selectedPayment || !receiptType) {
      alert('Please select both payment method and receipt type')
      return
    }
  
    const totals = getTotalWithFees()
    const orderText = `🛒 ORDER REQUEST
ITEMS:
${cart.map(item => `1x ${item.name} $${Math.round(
    receiptType === 'shipping' ? item.shipped_price : item.intown_price
  )}`).join('\n')}

${receiptType.toUpperCase()} ORDER SELECTED ✓

ORDER SUMMARY
-------------
Total Items: ${totals.totalItems}
${receiptType === 'shipping' ? 'Shipped' : 'Intown'} Total: ${Math.round(totals.subtotal)}
${selectedPayment.toUpperCase()} Fee ${totals.feePercentage}% = ${Math.round(totals.feeAmount)}
Total due = ${Math.round(totals.total)}`

    navigator.clipboard.writeText(orderText)
      .then(() => {
        const notification = document.createElement('div')
        notification.className = 
          'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-[170] cursor-pointer'
        notification.textContent = 'Order details copied to clipboard!'
        
        notification.addEventListener('click', () => {
          notification.style.opacity = '0'
          setTimeout(() => {
            document.body.removeChild(notification)
          }, 300)
        })

        document.body.appendChild(notification)
        
        setTimeout(() => {
          notification.style.opacity = '0'
          setTimeout(() => {
            document.body.removeChild(notification)
          }, 300)
        }, 3000)
      })
      .catch(err => {
        console.error('Failed to copy text: ', err)
        alert('Failed to copy order details. Please try again.')
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

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[150] md:hidden"
          onClick={() => setIsCartOpen(false)}
        />
      )}
      
      <div className={`fixed right-0 w-full sm:w-96 bg-orange-50/80 shadow-xl transform 
        ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
        top-0 h-full transition-transform duration-300 ease-in-out z-[160]`}
      >
        <div className="h-full flex flex-col pt-16">
          {/* Cart Header */}
          <div className="px-4 py-3 bg-orange-50/80 flex justify-between items-center border-b border-orange-200">
            <h2 className="text-lg font-semibold text-black">Your Cart</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-black hover:text-orange-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Items Section */}
          <div className="flex-1 overflow-y-auto p-4 bg-orange-50/80">
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
                      <h3 className="font-medium text-sm text-gray-900 truncate">{item.name}</h3>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <p className="text-sm text-gray-700">
                          Intown: <span className="text-orange-600 font-semibold">${formatPrice(item.intown_price)}</span>
                        </p>
                        <p className="text-sm text-gray-700">
                          Shipped: <span className="text-orange-600 font-semibold">${formatPrice(item.shipped_price)}</span>
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
                          className="w-12 px-2 py-0.5 bg-white border border-gray-200 rounded text-center text-sm 
                            focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900"
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
          <div className="p-4 bg-orange-50/80 border-t border-orange-200">
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
                    <span>${formatPrice(getTotalWithFees().subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{PAYMENT_METHODS.find(m => m.id === selectedPayment)?.label} Fee ({getTotalWithFees().feePercentage}%):</span>
                    <span>${formatPrice(getTotalWithFees().feeAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${formatPrice(getTotalWithFees().total)}</span>
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
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Copy Order Details</span>
              <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CartSidebar 