"use client"

import React, { useState } from "react"
import Link from "next/link"
import "@/styles/autoprime.css"

const filters = [
  { label: 'Todos', value: 'todos' },
  { label: 'Populares', value: 'popular' },
  { label: 'Sedãs', value: 'sedan' },
  { label: 'SUVs', value: 'suv' },
  { label: 'Picapes', value: 'pickup' },
  { label: 'Premium', value: 'premium' },
];

const services = [
  {
    icon: '🛢️',
    title: 'Troca de óleo',
    description: 'Óleo, filtro, fluídos e verificação geral para manter o motor protegido.',
  },
  {
    icon: '🧰',
    title: 'Revisão preventiva',
    description: 'Checklist completo para evitar problemas e aumentar a vida útil do carro.',
  },
  {
    icon: '🛞',
    title: 'Freios e suspensão',
    description: 'Pastilhas, discos, amortecedores, buchas, bandejas e alinhamento técnico.',
  },
  {
    icon: '💻',
    title: 'Diagnóstico eletrônico',
    description: 'Scanner automotivo para leitura de falhas, sensores e sistemas do veículo.',
  },
];

const models = [
  {
    category: 'popular',
    title: 'Chevrolet Onix',
    badge: 'Popular',
    description: 'Revisão, óleo, freios, elétrica, suspensão e scanner.',
    meta: ['Motor 1.0', 'Flex', 'Manual/Auto'],
  },
  {
    category: 'popular',
    title: 'Hyundai HB20',
    badge: 'Popular',
    description: 'Manutenção completa para uso urbano e viagem.',
    meta: ['Motor 1.0/1.6', 'Flex', 'Revisão'],
  },
  {
    category: 'sedan',
    title: 'Toyota Corolla',
    badge: 'Sedã',
    description: 'Diagnóstico, revisão premium, freios e troca de fluidos.',
    meta: ['Automático', 'Híbrido/Flex', 'Premium'],
  },
  {
    category: 'sedan',
    title: 'Honda Civic',
    badge: 'Sedã',
    description: 'Atendimento técnico para motor, câmbio, suspensão e eletrônica.',
    meta: ['Motor 2.0', 'CVT', 'Scanner'],
  },
  {
    category: 'suv',
    title: 'Jeep Compass',
    badge: 'SUV',
    description: 'Revisão completa, suspensão, eletrônica e diagnóstico avançado.',
    meta: ['SUV', 'Diesel/Flex', '4x4'],
  },
  {
    category: 'suv',
    title: 'Volkswagen T-Cross',
    badge: 'SUV',
    description: 'Manutenção preventiva e corretiva para veículos turbo.',
    meta: ['TSI', 'Turbo', 'Automático'],
  },
  {
    category: 'pickup',
    title: 'Toyota Hilux',
    badge: 'Picape',
    description: 'Serviço pesado para suspensão, freios, óleo e uso intenso.',
    meta: ['Diesel', '4x4', 'Robusta'],
  },
  {
    category: 'premium',
    title: 'BMW Série 3',
    badge: 'Premium',
    description: 'Diagnóstico técnico, revisão premium e cuidado especializado.',
    meta: ['Turbo', 'Premium', 'Scanner'],
  },
  {
    category: 'premium',
    title: 'Mercedes-Benz Classe C',
    badge: 'Premium',
    description: 'Manutenção com atenção aos detalhes e sistemas eletrônicos.',
    meta: ['Luxo', 'Automático', 'Eletrônica'],
  },
];

const contactCards = [
  { title: '📍 Endereço', description: 'Av. Principal, 1000 — Recife/PE' },
  { title: '📞 Telefone', description: '(81) 99999-9999' },
  { title: '🕒 Horário', description: 'Segunda a sábado, das 8h às 18h' },
];

const checkItems = [
  'Orçamento antes de iniciar o serviço',
  'Peças de qualidade e garantia no serviço',
  'Atendimento para carros nacionais e importados',
  'Diagnóstico eletrônico com scanner automotivo',
];

