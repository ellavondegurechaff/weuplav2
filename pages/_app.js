import Head from 'next/head'
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
          background: 'transparent',
          paddingTop: 'calc(60px + env(safe-area-inset-top))',
          minHeight: '100vh',
          height: '100%',
          width: '100%'
        },
        header: {
          backgroundColor: 'white',
          borderBottom: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          paddingTop: 'env(safe-area-inset-top)',
          height: 'calc(60px + env(safe-area-inset-top))',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100
        }
      }
    }
  }
})

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/home.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
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
    </>
  )
}
