import "../styles/page.css"

export default function Home() {
  return (
    <main>    
      <div className="loginContainer">

        <div className="loginCard">          
          <h1>
            Bem-vindo ao MedEvent
          </h1>

          <p>
            Faça login para gerenciar eventos,
            inscrições e certificados médicos.
          </p>

          <form className="loginForm">

            <input
              type="email"
              placeholder="Seu e-mail"
            />

            <input
              type="password"
              placeholder="Sua senha"
            />

            <button className="primary">
              Entrar
            </button>

          </form>

          <div className="links">

            <a
              href="/recuperar-senha"
              target="_blank"
              rel="noreferrer"
            >
              Recuperar senha
            </a>

            <a
              href="/criar-conta"
              target="_blank"
              rel="noreferrer"
            >
              Criar conta
            </a>

          </div>

        </div>

      </div>
    </main>
  )
}