"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useUIStore, useAuthStore } from "@/zustand"
import "@/styles/sidebar.css"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/dashboard/clientes", label: "Clientes", icon: "👥" },
  { href: "/dashboard/veiculos", label: "Veículos", icon: "🚗" },
  { href: "/dashboard/servicos", label: "Serviços", icon: "🔧" },
  { href: "/dashboard/pecas", label: "Peças / Estoque", icon: "📦" },
  { href: "/dashboard/ordens", label: "Ordens de Serviço", icon: "📋" },
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

  function isActive(href) {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  return (
    <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
      <div className="sidebar-header">
        <img
          src="/logo.png"
          alt="AutoShop Pro"
          style={{
          height: "40px",
          width: "auto",
          objectFit: "contain",
          flexShrink: 0,
        }}
      />
        <span className="sidebar-logo">AutoShop Pro</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-item ${isActive(item.href) ? "sidebar-item-active" : ""}`}
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