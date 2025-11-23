
import Navbar from "./components/navbar"
import {Route,Routes} from 'react-router-dom'
import CheckAuth from './components/checkAuth.jsx'
import TicketDetailsPage from './pages/ticket.jsx'
import Tickets from './pages/tickets.jsx'
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import Admin from './pages/admin.jsx'
function App() {

  return (
    <div>
    <Navbar/>
    <Routes>
        <Route
        path='/'
        element={
          <CheckAuth isProtected = {true}>
            <Tickets/>
          </CheckAuth>
        }
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