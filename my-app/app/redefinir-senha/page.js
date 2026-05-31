"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useResetPassword } from "@/hooks/useAuth"
import { useAuthStore } from "@/zustand"
import Loading from "@/components/Loading"
import "@/styles/auth.css"

function RedefinirSenhaForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [localError, setLocalError] = useState("")
  const [hydrated, setHydrated] = useState(false)

  const resetPassword = useResetPassword()

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [hydrated, isAuthenticated, router])

  if (!hydrated) return <Loading fullscreen />

  if (!token) {
    return (
      <main className="auth-page">
        <div className="auth-container">
          <div className="auth-brand">
            <span className="auth-brand-icon">🔧</span>
            <span className="auth-brand-name">AutoShop Pro</span>
          </div>
          <div className="auth-card">
            <h1 className="auth-title">Link inválido</h1>
            <p className="auth-subtitle">Este link de recuperação é inválido ou expirou.</p>
            <div className="auth-links">
              <Link href="/recuperar-senha">Solicitar novo link</Link>
              <Link href="/login">Voltar ao login</Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    setLocalError("")

    if (!newPassword || !confirmPassword) {
      setLocalError("Preencha todos os campos.")
      return
    }

    if (newPassword.length < 8) {
      setLocalError("A senha deve ter no mínimo 8 caracteres.")
      return
    }

    if (newPassword !== confirmPassword) {
      setLocalError("As senhas não coincidem.")
      return
    }

    resetPassword.mutate({ token, newPassword })
  }

  const errorMessage =
    localError ||
    (resetPassword.isError
      ? resetPassword.error?.response?.data?.message || "Erro ao redefinir senha. Tente novamente."
      : "")

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <span className="auth-brand-icon">🔧</span>
          <span className="auth-brand-name">AutoShop Pro</span>
        </div>

        <div className="auth-card">
          <h1 className="auth-title">Nova senha</h1>
          <p className="auth-subtitle">Escolha uma senha segura para sua conta</p>

          {errorMessage && <div className="auth-error">{errorMessage}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nova senha</label>
              <input
                className="form-input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar senha</label>
              <input
                className="form-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita sua senha"
                required
              />
            </div>

            <button
              className="auth-button"
              type="submit"
              disabled={resetPassword.isPending}
            >
              {resetPassword.isPending ? "Salvando..." : "Salvar nova senha"}
            </button>
          </form>

          <div className="auth-links">
            <Link href="/login">Voltar ao login</Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={<Loading fullscreen />}>
      <RedefinirSenhaForm />
    </Suspense>
  )
}
