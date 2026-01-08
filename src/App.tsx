import { AppRoutes } from "./routes"
import { ToastProvider } from "./components/common/toast/ToastContext"
import { ToastContainer } from "./components/common/toast/ToastContainer"

function App() {
  return (
    <ToastProvider>
      <AppRoutes />
      <ToastContainer />
    </ToastProvider>
  )
}

export default App