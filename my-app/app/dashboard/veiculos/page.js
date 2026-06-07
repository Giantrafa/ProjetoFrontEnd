"use client"

import { useState } from "react"
import {useVeiculos, useCreateVeiculo, useUpdateVeiculo, useDeleteVeiculo,} from "@/hooks/useVeiculos"
import { useClientes } from "@/hooks/useClientes"
import Modal from "@/components/Modal"
import Loading from "@/components/Loading"

const FORM_VAZIO = {
  placa: "",
  marca: "",
  modelo: "",
  ano: "",
  historicoServicos: "",
  clienteId: "",
}

export default function VeiculosPage() {
  const [busca, setBusca] = useState("")
  const [page, setPage] = useState(0)
  const [modalAberto, setModalAberto] = useState(false)
  const [veiculoEditando, setVeiculoEditando] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)
  const [erroForm, setErroForm] = useState("")
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(null)

  const { data, isLoading, isError } = useVeiculos({ busca, page })
  const { data: clientesData } = useClientes({ size: 200 })

  const criar = useCreateVeiculo()
  const atualizar = useUpdateVeiculo()
  const excluir = useDeleteVeiculo()

  const veiculos = data?.content || []
  const totalPaginas = data?.totalPages || 0
  const clientes = clientesData?.content || []

  function abrirCriar() {
    setVeiculoEditando(null)
    setForm(FORM_VAZIO)
    setErroForm("")
    setModalAberto(true)
  }

  function abrirEditar(v) {
    setVeiculoEditando(v)
    setForm({
      placa: v.placa || "",
      marca: v.marca || "",
      modelo: v.modelo || "",
      ano: v.ano?.toString() || "",
      historicoServicos: v.historicoServicos || "",
      clienteId: v.clienteId?.toString() || "",
    })
    setErroForm("")
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setVeiculoEditando(null)
    setErroForm("")
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErroForm("")

    if (!form.placa.trim()) { setErroForm("Placa é obrigatória."); return }
    if (!form.modelo.trim()) { setErroForm("Modelo é obrigatório."); return }
    if (!form.clienteId) { setErroForm("Selecione um cliente."); return }

    const payload = {
      placa: form.placa.trim().toUpperCase(),
      marca: form.marca.trim() || undefined,
      modelo: form.modelo.trim(),
      ano: form.ano ? parseInt(form.ano, 10) : undefined,
      historicoServicos: form.historicoServicos.trim() || undefined,
      clienteId: parseInt(form.clienteId, 10),
    }

    try {
      if (veiculoEditando) {
        await atualizar.mutateAsync({ id: veiculoEditando.id, ...payload })
      } else {
        await criar.mutateAsync(payload)
      }
      fecharModal()
    } catch (err) {
      setErroForm(
        err?.response?.data?.mensagem ||
          err?.response?.data?.message ||
          "Erro ao salvar. Verifique os dados."
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
          "Não foi possível excluir. O veículo pode ter ordens associadas."
      )
    }
  }

  const salvando = criar.isPending || atualizar.isPending

  return (
    <div className="dashboard">
      <h1 className="page-title">Veículos</h1>
      <p className="page-subtitle">Gerencie os veículos da oficina</p>

      <div className="page-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Buscar por placa, modelo ou marca..."
          value={busca}
          onChange={(e) => { setBusca(e.target.value); setPage(0) }}
        />
        <button className="btn-primary" onClick={abrirCriar}>
          + Novo veículo
        </button>
      </div>

      {isLoading && <div className="loading-center"><Loading size="md" /></div>}
      {isError && <div className="error-banner">Não foi possível carregar os veículos.</div>}

      {!isLoading && !isError && (
        <>
          {veiculos.length === 0 ? (
            <div className="empty-state">
              {busca ? "Nenhum veículo encontrado." : "Nenhum veículo cadastrado ainda."}
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Placa</th>
                    <th>Modelo</th>
                    <th>Marca</th>
                    <th>Ano</th>
                    <th>Cliente</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {veiculos.map((v) => (
                    <tr key={v.id}>
                      <td className="td-mono td-bold">{v.placa}</td>
                      <td>{v.modelo}</td>
                      <td>{v.marca || "—"}</td>
                      <td>{v.ano || "—"}</td>
                      <td>{v.clienteNome}</td>
                      <td className="td-actions">
                        <button className="btn-icon btn-edit" onClick={() => abrirEditar(v)} title="Editar">✏️</button>
                        <button className="btn-icon btn-delete" onClick={() => setConfirmandoExclusao(v)} title="Excluir">🗑️</button>
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

      {/* modal criar/editar */}
      <Modal open={modalAberto} onClose={fecharModal} title={veiculoEditando ? "Editar veículo" : "Novo veículo"}>
        <form className="form" onSubmit={handleSubmit}>
          {erroForm && <div className="form-error">{erroForm}</div>}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Placa *</label>
              <input className="form-input form-input-upper" name="placa" value={form.placa} onChange={handleChange} placeholder="ABC-1234" required />
            </div>
            <div className="form-group">
              <label className="form-label">Ano</label>
              <input className="form-input" type="number" name="ano" value={form.ano} onChange={handleChange} placeholder="2020" min="1900" max={new Date().getFullYear() + 1} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Modelo *</label>
              <input className="form-input" name="modelo" value={form.modelo} onChange={handleChange} placeholder="Uno" required />
            </div>
            <div className="form-group">
              <label className="form-label">Marca</label>
              <input className="form-input" name="marca" value={form.marca} onChange={handleChange} placeholder="Fiat" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Cliente *</label>
              <select className="form-input form-select" name="clienteId" value={form.clienteId} onChange={handleChange} required>
                <option value="">Selecione um cliente...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nomeCompleto}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Histórico / observações</label>
              <textarea className="form-input form-textarea" name="historicoServicos" value={form.historicoServicos} onChange={handleChange} placeholder="Histórico de serviços anteriores..." rows={3} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={fecharModal}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={salvando}>
              {salvando ? "Salvando..." : veiculoEditando ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </Modal>

      {/* modal de confirmação de exclusão */}
      <Modal open={!!confirmandoExclusao} onClose={() => setConfirmandoExclusao(null)} title="Excluir veículo" size="sm">
        <p className="confirm-text">
          Excluir o veículo <strong>{confirmandoExclusao?.placa} — {confirmandoExclusao?.modelo}</strong>?
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