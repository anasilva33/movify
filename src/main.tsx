import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainPage from './components/MainPage/index.tsx'
import './global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainPage />
  </StrictMode>
)