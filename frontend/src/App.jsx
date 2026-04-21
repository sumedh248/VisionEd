import { useState } from 'react'
import './App.css'
import Navbar from '../Navbar'
import Signup from './components/users/Signup'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="app-container">
      <Navbar setOpen={setSidebarOpen} />
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Signup />
      </main>
    </div>
  )
}

export default App
