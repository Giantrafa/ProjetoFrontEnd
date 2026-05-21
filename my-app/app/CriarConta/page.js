import "@/styles/page.css"

export default function Home() {
  return (
    <main>    
      <div className="loginContainer">

        <div className="loginCard">                    
          
          <form className="loginForm">
            <h1>
              Crie sua conta para acessar o MedEvent
            </h1>

            <input
              type="text"
              placeholder="Digite seu nome"
            />

            <input
              type="email"
              placeholder="Digite seu e-mail"
            />
            
            <input
              type="password"
              placeholder="Crie uma senha segura"
            />
            
            <input
              type="password"
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