"use client"

import { useAuthStore } from "@/zustand"
import { useCurrentUser } from "@/hooks/useAuth"
import Loading from "@/components/Loading"
import "@/styles/auth.css"

export default function PerfilPage() {
  const user = useAuthStore((state) => state.user)
  const { data: currentUser, isLoading } = useCurrentUser()

  const displayUser = currentUser || user

  if (isLoading) {
    return (
      <div className="dashboard">
        <Loading size="md" />
      </div>
    )
  }

  return (
    <div className="dashboard">
      <h1 className="page-title">Perfil</h1>
      <p className="page-subtitle">Informações da sua conta</p>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {displayUser?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="profile-name">{displayUser?.name || "—"}</p>
            <p className="profile-email">{displayUser?.email || "—"}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input
              className="form-input"
              value={displayUser?.name || ""}
              readOnly
            />
          </div>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              className="form-input"
              value={displayUser?.email || ""}
              readOnly
            />
          </div>
          {displayUser?.role && (
            <div className="form-group">
              <label className="form-label">Perfil</label>
              <input
                className="form-input"
                value={displayUser.role}
                readOnly
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
