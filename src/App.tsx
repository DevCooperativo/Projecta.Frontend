import './App.css'
import { ToastContainer } from 'react-toastify'
import { AppRoutes } from './routes'

function App() {
    return (
        <>
            <AppRoutes />
            <ToastContainer position="top-right" autoClose={4000} />
        </>
    )
}

export default App
