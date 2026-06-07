"use client"

import { useState } from "react"
import {useClientes, useCreateCliente, useUpdateCliente, useDeleteCliente,} from "@/hooks/useClientes"
import Modal from "@/components/Modal"
import Loading from "@/components/Loading"

const FORM_VAZIO = {
  nomeCompleto: "",
  cpfCnpj: "",
  telefone: "",
  email: "",
  endereco: "",
}

export default function ClientesPage() {
  const [busca, setBusca] = useState("")
  const [page, setPage] = useState(0)

  
  const [modalAberto, setModalAberto] = useState(false)
  const [clienteEditando, setClienteEditando] = useState(null) // null = criando
  const [form, setForm] = useState(FORM_VAZIO)
  const [erroForm, setErroForm] = useState("")

  const [confirmandoExclusao, setConfirmandoExclusao] = useState(null)

  const { data, isLoading, isError } = useClientes({ busca, page })
  const criar = useCreateCliente()
  const atualizar = useUpdateCliente()
  const excluir = useDeleteCliente()

  const clientes = data?.content || []
  const totalPaginas = data?.totalPages || 0

  function abrirCriar() {
    setClienteEditando(null)
    setForm(FORM_VAZIO)
    setErroForm("")
    setModalAberto(true)
  }

  function abrirEditar(cliente) {
    setClienteEditando(cliente)
    setForm({
      nomeCompleto: cliente.nomeCompleto || "",
      cpfCnpj: cliente.cpfCnpj || "",
      telefone: cliente.telefone || "",
      email: cliente.email || "",
      endereco: cliente.endereco || "",
    })
    setErroForm("")
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setClienteEditando(null)
    setErroForm("")
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErroForm("")

    if (!form.nomeCompleto.trim()) {
      setErroForm("Nome completo é obrigatório.")
      return
    }
    if (!form.cpfCnpj.trim()) {
      setErroForm("CPF ou CNPJ é obrigatório.")
      return
    }

    try {
      if (clienteEditando) {
        await atualizar.mutateAsync({ id: clienteEditando.id, ...form })
      } else {
        await criar.mutateAsync(form)
      }
      fecharModal()
    } catch (err) {
      setErroForm(
        err?.response?.data?.mensagem ||
          err?.response?.data?.message ||
          "Erro ao salvar. Tente novamente."
      )
    }
  }

  async function handleExcluir(id) {
    try {
      await excluir.mutateAsync(id)
      setConfirmandoExclusao(null)
    } catch (err) {
      alert(
        err?.response?.data?.mensagem ||
          "Não foi possível excluir. O cliente pode ter veículos ou ordens associadas."
      )
    }
  }

  const salvando = criar.isPending || atualizar.isPending

  return (
    <div className="dashboard">
      <h1 className="page-title">Clientes</h1>
      <p className="page-subtitle">Gerencie os clientes da oficina</p>

      {/* barra de ações */}
      <div className="page-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Buscar por nome, CPF ou e-mail..."
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value)
            setPage(0)
          }}
        />
        <button className="btn-primary" onClick={abrirCriar}>
          + Novo cliente
        </button>
      </div>

      {/* carregamento */}
      {isLoading && (
        <div className="loading-center">
          <Loading size="md" />
        </div>
      )}

      {isError && (
        <div className="error-banner">
          Não foi possível carregar os clientes.
        </div>
      )}

      {/* tabela */}
      {!isLoading && !isError && (
        <>
          {clientes.length === 0 ? (
            <div className="empty-state">
              {busca
                ? "Nenhum cliente encontrado para esta busca."
                : "Nenhum cliente cadastrado ainda."}
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CPF / CNPJ</th>
                    <th>Telefone</th>
                    <th>E-mail</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((c) => (
                    <tr key={c.id}>
                      <td className="td-bold">{c.nomeCompleto}</td>
                      <td className="td-mono">{c.cpfCnpj}</td>
                      <td>{c.telefone || "—"}</td>
                      <td>{c.email || "—"}</td>
                      <td className="td-actions">
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => abrirEditar(c)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => setConfirmandoExclusao(c)}
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* paginação */}
          {totalPaginas > 1 && (
            <div className="pagination">
              <button
                className="btn-page"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Anterior
              </button>
              <span className="page-info">
                Página {page + 1} de {totalPaginas}
              </span>
              <button
                className="btn-page"
                disabled={page + 1 >= totalPaginas}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}

      {/* modal de criar/editar */}
      <Modal
        open={modalAberto}
        onClose={fecharModal}
        title={clienteEditando ? "Editar cliente" : "Novo cliente"}
      >
        <form className="form" onSubmit={handleSubmit}>
          {erroForm && <div className="form-error">{erroForm}</div>}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome completo *</label>
              <input
                className="form-input"
                name="nomeCompleto"
                value={form.nomeCompleto}
                onChange={handleChange}
                placeholder="Nome do cliente"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">CPF / CNPJ *</label>
              <input
                className="form-input"
                name="cpfCnpj"
                value={form.cpfCnpj}
                onChange={handleChange}
                placeholder="000.000.000-00"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Telefone</label>
              <input
                className="form-input"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="(81) 99999-0000"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input
                className="form-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="cliente@email.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Endereço</label>
              <input
                className="form-input"
                name="endereco"
                value={form.endereco}
                onChange={handleChange}
                placeholder="Rua, número, bairro"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={fecharModal}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={salvando}>
              {salvando ? "Salvando..." : clienteEditando ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </Modal>

      {/* modal de confirmação de exclusão */}
      <Modal
        open={!!confirmandoExclusao}
        onClose={() => setConfirmandoExclusao(null)}
        title="Excluir cliente"
        size="sm"
      >
        <p className="confirm-text">
          Tem certeza que deseja excluir{" "}
          <strong>{confirmandoExclusao?.nomeCompleto}</strong>?
          <br />
          <span className="confirm-warning">
            Esta ação não pode ser desfeita.
          </span>
        </p>
        <div className="form-actions">
          <button
            className="btn-secondary"
            onClick={() => setConfirmandoExclusao(null)}
          >
            Cancelar
          </button>
          <button
            className="btn-danger"
            onClick={() => handleExcluir(confirmandoExclusao.id)}
            disabled={excluir.isPending}
          >
            {excluir.isPending ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </Modal>
    </div>
  )
}