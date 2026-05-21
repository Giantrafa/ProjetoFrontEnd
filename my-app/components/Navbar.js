"use client"

import { useState } from "react"
import "../styles/Navbar.css"

export default function Navbar({ children }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">

      <div className="navbar-left">
        <h1 className="logo">MedEvent</h1>
      </div>

      <nav className={`menu ${open ? "open" : ""}`} role="navigation" aria-label="Main Navigation">
        <a href="/">Eventos</a>
        <a href="/sobre">Sobre</a>
      </nav>

      <div className="navbar-right">
        <div className="extras">{children}</div>

        <button className="button">Entrar</button>

        <button
          className={`hamburger ${open ? "is-open" : ""}`}
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

    </header>
  )
}
