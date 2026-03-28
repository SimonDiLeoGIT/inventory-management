import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../Page/Auth/ProtectedRoute'
import Login from '../Page/Auth/Login'
import { Dashboard } from '../Page/Dashboard/Dashboard'
import { AppLayout } from '../Layout/AppLayout'
import { Categories } from '../Page/Categories/Categories'
import { Products } from '../Page/Products/Products'
import { Movements } from '../Page/Movements/Movements'
import { Reports } from '../Page/Reports/Reports'
import { Settings } from '../Page/Settings/Settings'

const Router = () => {
  return (
    <Routes>

      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected layout */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>

        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/movimientos" element={<Movements />} />
        <Route path="/reportes" element={<Reports />} />
        <Route path="/configuracion" element={<Settings />} />

      </Route>

    </Routes>
  )
}

export default Router