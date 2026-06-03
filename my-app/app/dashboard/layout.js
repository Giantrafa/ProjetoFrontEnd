"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, useUIStore } from "@/zustand"
import Sidebar from "@/components/Sidebar"
import Loading from "@/components/Loading"
import "@/styles/dashboard.css"

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push("/login")
    }
  }, [hydrated, isAuthenticated, router])

  if (!hydrated || !isAuthenticated) {
    return <Loading fullscreen />
  }

  return (
    <div
      className={`app-layout ${
        sidebarOpen ? "layout-sidebar-open" : "layout-sidebar-collapsed"
      }`}
    >
      <Sidebar />

      <div className="app-content">
        <header className="app-topbar">
          <button
            className="topbar-toggle"
            onClick={toggleSidebar}
            aria-label="Alternar sidebar"
          >
            ☰
          </button>
        </header>

        <main className="app-main">{children}</main>
      </div>
    </div>
  )
}
