import logo from './logo.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import ClientHome from './components/ClientHome'
import AdminHome from './components/AdminHome'

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/client' element={<ClientHome />} />
        <Route path='/admin' element={<AdminHome />} />
      </Routes>
    </div>
  )
}

export default App
