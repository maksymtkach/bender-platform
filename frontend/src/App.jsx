import './App.css'
import {AccordionDemo} from "./components/AccordionDemo.jsx";
import { ThemeProvider } from "./components/ui/theme-provider.js"
import {LoginForm} from "@/components/auth/LoginForm.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import LoginPage from "@/pages/LoginPage.jsx";
import InfoPage from "@/pages/InfoPage.jsx";
import Layout from "@/components/layout/Layout.jsx";
import HomePage from "@/pages/HomePage.jsx";
import RegisterPage from "@/pages/RegisterPage.jsx";
import {UserProvider} from "@/providers/UserProvider.jsx";


//TODO: Create secure routes for Login and SignUp
function App() {
  return (
      <UserProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <BrowserRouter>
                  <Routes>
                      <Route element={<Layout />}>
                          <Route index element={<HomePage />} />
                          <Route path="info" element={<InfoPage />} />
                          <Route path="login" element={<LoginPage />} />
                          <Route path="register" element={<RegisterPage />} />
                      </Route>
                  </Routes>
              </BrowserRouter>
          </ThemeProvider>
      </UserProvider>
  )
}

export default App
