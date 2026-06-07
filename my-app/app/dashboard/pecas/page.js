"use client"

import { useState } from "react"
import {usePecas, useCreatePeca, useUpdatePeca, useDeletePeca,} from "@/hooks/usePecas"
import Modal from "@/components/Modal"
import Loading from "@/components/Loading"

const FORM_VAZIO = {
  nome: "",
  descricao: "",
  quantidade: "",
  estoqueMinimo: "",
  fornecedor: "",
  precoUnitario: "",
}

export default function PecasPage() {
  const [busca, setBusca] = useState("")
  const [page, setPage] = useState(0)
  const [modalAberto, setModalAberto] = useState(false)
  const [pecaEditando, setPecaEditando] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)
  const [erroForm, setErroForm] = useState("")
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(null)

  const { data, isLoading, isError } = usePecas({ busca, page })
  const criar = useCreatePeca()
  const atualizar = useUpdatePeca()
  const excluir = useDeletePeca()

  const pecas = data?.content || []
  const totalPaginas = data?.totalPages || 0

  function abrirCriar() {
    setPecaEditando(null)
    setForm(FORM_VAZIO)
    setErroForm("")
    setModalAberto(true)
  }

  function abrirEditar(p) {
    setPecaEditando(p)
    setForm({
      nome: p.nome || "",
      descricao: p.descricao || "",
      quantidade: p.quantidade?.toString() || "",
      estoqueMinimo: p.estoqueMinimo?.toString() || "",
      fornecedor: p.fornecedor || "",
      precoUnitario: p.precoUnitario?.toString() || "",
    })
    setErroForm("")
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setPecaEditando(null)
    setErroForm("")
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErroForm("")

    if (!form.nome.trim()) { setErroForm("Nome é obrigatório."); return }

    const payload = {
      nome: form.nome.trim(),
      descricao: form.descricao.trim() || undefined,
      quantidade: form.quantidade !== "" ? parseInt(form.quantidade, 10) : 0,
      estoqueMinimo: form.estoqueMinimo !== "" ? parseInt(form.estoqueMinimo, 10) : 0,
      fornecedor: form.fornecedor.trim() || undefined,
      precoUnitario: form.precoUnitario !== "" ? parseFloat(form.precoUnitario) : 0,
    }

    try {
      if (pecaEditando) {
        await atualizar.mutateAsync({ id: pecaEditando.id, ...payload })
      } else {
        await criar.mutateAsync(payload)
      }
      fecharModal()
    } catch (err) {
      setErroForm(err?.response?.data?.mensagem || "Erro ao salvar.")
    }
  }

  async function handleExcluir(id) {
    try {
      await excluir.mutateAsync(id)
      setConfirmandoExclusao(null)
    } catch (err) {
      alert(err?.response?.data?.mensagem || "Não foi possível excluir a peça.")
    }
  }

  const salvando = criar.isPending || atualizar.isPending

  return (
    <div className="dashboard">
      <h1 className="page-title">Peças / Estoque</h1>
      <p className="page-subtitle">Controle do estoque de peças da oficina</p>

      <div className="page-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Buscar por nome ou fornecedor..."
          value={busca}
          onChange={(e) => { setBusca(e.target.value); setPage(0) }}
        />
        <button className="btn-primary" onClick={abrirCriar}>+ Nova peça</button>
      </div>

      {isLoading && <div className="loading-center"><Loading size="md" /></div>}
      {isError && <div className="error-banner">Não foi possível carregar as peças.</div>}

      {!isLoading && !isError && (
        <>
          {pecas.length === 0 ? (
            <div className="empty-state">
              {busca ? "Nenhuma peça encontrada." : "Nenhuma peça cadastrada ainda."}
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Qtd. estoque</th>
                    <th>Est. mínimo</th>
                    <th>Preço unit.</th>
                    <th>Fornecedor</th>
                    <th>Situação</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pecas.map((p) => (
                    // Linha com destaque visual quando estoque está baixo
                    <tr key={p.id} className={p.estoqueBaixo ? "tr-estoque-baixo" : ""}>
                      <td className="td-bold">{p.nome}</td>
                      <td className="td-mono td-center">{p.quantidade}</td>
                      <td className="td-mono td-center">{p.estoqueMinimo}</td>
                      <td className="td-mono">R$ {Number(p.precoUnitario).toFixed(2)}</td>
                      <td>{p.fornecedor || "—"}</td>
                      <td>
                        {/* O backend já calcula e envia o campo estoqueBaixo */}
                        {p.estoqueBaixo ? (
                          <span className="badge-status badge-alerta">⚠ Estoque baixo</span>
                        ) : (
                          <span className="badge-status badge-ok">OK</span>
                        )}
                      </td>
                      <td className="td-actions">
                        <button className="btn-icon btn-edit" onClick={() => abrirEditar(p)} title="Editar">✏️</button>
                        <button className="btn-icon btn-delete" onClick={() => setConfirmandoExclusao(p)} title="Excluir">🗑️</button>
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

      <Modal open={modalAberto} onClose={fecharModal} title={pecaEditando ? "Editar peça" : "Nova peça"}>
        <form className="form" onSubmit={handleSubmit}>
          {erroForm && <div className="form-error">{erroForm}</div>}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome *</label>
              <input className="form-input" name="nome" value={form.nome} onChange={handleChange} placeholder="Filtro de óleo" required />
            </div>
            <div className="form-group">
              <label className="form-label">Fornecedor</label>
              <input className="form-input" name="fornecedor" value={form.fornecedor} onChange={handleChange} placeholder="Bosch, Mann..." />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quantidade em estoque</label>
              <input className="form-input" type="number" min="0" name="quantidade" value={form.quantidade} onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
              <label className="form-label">Estoque mínimo</label>
              <input className="form-input" type="number" min="0" name="estoqueMinimo" value={form.estoqueMinimo} onChange={handleChange} placeholder="2" />
            </div>
            <div className="form-group">
              <label className="form-label">Preço unitário (R$)</label>
              <input className="form-input" type="number" step="0.01" min="0" name="precoUnitario" value={form.precoUnitario} onChange={handleChange} placeholder="49.90" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Descrição</label>
              <textarea className="form-input form-textarea" name="descricao" value={form.descricao} onChange={handleChange} placeholder="Detalhes da peça..." rows={2} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={fecharModal}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={salvando}>
              {salvando ? "Salvando..." : pecaEditando ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!confirmandoExclusao} onClose={() => setConfirmandoExclusao(null)} title="Excluir peça" size="sm">
        <p className="confirm-text">
          Excluir a peça <strong>{confirmandoExclusao?.nome}</strong>?
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