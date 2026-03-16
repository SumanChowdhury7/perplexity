import React, { useEffect } from 'react'
import { router } from './app.routes'
import { RouterProvider } from 'react-router'
import { useAuth } from '../features/auth/hook/useAuth'

const App = () => {

  const auth = useAuth();
  useEffect(() => {
    auth.handleGetMe();
  }, []);
3


  return (
    <RouterProvider router={router} />
  )
}

export default App