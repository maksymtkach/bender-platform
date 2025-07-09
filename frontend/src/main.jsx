import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {GoogleOAuthProvider} from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <GoogleOAuthProvider clientId="611560011764-hng699eerd5t76jl8j6o8afvsinhd2mm.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
  </StrictMode>,
)
