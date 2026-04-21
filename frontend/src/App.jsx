import { useState } from 'react'
import './App.css'
import Navbar from '../Navbar'
import Signup from './components/users/Signup'
import Student from './components/dashboard/Student'
import Admin from './components/dashboard/Admin'
import TestCreator from './components/test/TestCreator'
import TestResult from './components/test/TestResult'
import CareerGuidance from './components/career/CareerGuidance'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="app-container">
      <Navbar setOpen={setSidebarOpen} />
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Signup />
        <Student/>
        <Admin/> 
        <TestCreator/>
        <TestResult/>
        <CareerGuidance/>
      </main>
    </div>
  )
}

export default App
