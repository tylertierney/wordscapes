// import styles from './App.module.scss'

import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Navbar from './components/Navbar/Navbar'

function App() {
  return (
    <>
      <Navbar />
      <Outlet></Outlet>
      <ToastContainer
        position="top-center"
        closeOnClick={true}
        autoClose={500}
      />
    </>
  )
}

export default App
