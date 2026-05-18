import Navbar from "../components/Navbar.js"
import "../styles/page.css"

export default function Home() {
  return (
    <main>
      <Navbar />

      <div className="container">

        <div className="left">
          <div className="badge">
            Sistema Completo
          </div>

          <h1>
            Organize congressos e eventos médicos
            de forma profissional
          </h1>

          <p>
            Crie eventos, gerencie inscrições,
            participantes e certificados em um
            único sistema moderno e intuitivo.
          </p>

          <div className="buttons">
            <button className="primary">
              Criar Evento
            </button>

            <button className="secondary">
              Explorar Eventos
            </button>
          </div>
        </div>

        <div className="right">
          <div className="card">
            <h3>Congresso de Cardiologia</h3>

            <span>
              25 Nov • Recife - PE
            </span>

            <p>
              Mais de 1200 profissionais da saúde.
            </p>
          </div>

          <div className="card">
            <h3>Simpósio de Neurologia</h3>

            <span>
              12 Dez • São Paulo - SP
            </span>

            <p>
              Evento híbrido com palestras ao vivo.
            </p>
          </div>
        </div>

        <section className="benefits">
          <h2>
            Por que usar a MedEvent?
          </h2>

          <div className="benefitGrid">

            <div className="benefitCard">
              <h3>Inscrições Online</h3>

              <p>
                Controle participantes em tempo real.
              </p>
            </div>

            <div className="benefitCard">
              <h3>Certificados</h3>

              <p>
                Gere certificados automaticamente.
              </p>
            </div>

            <div className="benefitCard">
              <h3>Dashboard Completo</h3>

              <p>
                Métricas e relatórios dos eventos.
              </p>
            </div>

          </div>
        </section>

      </div>
    </main>
  )
}