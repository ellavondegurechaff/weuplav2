import '@mantine/core/styles.css'
import '@/styles/globals.css'
import { MantineProvider, createTheme } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { Toaster } from 'sonner'

const theme = createTheme({
  primaryColor: 'gray',
  fontFamily: 'Helvetica',
  components: {
    Button: {
      styles: {
        root: {
          transition: 'all 0.2s ease',
          fontFamily: 'Helvetica'
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
    },
    AppShell: {
      styles: {
        main: {
          background: 'transparent'
        },
        header: {
          backgroundColor: '#f2f0d6',
          borderBottom: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          'button': {
            color: '#f97316'
          },
          '.mantine-Text-root': {
            color: '#f97316',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '24px',
            fontWeight: 700
          }
        }
      }
    }
  }
})

export default function App({ Component, pageProps }) {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Notifications />
        <Toaster 
          richColors 
          position="top-center"
          toastOptions={{
            style: {
              background: 'white',
              color: 'black',
              border: '2px solid #f97316',
              fontSize: '14px',
              maxWidth: '400px',
              padding: '16px',
            },
            success: {
              style: {
                background: 'white',
                border: '2px solid #f97316',
              },
              icon: '🛒',
            },
            className: 'font-medium',
            duration: 2000,
          }}
        />
        <Component {...pageProps} />
      </ModalsProvider>
    </MantineProvider>
  )
}
