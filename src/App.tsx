import { RouterProvider } from 'react-router-dom'
import './App.css'
import './Animations.css'
import { getApp } from './routes/utils/helpers'
import { ThemeProvider } from './context/theme-provider'
import store from './redux/store'
import { Provider } from 'react-redux'
import { Toaster } from '@/components/ui/sonner'
import { AblyProvider } from 'ably/react'
import { ablyClient } from './lib/ably'
import * as Sentry from '@sentry/react'

function App() {
  const router = getApp()

  return (
    <AblyProvider client={ablyClient}>
      <Provider store={store}>
        <ThemeProvider>
          <RouterProvider router={router} />
          <Toaster />
        </ThemeProvider>
      </Provider>
    </AblyProvider>
  )
}

export default Sentry.withProfiler(App)
