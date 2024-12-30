import React from 'react';
import { Container } from '@mantine/core';
import { Clock, MapPin, CreditCard, Package } from 'lucide-react';

export default function MainContent() {
  return (
    <Container size="xl" className="px-4 py-6">
      {/* Social Media Buttons and Top Menu Button */}
      <div className="flex flex-col items-center gap-4 mb-12 mt-8">
        <div className="flex justify-center gap-4 mb-6">
          <a 
            href="/telegram" 
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Telegram
          </a>
          <a 
            href="/signal" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Signal
          </a>
        </div>
        
        <a 
          href="/allproducts" 
          className="inline-block bg-orange-500 text-white font-semibold px-8 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          VIEW MENU
        </a>
      </div>

      {/* Main Content - Centered */}
      <div className="max-w-2xl mx-auto text-center">
        {/* Shipping and Hours Section */}
        <div className="flex justify-center items-center gap-8 mb-6">
          <div>
            <h2 className="font-bold mb-1">Shipping</h2>
            <p>100% Insured</p>
            <p>Available 24/7</p>
          </div>
          <div className="h-12 w-px bg-gray-300" />
          <div>
            <h2 className="font-bold mb-1">Intown</h2>
            <p>1pm - 6pm</p>
          </div>
        </div>

        <p className="mb-8">
          Menu Updated Daily. Over 100+ Flavors available at all times. Best Prices 
          guaranteed. All Touchdowns are insured with fast and discreet shipping 
          methods. Tag us now to place your orders.
        </p>

        <div className="mb-8">
          <h3 className="font-bold mb-4">Payments Accepted</h3>
          <div className="grid grid-cols-2 max-w-xs mx-auto gap-4">
            <div>
              <p>Cashapp......... 6%</p>
              <p>Zelle.............. 5%</p>
            </div>
            <div>
              <p>Crypto........... 4%</p>
              <p>Cash is King 0%</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p>✓ TP-4 Service Available</p>
          <p>✓ Bread Routing Available</p>
          <p>For Bulk Players 🏃</p>
        </div>

        <a 
          href="/allproducts" 
          className="inline-block bg-orange-500 text-white font-semibold px-8 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          VIEW MENU
        </a>
      </div>
    </Container>
  )
}