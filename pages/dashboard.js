import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'
import RedeemManagement from '@/components/dashboard/redeem/RedeemManagement'
import ScriptManagement from '@/components/dashboard/Scripts/ScriptManagement'
import SettingsPanel from '@/components/dashboard/Settings/SettingsPanel'
import { AnimatePresence } from 'framer-motion'
import FadeTransition from '@/components/ui/FadeTransition'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('keys')

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <AnimatePresence mode="wait">
        {activeTab === 'keys' && (
          <FadeTransition key="keys">
            <RedeemManagement />
          </FadeTransition>
        )}
        {activeTab === 'scripts' && (
          <FadeTransition key="scripts">
            <ScriptManagement />
          </FadeTransition>
        )}
        {activeTab === 'settings' && (
          <FadeTransition key="settings">
            <SettingsPanel />
          </FadeTransition>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}