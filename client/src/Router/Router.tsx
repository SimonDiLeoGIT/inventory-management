import { Route, Routes } from 'react-router-dom'
import { Home } from '../Page/Home'
import { ProtectedRoute } from '../Page/Auth/ProtectedRoute'
import Login from '../Page/Auth/Login'
import { Dashboard } from '../Page/Dashboard/Dashboard'
import { AppLayout } from '../Layout/AppLayout'

const Router = () => {
  return (
    <Routes>

      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected layout */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>

        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Route>

    </Routes>
  )
}

export default Router