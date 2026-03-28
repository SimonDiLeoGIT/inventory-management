import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Package,
  Tags,
  Repeat,
  BarChart3,
  Settings,
  Box,
  ChevronLeft,
  TriangleAlert,
  LogOut
} from "lucide-react"
import { useAuth } from "../../Hooks/useAuth"
import axios from "axios"

export const Sidebar = () => {

  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const isDashboard = location.pathname === "/dashboard" || location.pathname === "/"
  const [lowStockCount, setLowStockCount] = useState(0)

  const { logout } = useAuth();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Productos", path: "/productos", icon: Package },
    { name: "Categorías", path: "/categorias", icon: Tags },
    { name: "Movimientos", path: "/movimientos", icon: Repeat },
    { name: "Reportes", path: "/reportes", icon: BarChart3 },
    { name: "Configuración", path: "/configuracion", icon: Settings }
  ]

  useEffect(() => {
    const fetchLowStockCount = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}products/low-stock`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setLowStockCount(response.data.count);
      } catch (error) {
        console.error("Error fetching low stock count:", error);
      }
    };

    fetchLowStockCount();
  }, []);

  return (
    <aside
      className={`h-screen bg-black text-zinc-300 border-r border-zinc-800 flex flex-col transition-all duration-300
      ${collapsed ? "w-16" : "w-64"}`}
    >

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="text-emerald-500">
              <Box size={24} />
            </div>
            <span className="font-semibold text-white text-lg">
              StockPro
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-zinc-400 hover:text-white"
        >
          <ChevronLeft size={18}/>
        </button>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon
          const active =
            item.path === "/dashboard"
              ? isDashboard
              : location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all
              ${
                active
                  ? "bg-zinc-800 text-emerald-400"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icon size={18}/>
              {!collapsed && (
                <span className="text-sm font-medium">
                  {item.name}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* ALERTA STOCK */}
      {!collapsed && (
        <div className="px-3 mb-4 text-sm">
          <div className="bg-red-950 border border-red-800 text-red-400 rounded-lg p-3 flex items-center gap-2">
            <span><TriangleAlert /></span> {lowStockCount} productos bajo stock
          </div>
        </div>
      )}

      {/* USER */}
      <div className="border-t border-zinc-800 p-3">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-900 text-emerald-400 flex items-center justify-center font-semibold">
              A
            </div>
            {!collapsed && (
              <div className="text-sm">
                <div className="text-white">
                  Admin Principal
                </div>
                <div className="text-zinc-400 text-xs">
                  Admin
                </div>
              </div>
            )}
          </div>
          <button
            onClick={logout}
          >
            <LogOut size={16} className="text-zinc-400 hover:text-white cursor-pointer"/>
          </button>
        </div>
      </div>
    </aside>
  )
}