"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForgotPassword } from "@/hooks/useAuth"
import { useAuthStore } from "@/zustand"
import Loading from "@/components/Loading"
import "@/styles/auth.css"

export default function RecuperarSenhaPage() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [email, setEmail] = useState("")
  const [localError, setLocalError] = useState("")
  const [sent, setSent] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const forgotPassword = useForgotPassword()

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [hydrated, isAuthenticated, router])

  if (!hydrated) return <Loading fullscreen />

  function handleSubmit(e) {
    e.preventDefault()
    setLocalError("")

    if (!email.trim()) {
      setLocalError("Informe seu e-mail.")
      return
    }

    forgotPassword.mutate({ email }, { onSuccess: () => setSent(true) })
  }

  const errorMessage =
    localError ||
    (forgotPassword.isError
      ? forgotPassword.error?.response?.data?.message || "Erro ao enviar. Tente novamente."
      : "")

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <span className="auth-brand-icon">🔧</span>
          <span className="auth-brand-name">AutoShop Pro</span>
        </div>

        <div className="auth-card">
          <h1 className="auth-title">Recuperar senha</h1>
          <p className="auth-subtitle">
            {sent
              ? "Instruções enviadas. Verifique seu e-mail."
              : "Informe seu e-mail para receber as instruções"}
          </p>

          {errorMessage && <div className="auth-error">{errorMessage}</div>}

          {sent ? (
            <div className="auth-success">
              Enviamos um link de recuperação para <strong>{email}</strong>.
              Verifique sua caixa de entrada e spam.
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <button
                className="auth-button"
                type="submit"
                disabled={forgotPassword.isPending}
              >
                {forgotPassword.isPending ? "Enviando..." : "Enviar instruções"}
              </button>
            </form>
          )}

          <div className="auth-links">
            <Link href="/login">Voltar ao login</Link>
            <Link href="/cadastro">Criar conta</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
