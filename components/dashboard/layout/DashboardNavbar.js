import { NavLink, Stack } from '@mantine/core'
import { Key, FileCode, Settings } from 'lucide-react'

export default function DashboardNavbar({ activeTab, setActiveTab }) {
  const navItems = [
    { icon: <Key size={20} />, label: 'Redeem', value: 'keys' },
    { icon: <FileCode size={20} />, label: 'Lua Scripts', value: 'scripts' },
    { icon: <Settings size={20} />, label: 'Settings', value: 'settings' },
  ]

  return (
    <Stack gap={4} p={8}>
      {navItems.map((item) => (
        <NavLink
          key={item.value}
          active={activeTab === item.value}
          label={item.label}
          leftSection={item.icon}
          onClick={() => setActiveTab(item.value)}
          className="font-mono"
          styles={{
            root: {
              backgroundColor: 'transparent',
              color: 'rgba(255, 255, 255, 0.7)',
              position: 'relative',
              padding: '10px 14px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              marginBottom: '2px',
              
              '&[data-active]': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                transform: 'translateX(4px)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  height: '60%',
                  width: '3px',
                  backgroundColor: '#ffffff',
                  borderRadius: '0 3px 3px 0',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                }
              },
              
              '&:hover:not([data-active])': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                transform: 'translateX(4px)',
              }
            },
            
            label: {
              fontWeight: activeTab === item.value ? 600 : 400,
              fontSize: '0.9rem',
            },
            
            leftSection: {
              marginRight: '8px',
              color: activeTab === item.value ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
            }
          }}
        />
      ))}
    </Stack>
  )
} 