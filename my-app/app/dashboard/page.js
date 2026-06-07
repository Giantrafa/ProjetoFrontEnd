"use client"

import { useAuthStore } from "@/zustand"
import { useDashboard } from "@/hooks/useDashboard"
import Loading from "@/components/Loading"

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const { data, isLoading, isError } = useDashboard()

  const stats = [
    {
      label: "Ordens Abertas",
      value: data?.ordensAbertas ?? "—",
      color: "stat-value-accent",
    },
    {
      label: "Em Andamento",
      value: data?.ordensEmAndamento ?? "—",
      color: "stat-value-blue",
    },
    {
      label: "Concluídas",
      value: data?.ordensConcluidas ?? "—",
      color: "stat-value-green",
    },
    {
      label: "Clientes",
      value: data?.clientes ?? "—",
      color: "stat-value-accent",
    },
    {
      label: "Veículos",
      value: data?.veiculos ?? "—",
      color: "stat-value-blue",
    },
    {
      label: "Peças c/ estoque baixo",
      value: data?.pecasEstoqueBaixo ?? "—",
      color: data?.pecasEstoqueBaixo > 0 ? "stat-value-warn" : "stat-value-green",
    },
  ]

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">
        Bem-vindo, {user?.name || user?.email || "usuário"}!
      </p>

      {isError && (
        <div className="error-banner">
          Não foi possível carregar os dados. Verifique a conexão com o servidor.
        </div>
      )}

      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "48px" }}>
          <Loading size="lg" />
        </div>
      ) : (
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <span className="stat-label">{stat.label}</span>
              <span className={`stat-value ${stat.color || ""}`}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}