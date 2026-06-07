"use client"

import { useState } from "react"
import {useServicos, useCreateServico, useUpdateServico, useToggleServico, useDeleteServico,} from "@/hooks/useServicos"
import Modal from "@/components/Modal"
import Loading from "@/components/Loading"

const FORM_VAZIO = {
  nome: "",
  descricao: "",
  tempoEstimadoMinutos: "",
  precoBase: "",
  ativo: true,
}

export default function ServicosPage() {
  const [busca, setBusca] = useState("")
  const [page, setPage] = useState(0)
  const [modalAberto, setModalAberto] = useState(false)
  const [servicoEditando, setServicoEditando] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)
  const [erroForm, setErroForm] = useState("")
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(null)

  const { data, isLoading, isError } = useServicos({ busca, page })
  const criar = useCreateServico()
  const atualizar = useUpdateServico()
  const toggle = useToggleServico()
  const excluir = useDeleteServico()

  const servicos = data?.content || []
  const totalPaginas = data?.totalPages || 0

  function abrirCriar() {
    setServicoEditando(null)
    setForm(FORM_VAZIO)
    setErroForm("")
    setModalAberto(true)
  }

  function abrirEditar(s) {
    setServicoEditando(s)
    setForm({
      nome: s.nome || "",
      descricao: s.descricao || "",
      tempoEstimadoMinutos: s.tempoEstimadoMinutos?.toString() || "",
      precoBase: s.precoBase?.toString() || "",
      ativo: s.ativo ?? true,
    })
    setErroForm("")
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setServicoEditando(null)
    setErroForm("")
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErroForm("")

    if (!form.nome.trim()) { setErroForm("Nome é obrigatório."); return }
    if (!form.precoBase) { setErroForm("Preço-base é obrigatório."); return }

    const payload = {
      nome: form.nome.trim(),
      descricao: form.descricao.trim() || undefined,
      tempoEstimadoMinutos: form.tempoEstimadoMinutos ? parseInt(form.tempoEstimadoMinutos, 10) : undefined,
      precoBase: parseFloat(form.precoBase),
      ativo: form.ativo,
    }

    try {
      if (servicoEditando) {
        await atualizar.mutateAsync({ id: servicoEditando.id, ...payload })
      } else {
        await criar.mutateAsync(payload)
      }
      fecharModal()
    } catch (err) {
      setErroForm(err?.response?.data?.mensagem || "Erro ao salvar.")
    }
  }

  async function handleToggle(id) {
    try {
      await toggle.mutateAsync(id)
    } catch {
      alert("Não foi possível alterar o status do serviço.")
    }
  }

  async function handleExcluir(id) {
    try {
      await excluir.mutateAsync(id)
      setConfirmandoExclusao(null)
    } catch (err) {
      alert(err?.response?.data?.mensagem || "Não foi possível excluir o serviço.")
    }
  }

  const salvando = criar.isPending || atualizar.isPending

  return (
    <div className="dashboard">
      <h1 className="page-title">Serviços</h1>
      <p className="page-subtitle">Catálogo de serviços da oficina</p>

      <div className="page-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Buscar por nome ou descrição..."
          value={busca}
          onChange={(e) => { setBusca(e.target.value); setPage(0) }}
        />
        <button className="btn-primary" onClick={abrirCriar}>+ Novo serviço</button>
      </div>

      {isLoading && <div className="loading-center"><Loading size="md" /></div>}
      {isError && <div className="error-banner">Não foi possível carregar os serviços.</div>}

      {!isLoading && !isError && (
        <>
          {servicos.length === 0 ? (
            <div className="empty-state">
              {busca ? "Nenhum serviço encontrado." : "Nenhum serviço cadastrado ainda."}
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Preço-base</th>
                    <th>Tempo est.</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {servicos.map((s) => (
                    <tr key={s.id} className={!s.ativo ? "tr-inativo" : ""}>
                      <td className="td-bold">{s.nome}</td>
                      <td className="td-mono">R$ {Number(s.precoBase).toFixed(2)}</td>
                      <td>{s.tempoEstimadoMinutos ? `${s.tempoEstimadoMinutos} min` : "—"}</td>
                      <td>
                        {/* Toggle rápido de ativo/inativo — chama PATCH sem abrir modal */}
                        <button
                          className={`badge-status ${s.ativo ? "badge-ativo" : "badge-inativo"}`}
                          onClick={() => handleToggle(s.id)}
                          disabled={toggle.isPending}
                          title={s.ativo ? "Clique para desativar" : "Clique para ativar"}
                        >
                          {s.ativo ? "Ativo" : "Inativo"}
                        </button>
                      </td>
                      <td className="td-actions">
                        <button className="btn-icon btn-edit" onClick={() => abrirEditar(s)} title="Editar">✏️</button>
                        <button className="btn-icon btn-delete" onClick={() => setConfirmandoExclusao(s)} title="Excluir">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPaginas > 1 && (
            <div className="pagination">
              <button className="btn-page" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Anterior</button>
              <span className="page-info">Página {page + 1} de {totalPaginas}</span>
              <button className="btn-page" disabled={page + 1 >= totalPaginas} onClick={() => setPage(p => p + 1)}>Próxima →</button>
            </div>
          )}
        </>
      )}

      <Modal open={modalAberto} onClose={fecharModal} title={servicoEditando ? "Editar serviço" : "Novo serviço"}>
        <form className="form" onSubmit={handleSubmit}>
          {erroForm && <div className="form-error">{erroForm}</div>}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome *</label>
              <input className="form-input" name="nome" value={form.nome} onChange={handleChange} placeholder="Troca de óleo" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Preço-base (R$) *</label>
              <input className="form-input" type="number" step="0.01" min="0" name="precoBase" value={form.precoBase} onChange={handleChange} placeholder="150.00" required />
            </div>
            <div className="form-group">
              <label className="form-label">Tempo estimado (min)</label>
              <input className="form-input" type="number" min="1" name="tempoEstimadoMinutos" value={form.tempoEstimadoMinutos} onChange={handleChange} placeholder="60" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Descrição</label>
              <textarea className="form-input form-textarea" name="descricao" value={form.descricao} onChange={handleChange} placeholder="Detalhes do serviço..." rows={2} />
            </div>
          </div>

          <div className="form-row">
            <label className="form-check">
              <input type="checkbox" name="ativo" checked={form.ativo} onChange={handleChange} />
              <span>Serviço ativo (disponível para ordens)</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={fecharModal}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={salvando}>
              {salvando ? "Salvando..." : servicoEditando ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!confirmandoExclusao} onClose={() => setConfirmandoExclusao(null)} title="Excluir serviço" size="sm">
        <p className="confirm-text">
          Excluir o serviço <strong>{confirmandoExclusao?.nome}</strong>?
          <br /><span className="confirm-warning">Esta ação não pode ser desfeita.</span>
        </p>
        <div className="form-actions">
          <button className="btn-secondary" onClick={() => setConfirmandoExclusao(null)}>Cancelar</button>
          <button className="btn-danger" onClick={() => handleExcluir(confirmandoExclusao.id)} disabled={excluir.isPending}>
            {excluir.isPending ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </Modal>
    </div>
  )
}