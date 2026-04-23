import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from '../Navbar'
import HomePage from "../src/components/landing_page/HomePage"
import Login from "../src/components/users/Login"
import Signup from "../src/components/users/Signup"
import Admin from "../src/components/dashboard/Admin"
import TestResult from "../src/components/test/TestResult"
import CareerGuidance from "../src/components/career/CareerGuidance"
import Student from "../src/components/dashboard/Student"

import QuizPage from "./components/career/QuizPage";  

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="app-container">
      <Navbar setOpen={setSidebarOpen} />
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        
          <Routes>
              <Route path='/'element={<HomePage />}/>
              <Route path='/signup'element={<Signup />}/>
              <Route path='/login'element={<Login />}/>
              <Route path='/admin'element={<Admin />}/>
              <Route path='/student'element={<Student />}/>
              <Route path='/test'element={<TestResult />}/>
              <Route path='/careerguidence'element={<CareerGuidance />}/>
              <Route path='/career'element={<CareerGuidance />}/>
              <Route path="/quiz" element={<QuizPage />} /> 
          </Routes>
       
      </main>
    </div>
  )
}

export default App
