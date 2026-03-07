import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Package, Tags, Repeat, BarChart3, Settings } from "lucide-react"

export const Sidebar = () => {

  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard /> },
    { name: "Productos", path: "/productos", icon: <Package /> },
    { name: "Categorías", path: "/categorias", icon: <Tags /> },
    { name: "Movimientos", path: "/movimientos", icon: <Repeat /> },
    { name: "Reportes", path: "/reportes", icon: <BarChart3 /> },
    { name: "Configuración", path: "/configuracion", icon: <Settings /> },
  ]

  return (
    <aside
      className={`h-screen bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 transition-all duration-300
      ${collapsed ? "w-14" : "w-64"}`}
    >

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-400">

        {!collapsed && <h1 className="text-lg font-bold">Mi App</h1>}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-xl"
        >
          ☰
        </button>

      </div>

      {/* Menu */}
      <nav className="mt-4">

        {menu.map((item) => {

          const active = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition
              ${active ? "bg-zinc-200 dark:bg-zinc-700" : ""}`}
            >

              <span className="text-xl">{item.icon}</span>

              {!collapsed && <span>{item.name}</span>}

            </Link>
          )
        })}

      </nav>

    </aside>
  )
}