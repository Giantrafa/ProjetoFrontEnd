"use client"

import { useState } from "react"
import { useUserStorage } from "@/zustand"
import "@/styles/page.css"

export default function Home() {
  const loggedUser = useUserStorage((state) => state.loggedUser)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  function handleRecover(event) {
    event.preventDefault()
    if (!email.trim()) {
      setMessage("Informe seu e-mail para recuperar a senha.")
      return
    }

    if (!loggedUser || loggedUser.email !== email) {
      setMessage(
        "E-mail não encontrado. Faça login ou crie uma conta."
      )
      return
    }

    setMessage("Pedido de recuperação enviado. Verifique seu e-mail (simulado).")
  }

  return (
    <main>    
      <div className="loginContainer">

        <div className="loginCard">                    
          
          <form className="loginForm" onSubmit={handleRecover}>
            <h1>
              Digite seu e-mail para recuperar sua senha
            </h1>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Seu e-mail da Conta"
            />
            

            <button className="primary">
              Recuperar
            </button>

          </form>

          {message && <p className="message">{message}</p>}

          <div className="links">

            <a href="/">Login</a>

            <a href="/CriarConta">Criar conta</a>

          </div>

        </div>

      </div>
    </main>
  )
}