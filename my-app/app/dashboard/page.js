"use client"

import { useAuthStore } from "@/zustand"

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">
        Bem-vindo, {user?.name || user?.email || "usuário"}!
      </p>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Ordens Abertas</span>
          <span className="stat-value">12</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Em Andamento</span>
          <span className="stat-value">5</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Concluídas Hoje</span>
          <span className="stat-value">8</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Clientes Ativos</span>
          <span className="stat-value">47</span>
        </div>
      </div>
    </div>
  )
}
