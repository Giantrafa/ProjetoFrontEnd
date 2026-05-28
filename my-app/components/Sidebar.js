"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useUIStore, useAuthStore } from "@/zustand"
import "@/styles/sidebar.css"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/dashboard/perfil", label: "Perfil", icon: "◎" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  function handleLogout() {
    clearAuth()
    router.push("/login")
  }

  return (
    <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
      <div className="sidebar-header">
        <span className="sidebar-logo-icon">🔧</span>
        <span className="sidebar-logo">AutoShop Pro</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-item ${pathname === item.href ? "sidebar-item-active" : ""}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-icon">⏻</span>
          <span className="sidebar-label">Sair</span>
        </button>
      </div>
    </aside>
  )
}
