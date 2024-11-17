import { RouterProvider } from 'react-router-dom'
import './App.css'
import './Animations.css'
import { getApp } from './routes/utils/helpers'
import { ThemeProvider } from './context/theme-provider'
import store from './redux/store'
import { Provider } from 'react-redux'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const router = getApp()

  return (
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </Provider>
  )
}

export default App
