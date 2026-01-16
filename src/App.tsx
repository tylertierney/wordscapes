import { Outlet, ScrollRestoration } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <>
      <ScrollRestoration />
      <Outlet></Outlet>
      <ToastContainer
        position='top-center'
        closeOnClick={true}
        autoClose={500}
      />
    </>
  )
}

export default App
