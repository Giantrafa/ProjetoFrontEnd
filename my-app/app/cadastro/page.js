"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRegister } from "@/hooks/useAuth"
import { useAuthStore } from "@/zustand"
import Loading from "@/components/Loading"
import "@/styles/auth.css"

export default function CadastroPage() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [localError, setLocalError] = useState("")
  const [hydrated, setHydrated] = useState(false)

  const register = useRegister()

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

    if (!name.trim() || !email.trim() || !password) {
      setLocalError("Preencha todos os campos.")
      return
    }

    if (password !== confirmPassword) {
      setLocalError("As senhas não coincidem.")
      return
    }

    register.mutate({ name, email, password })
  }

  const errorMessage =
    localError ||
    (register.isError
      ? register.error?.response?.data?.message || "Erro ao criar conta. Tente novamente."
      : "")

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <span className="auth-brand-icon">🔧</span>
          <span className="auth-brand-name">AutoShop Pro</span>
        </div>

        <div className="auth-card">
          <h1 className="auth-title">Crie sua conta</h1>
          <p className="auth-subtitle">Preencha os dados para se cadastrar</p>

          {errorMessage && <div className="auth-error">{errorMessage}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nome completo</label>
              <input
                className="form-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
              />
            </div>

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
              disabled={register.isPending}
            >
              {register.isPending ? "Cadastrando..." : "Criar conta"}
            </button>
          </form>

          <div className="auth-links">
            <Link href="/login">Já tenho conta</Link>
            <Link href="/recuperar-senha">Recuperar senha</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
