import React from 'react';
import { Container } from '@mantine/core';
import { Clock, MapPin, CreditCard, Package } from 'lucide-react';
import { SiTelegram, SiSignal } from '@icons-pack/react-simple-icons'

export default function MainContent() {
  return (
    <Container size="xl" className="px-4 py-6">
      {/* Contact Us Image */}
      <div className="text-center mb-8">
        <img 
          src="/contact_us.png" 
          alt="Contact Us"
          className="mx-auto max-w-[400px] w-full"
        />
      </div>

      {/* Social Media Buttons and Top Menu Button */}
      <div className="flex flex-col items-center gap-4 mb-12">
        <div className="flex justify-center gap-4 mb-6">
          <a 
            href="https://signal.me/#eu/EnEaHC7NjCVwnGkTEFNmNrnoxzrJx4KlTjPUK3kAmgVGBNmrO7VL1qXppTsEAyn0" 
            className="bg-[#3A76F0] text-white px-6 py-2 rounded-lg hover:bg-[#3A76F0]/90 transition-colors flex items-center gap-2 outline outline-1 outline-black"
            style={{ minWidth: '140px' }}
          >
            <SiSignal size={24} />
            <span className="font-bold">Signal</span>
          </a>
          <a 
            href="https://t.me/WeUpLA_DM"
            className="bg-[#0088CC] text-white px-6 py-2 rounded-lg hover:bg-[#0088CC]/90 transition-colors flex items-center gap-2 outline outline-1 outline-black"
            style={{ minWidth: '140px' }}
          >
            <SiTelegram size={24} />
            <span className="font-bold">Telegram</span>
          </a>
        </div>
        
        <a 
          href="/allproducts" 
          className="inline-block bg-orange-400 text-white font-semibold px-8 py-2 rounded-lg hover:bg-orange-500 transition-colors outline outline-1 outline-black"
        >
          VIEW MENU
        </a>
      </div>

      {/* Main Content - Centered */}
      <div className="max-w-2xl mx-auto text-center">
        {/* Shipping and Hours Section */}
        <div className="flex justify-center items-center gap-8 mb-6">
          <div>
            <h2 className="font-bold mb-1"><u>SHIPPING</u></h2>
            <p className="font-bold">100% Insured</p>
            <p className="font-bold">Available 24/7</p>
          </div>
          <div className="h-12 w-px bg-gray-300" />
          <div>
            <h2 className="font-bold mb-1"><u>INTOWN</u></h2>
            <p className="font-bold">Monday - Sunday</p>
            <p className="font-bold">1pm - 6pm</p>
          </div>
        </div>

        <p className="mb-8 font-bold">
          Menu Updated Daily. Over 100+ Flavors available at all times. Best Prices 
          guaranteed. All Touchdowns are insured with fast and discreet shipping 
          methods. Contact us now to place your orders.
        </p>

        <div className="mb-8">
          <h3 className="font-bold mb-4"><u>PAYMENTS ACCEPTED</u></h3>
          <div className="grid grid-cols-2 max-w-xs mx-auto gap-4 font-bold">
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

        <div className="mb-8 font-bold">
          <p>✓ TP-4 Service Available</p>
          <p>✓ Bread Routing Available</p>
          <p>For Bulk Players 🏃</p>
        </div>

        {/* Bottom Menu Button and Social Media Buttons */}
        <div className="flex flex-col items-center gap-4">
          <a 
            href="/allproducts" 
            className="inline-block bg-orange-400 text-white font-semibold px-8 py-2 rounded-lg hover:bg-orange-500 transition-colors outline outline-1 outline-black"
          >
            VIEW MENU
          </a>
          
          <div className="flex justify-center gap-4 mt-6">
            <a 
              href="https://signal.me/#eu/EnEaHC7NjCVwnGkTEFNmNrnoxzrJx4KlTjPUK3kAmgVGBNmrO7VL1qXppTsEAyn0" 
              className="bg-[#3A76F0] text-white px-6 py-2 rounded-lg hover:bg-[#3A76F0]/90 transition-colors flex items-center gap-2 outline outline-1 outline-black"
              style={{ minWidth: '140px' }}
            >
              <SiSignal size={24} />
              <span className="font-bold">Signal</span>
            </a>
            <a 
              href="https://t.me/WeUpLA_DM"
              className="bg-[#0088CC] text-white px-6 py-2 rounded-lg hover:bg-[#0088CC]/90 transition-colors flex items-center gap-2 outline outline-1 outline-black"
              style={{ minWidth: '140px' }}
            >
              <SiTelegram size={24} />
              <span className="font-bold">Telegram</span>
            </a>
          </div>
        </div>
      </div>
    </Container>
  )
}