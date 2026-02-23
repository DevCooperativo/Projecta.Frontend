import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "../features/auth/pages/login"

export const AppRoutes = () =>{
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Login/>} path="/login"></Route>
            </Routes>
        </BrowserRouter>
    )
}