import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from '../Navbar'
import HomePage from "../src/components/landing_page/HomePage"
import Login from "../src/components/users/Login"
import Signup from "../src/components/users/Signup"
import TestResult from "../src/components/test/TestResult"
import CareerGuidance from "../src/components/career/CareerGuidance"
import Student from "../src/components/dashboard/Student"
import Footer from "./components/layout/Footer"
import ExploreColleges from "./components/colleges/ExploreColleges"
import CollegeDetails from "./components/colleges/CollegeDetails"
import DashboardRouter from "./components/dashboard/DashboardRouter"
import ChatPage from "./components/dashboard/ChatPage"

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
              <Route path='/student'element={<Student />}/>
              <Route path='/test'element={<TestResult />}/>
              <Route path='/careerguidence'element={<CareerGuidance />}/>
              <Route path='/career'element={<CareerGuidance />}/>
              <Route path='/colleges' element={<ExploreColleges />}/>
              <Route path='/colleges/:collegeId' element={<CollegeDetails />}/>
              <Route path="/quiz" element={<QuizPage />} /> 
              <Route path="/dashboard" element={<DashboardRouter />} /> 
              <Route path="/chat" element={<ChatPage />} />
          </Routes>
          <Footer />
      </main>
    </div>
  )
}

export default App
