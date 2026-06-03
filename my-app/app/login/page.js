"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLogin } from "@/hooks/useAuth"
import { useAuthStore } from "@/zustand"
import Loading from "@/components/Loading"
import "@/styles/auth.css"

export default function LoginPage() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [hydrated, setHydrated] = useState(false)

  const login = useLogin()

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
    login.mutate({ email, password })
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <span className="auth-brand-icon">🔧</span>
          <span className="auth-brand-name">AutoShop Pro</span>
        </div>

        <div className="auth-card">
          <h1 className="auth-title">Bem-vindo de volta</h1>
          <p className="auth-subtitle">Entre na sua conta para continuar</p>

          {login.isError && (
            <div className="auth-error">
              {login.error?.response?.data?.message || "Credenciais inválidas. Tente novamente."}
            </div>
          )}

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

            <div className="form-group">
              <label className="form-label">Senha</label>
              <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              className="auth-button"
              type="submit"
              disabled={login.isPending}
            >
              {login.isPending ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="auth-links">
            <Link href="/recuperar-senha">Esqueci minha senha</Link>
            <Link href="/cadastro">Criar conta</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
