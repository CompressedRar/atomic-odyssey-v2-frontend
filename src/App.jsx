import { useState } from 'react'
import SignUpPage from './pages/SignUp.jsx'
import LoginPage from './pages/Login.jsx'
import AuthLayout from './layouts/AuthLayout.jsx'
import GameLayout from './layouts/GameLayout.jsx'

import {Routes, Route} from "react-router-dom"
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Routes>

        <Route element={<AuthLayout />}>
          <Route path='/' element={<LoginPage />} />
          <Route path='/register' element={<SignUpPage />} />
        </Route>

      </Routes>
    </div>
  )
}

export default App
