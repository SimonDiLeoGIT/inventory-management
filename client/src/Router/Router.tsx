import { Route, Routes } from 'react-router-dom'
import { Home } from '../Page/Home'
import { ProtectedRoute } from '../Page/Auth/ProtectedRoute'
import Login from '../Page/Auth/Login'
import { Dashboard } from '../Page/Dashboard/Dashboard'
import { AppLayout } from '../Layout/AppLayout'
import { Categories } from '../Page/Categories/Categories'
import { Products } from '../Page/Products/Products'
import { Movements } from '../Page/Movements/Movements'

const Router = () => {
  return (
    <Routes>

      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected layout */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>

        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/movimientos" element={<Movements />} />

      </Route>

    </Routes>
  )
}

export default Router