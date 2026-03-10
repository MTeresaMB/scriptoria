import { AppRoutes } from "./routes"
import { ToastProvider } from "./components/common/toast/ToastContext"
import { ToastContainer } from "./components/common/toast/ToastContainer"
import { ThemeProvider } from "./contexts/ThemeContext"

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppRoutes />
        <ToastContainer />
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App