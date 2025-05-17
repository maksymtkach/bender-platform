import './App.css'
import {AccordionDemo} from "./components/AccordionDemo.jsx";
import { ThemeProvider } from "./components/ui/theme-provider.js"
import {LoginForm} from "@/components/auth/LoginForm.jsx";

//TODO: Create secure routes for Login and SignUp
function App() {
  return (
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
              <div className="w-full max-w-sm">
                  <LoginForm />
              </div>
          </div>
      </ThemeProvider>
  )
}

export default App
