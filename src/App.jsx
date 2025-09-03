import { useEffect, useState } from 'react'
import SignUpPage from './pages/SignUp.jsx'
import LoginPage from './pages/Login.jsx'
import ProtectedRoute from './components/ProtectedRoutes.jsx'

import AuthLayout from './layouts/AuthLayout.jsx'
import GameLayout from './layouts/GameLayout.jsx'

import {Routes, Route} from "react-router-dom"
import Table from './pages/Table.jsx'
import Game from './pages/Game.jsx'

function App() {
  
  return (
    <div>
      <Routes>

        <Route element={<AuthLayout />}>
          <Route path='/' element={<LoginPage />} />
          <Route path='/register' element={<SignUpPage />} />
        </Route>

      </Routes>

      <Routes>
        <Route element = {<GameLayout />}>
          <Route path="/main" element = {<ProtectedRoute><Game /></ProtectedRoute>}/>
          
        </Route>
      </Routes>

      <Routes>

        <Route element={<AuthLayout />}>
          <Route path="/test" element = {<Game />}/>
        </Route>

      </Routes>
    </div>
  )
}

export default App
