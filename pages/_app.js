import '@mantine/core/styles.css'
import { MantineProvider, createTheme } from '@mantine/core'
import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { Notifications } from '@mantine/notifications'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'

const theme = createTheme({
  primaryColor: 'gray',
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40',
      '#2C2E33',
      '#25262B',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
  components: {
    Button: {
      styles: {
        root: {
          transition: 'all 0.2s ease',
        }
      }
    },
    Card: {
      styles: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  }
})

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  // Check if the page should use the dashboard layout
  const isDashboardPage = Component.layoutType === 'dashboard'

  if (isDashboardPage) {
    return (
      <DashboardLayout>
        <Component {...pageProps} />
      </DashboardLayout>
    )
  }

  return (
    <SessionProvider session={session}>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <Notifications />
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  )
}
