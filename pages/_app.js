import '@mantine/core/styles.css'
import '@/styles/globals.css'
import { MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

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
          backgroundColor: '#ffffff',
          borderBottom: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          'button': {
            color: '#f97316'
          },
          '.mantine-Text-root': {
            color: '#f97316'
          }
        }
      }
    }
  }
})

export default function App({ Component, pageProps }) {
  return (
    <MantineProvider theme={theme}>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url('/desktop_bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1
        }}
      />
      <Notifications position="top-center" containerWidth={400} zIndex={2000} />
      <Component {...pageProps} />
    </MantineProvider>
  )
}