function Header() {
  return (
    <header>
      <div className="container">
        <nav>
          <div className="logo">
            <img
              src="/logo.png"
              alt="AutoShop Pro"
              style={{ height: "48px", width: "auto", objectFit: "contain" }}
            />
            <span>AutoPrime Oficina</span>
          </div>

          <ul className="menu">
            <li><a href="#inicio">Início</a></li>
            <li><a href="#servicos">Serviços</a></li>
            <li><a href="#modelos">Modelos</a></li>
            <li><a href="#sobre">Sobre</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>

          <div className="nav-actions">
            <Link href="/login" className="btn secondary">Entrar</Link>
            <a className="btn" href="#contato">Agendar revisão</a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="container hero-grid">
        <div>
          <div className="badge">⚙️ Mecânica completa • Diagnóstico moderno</div>
          <h1>Sua oficina com visual <span>premium</span> e serviço de confiança.</h1>
          <p>
            Especialistas em manutenção automotiva, revisão preventiva, troca de óleo,
            freios, suspensão, elétrica e diagnóstico computadorizado para diversos modelos.
          </p>

          <div className="hero-actions">
            <a className="btn" href="#modelos">Ver modelos atendidos</a>
            <a className="btn secondary" href="#servicos">Conhecer serviços</a>
          </div>

          <div className="stats">
            <div className="stat">
              <strong>+1.200</strong>
              <small>Carros atendidos</small>
            </div>
            <div className="stat">
              <strong>4.9★</strong>
              <small>Avaliação média</small>
            </div>
            <div className="stat">
              <strong>24h</strong>
              <small>Orçamento rápido</small>
            </div>
          </div>
        </div>

        <div className="car-showcase">
          <div className="floating-card one">
            <strong>Scanner automotivo</strong>
            <small>Diagnóstico preciso</small>
          </div>

          <div className="car-art" aria-label="Carro esportivo ilustrativo">
            <div className="car-body">
              <div className="window"></div>
              <div className="headlight"></div>
            </div>
            <div className="wheel left"></div>
            <div className="wheel right"></div>
          </div>

          <div className="road"></div>

          <div className="floating-card two">
            <strong>Revisão completa</strong>
            <small>Motor • Freio • Suspensão</small>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="section-title">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function Services() {
  return (
    <section id="servicos">
      <div className="container">
        <SectionTitle
          eyebrow="Nossos serviços"
          title="Tudo que seu carro precisa em um só lugar"
          description="Atendimento profissional para carros populares, sedãs, SUVs, picapes e veículos premium."
        />

        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Models() {
  const [activeFilter, setActiveFilter] = useState('todos');

  const filteredModels = models.filter(
    (model) => activeFilter === 'todos' || model.category === activeFilter
  );

  return (
    <section id="modelos">
      <div className="container">
        <SectionTitle
          eyebrow="Modelos atendidos"
          title="Trabalhamos com vários tipos de carros"
          description="Use os filtros abaixo para visualizar exemplos de modelos que a oficina atende."
        />

        <div className="models-panel">
          <div className="filters">
            {filters.map((filter) => (
              <button
                className={`filter-btn ${activeFilter === filter.value ? 'active' : ''}`}
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="models-grid" id="modelsGrid">
            {filteredModels.map((model) => (
              <article className="model-card" key={model.title}>
                <div className="mini-car"></div>
                <div className="model-top">
                  <h3>{model.title}</h3>
                  <span className="model-badge">{model.badge}</span>
                </div>
                <p>{model.description}</p>
                <div className="model-meta">
                  {model.meta.map((item) => (
                    <small key={item}>{item}</small>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="sobre">
      <div className="container about">
        <div className="about-image">
          <div className="tool">🔧</div>
          <div className="tool">⚙️</div>
          <div className="tool">🧪</div>
        </div>

        <div className="about-content">
          <h2>Oficina moderna, atendimento transparente e resultado profissional.</h2>
          <p>
            A AutoPrime Oficina foi pensada para transmitir confiança desde o primeiro contato.
            Aqui o cliente acompanha o diagnóstico, entende o problema e recebe um orçamento claro.
          </p>
          <p>
            O objetivo é entregar um serviço de qualidade, com organização, tecnologia e cuidado
            com cada detalhe do veículo.
          </p>

          <div className="check-list">
            {checkItems.map((item) => (
              <div className="check-item" key={item}>
                <span>✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [showMessage, setShowMessage] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setShowMessage(true);
    event.currentTarget.reset();

    setTimeout(() => {
      setShowMessage(false);
    }, 4500);
  }

  return (
    <section id="contato">
      <div className="container">
        <SectionTitle
          eyebrow="Agendamento"
          title="Solicite seu orçamento"
          description="Preencha os dados abaixo para simular o contato com a oficina."
        />

        <div className="contact-wrapper">
          <div className="contact-info">
            {contactCards.map((card) => (
              <div className="contact-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>

          <form id="appointmentForm" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="name">Nome</label>
                <input id="name" type="text" placeholder="Seu nome" required />
              </div>

              <div className="field">
                <label htmlFor="phone">Telefone</label>
                <input id="phone" type="tel" placeholder="(81) 99999-9999" required />
              </div>

              <div className="field">
                <label htmlFor="car">Modelo do carro</label>
                <input id="car" type="text" placeholder="Ex: Onix 2022" required />
              </div>

              <div className="field">
                <label htmlFor="service">Serviço desejado</label>
                <select id="service" required defaultValue="">
                  <option value="">Selecione</option>
                  <option>Troca de óleo</option>
                  <option>Revisão completa</option>
                  <option>Freios e suspensão</option>
                  <option>Diagnóstico eletrônico</option>
                  <option>Outro serviço</option>
                </select>
              </div>

              <div className="field full">
                <label htmlFor="message">Mensagem</label>
                <textarea id="message" placeholder="Descreva o problema do carro"></textarea>
              </div>

              <div className="field full">
                <button className="btn" type="submit">Enviar solicitação</button>
              </div>
            </div>

            {showMessage && (
              <div className="form-message show" id="formMessage">
                Solicitação enviada com sucesso! A oficina entrará em contato em breve.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container footer-content">
        <p>© 2026 AutoPrime Oficina. Todos os direitos reservados.</p>
        <p>Desenvolvido para projeto front-end.</p>
      </div>
    </footer>
  );
}

export default function AutoPrimeLanding() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Models />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
