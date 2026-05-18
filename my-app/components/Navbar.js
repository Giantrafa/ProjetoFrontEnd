import "../styles/Navbar.css"

export default function Navbar() {
  return (
    <header className="navbar">

      <h1 className="logo">
        {/* nome */}
        MedEvent
      </h1>

      <nav className="menu">
        {/* exemplo */}
        <a href="#">
          Eventos
        </a>
      </nav>

      <button className="button">
        Entrar
      </button>

    </header>
  )
}