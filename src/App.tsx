import { RouterProvider } from 'react-router-dom'
import './App.css'
import { getApp } from './routes/utils/helpers'
import { ThemeProvider } from './context/theme-provider'

function App() {
  const router = getApp()

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
