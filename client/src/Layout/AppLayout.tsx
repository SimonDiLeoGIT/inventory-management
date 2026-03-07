import { Outlet } from "react-router-dom"
import { Sidebar } from "../Components/Sidebar/Sidebar"

export const AppLayout = () => {
  return (
    <div className="flex">

      <Sidebar />

      <main className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </main>

    </div>
  )
}