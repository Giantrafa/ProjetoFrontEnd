"use client"

import { useState } from "react"
import Navbar from "../components/Navbar.js"
import { useUserStorage } from "@/zustand"
import "../styles/page.css"

export default function Home() {
  const loggedUser = useUserStorage((state) => state.loggedUser)
  const setLoggedUser = useUserStorage((state) => state.setLoggedUser)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  function handleLogin(event) {
    event.preventDefault()

    if (!email.trim()) {
      setMessage("Informe seu e-mail para continuar.")
      return
    }

    setLoggedUser({
      email,
      name: email.split("@")[0],
    })
    setMessage("Login realizado com sucesso. Bem-vindo(a)!")
  }

  function handleLogout() {
    setLoggedUser(null)
    setMessage("Sessão encerrada com sucesso.")
  }

  return (
    <main>
      <Navbar />

      <div className="loginContainer">
        <div className="loginCard">
          {loggedUser ? (
            <>
              <h1>Bem-vindo, {loggedUser.name || loggedUser.email}!</h1>
              <p>
                Você está conectado. O Zustand mantém sua sessão em cache.
              </p>

              <button className="primary" onClick={handleLogout}>
                Sair
              </button>

              {message && <p className="message">{message}</p>}
            </>
          ) : (
            <>
              <h1>Bem-vindo ao MedEvent</h1>

              <p>
                Faça login para gerenciar eventos, inscrições e certificados médicos.
              </p>

              <form className="loginForm" onSubmit={handleLogin}>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Seu e-mail"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Sua senha"
                />

                <button className="primary" type="submit">
                  Entrar
                </button>
              </form>

              <div className="links">
                <a href="/RecuperarSenha">Recuperar senha</a>
                <a href="/CriarConta">Criar conta</a>
              </div>

              {message && <p className="message">{message}</p>}
            </>
          )}
        </div>
      </div>
    </main>
  )
}