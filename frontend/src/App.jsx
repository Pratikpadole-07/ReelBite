import React from 'react'
import "./styles/reels.css";

import './App.css'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from "./context/AuthContext";

function App(){
    
    return (
        <AuthProvider>
    <AppRoutes />
         </AuthProvider>
    )
}

export default App