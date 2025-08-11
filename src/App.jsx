import { useState } from 'react'
import SignUpPage from './pages/SignUp.jsx'
import LoginPage from './pages/Login.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <LoginPage/>
    </div>
  )
}

export default App
