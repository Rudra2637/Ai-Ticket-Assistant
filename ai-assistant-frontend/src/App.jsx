
import Navbar from "./components/navbar"
import { Route, Routes } from 'react-router-dom'
import CheckAuth from './components/checkAuth.jsx'
import TicketDetailsPage from './pages/ticket.jsx'
import Tickets from './pages/tickets.jsx'
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import Admin from './pages/admin.jsx'
import Home from './pages/home.jsx'

import { useEffect } from 'react'

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light"
    document.documentElement.setAttribute("data-theme", savedTheme)
  }, [])

  return (
    <div>
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route
        path='/ticket/:id'
        element={
          <CheckAuth isProtected = {true}>
            <TicketDetailsPage/>
          </CheckAuth>
        }
        />
        <Route
        path='/login'
        element={
          <CheckAuth isProtected = {false}>
            <Login/>
          </CheckAuth>
        }
        />
        <Route
        path='/signup'
        element={
          <CheckAuth isProtected = {false}>
            <Signup/>
          </CheckAuth>
        }
        />
        <Route
        path='/admin'
        element={
          <CheckAuth isProtected = {true}>
            <Admin/>
          </CheckAuth>
        }
        />

      </Routes>
    </div>
  )
}

export default App