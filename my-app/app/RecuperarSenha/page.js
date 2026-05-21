import "@/styles/page.css"

export default function Home() {
  return (
    <main>    
      <div className="loginContainer">

        <div className="loginCard">                    
          
          <form className="loginForm">
            <h1>
              Digite seu e-mail para recuperar sua senha
            </h1>

            <input
              type="email"
              placeholder="Seu e-mail da Conta"
            />
            

            <button className="primary">
              Recuperar
            </button>

          </form>

          <div className="links">

            <a href="/">Login</a>

            <a href="/CriarConta">Criar conta</a>

          </div>

        </div>

      </div>
    </main>
  )
}