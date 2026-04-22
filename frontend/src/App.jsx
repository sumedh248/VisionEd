import { useState } from 'react'
import './App.css'
import Navbar from '../Navbar'
import Signup from './components/users/Signup'
import Login from './components/users/Login'
import HomePage from './components/landing_page/HomePage'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="app-container">
      <Navbar setOpen={setSidebarOpen} />
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* <Signup /> */}
        {/* <Login /> */}
        <HomePage/>
      </main>
    </div>
  )
}

export default App
