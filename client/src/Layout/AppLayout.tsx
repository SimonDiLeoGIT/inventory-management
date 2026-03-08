import { Outlet } from "react-router-dom"
import { Sidebar } from "../Components/Sidebar/Sidebar"

export const AppLayout = () => {
  return (
    <div className="flex">

      <Sidebar />

      <main className="flex-1 p-8 bg-gray-100 dark:bg-zinc-950 text-bg-zinc-900 dark:text-zinc-200 h-screen overflow-y-auto">
        <Outlet />
      </main>

    </div>
  )
}