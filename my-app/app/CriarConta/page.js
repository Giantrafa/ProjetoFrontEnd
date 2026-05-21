"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStorage } from "@/zustand"
import "@/styles/page.css"

export default function Home() {
  const setLoggedUser = useUserStorage((state) => state.setLoggedUser)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  function handleCreateAccount(event) {
    event.preventDefault()

    if (!name.trim() || !email.trim() || !password) {
      setMessage("Preencha todos os campos para criar a conta.")
      return
    }

    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem.")
      return
    }

    setLoggedUser({ email, name })
    setMessage("Conta criada com sucesso. Você já está logado.")
    router.push("/")
  }
  return (
    <main>    
      <div className="loginContainer">

        <div className="loginCard">                    
          
          <form className="loginForm" onSubmit={handleCreateAccount}>
            <h1>
              Crie sua conta para acessar o MedEvent
            </h1>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Digite seu nome"
            />

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Digite seu e-mail"
            />
            
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Crie uma senha segura"
            />
            
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirme sua senha"
            />


            <button className="primary">
              Criar conta
            </button>

          </form>

          <div className="links">

            <a href="/">Login</a>

            <a href="/RecuperarSenha">Recuperar senha</a>

          </div>

        </div>

      </div>
    </main>
  )
}