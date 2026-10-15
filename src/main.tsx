import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './enhancements.css'
import './polish.css'
import App from './App'

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
