"use client"

import { useState } from "react"
import {useOrdens, useCreateOrdem, useUpdateOrdem, useDeleteOrdem,} from "@/hooks/useOrdens"
import { useClientes } from "@/hooks/useClientes"
import { useVeiculosDoCliente } from "@/hooks/useVeiculos"
import { useServicosAtivos } from "@/hooks/useServicos"
import { usePecasDisponiveis } from "@/hooks/usePecas"
import Modal from "@/components/Modal"
import Loading from "@/components/Loading"

const STATUS_CONFIG = {
  ABERTA: { label: "Aberta", cls: "badge-aberta" },
  EM_ANDAMENTO: { label: "Em andamento", cls: "badge-andamento" },
  CONCLUIDA: { label: "Concluída", cls: "badge-concluida" },
  CANCELADA: { label: "Cancelada", cls: "badge-cancelada" },
}

const TIPO_PRECO_OPTIONS = [
  { value: "PADRAO", label: "Padrão (sem desconto)" },
  { value: "DESCONTO_10", label: "Desconto 10%" },
  { value: "URGENCIA_20", label: "Urgência +20%" },
]

const FORM_VAZIO = {
  clienteId: "",
  veiculoId: "",
  servicoIds: [],
  pecaIds: [],
  descricaoProblema: "",
  observacoes: "",
  tipoCalculoPreco: "PADRAO",
  status: "ABERTA",
}

function SelectVeiculos({ clienteId, value, onChange }) {
  const { data: veiculos, isLoading } = useVeiculosDoCliente(clienteId)

  if (!clienteId) {
    return (
      <select className="form-input form-select" disabled>
        <option>Selecione um cliente primeiro...</option>
      </select>
    )
  }

  if (isLoading) {
    return <select className="form-input form-select" disabled><option>Carregando...</option></select>
  }

  return (
    <select
      className="form-input form-select"
      value={value}
      onChange={onChange}
      required
    >
      <option value="">Selecione o veículo...</option>
      {(veiculos || []).map((v) => (
        <option key={v.id} value={v.id}>
          {v.placa} — {v.modelo} {v.marca ? `(${v.marca})` : ""}
        </option>
      ))}
    </select>
  )
}

function MultiSelect({ items, selectedIds, onToggle, labelKey = "nome", emptyMsg = "Nenhum disponível" }) {
  if (!items || items.length === 0) {
    return <div className="multi-select-empty">{emptyMsg}</div>
  }

  return (
    <div className="multi-select">
      {items.map((item) => (
        <label key={item.id} className="multi-select-item">
          <input
            type="checkbox"
            checked={selectedIds.includes(item.id)}
            onChange={() => onToggle(item.id)}
          />
          <span>{item[labelKey]}</span>
          {item.precoBase !== undefined && (
            <span className="multi-select-price">R$ {Number(item.precoBase).toFixed(2)}</span>
          )}
          {item.precoUnitario !== undefined && (
            <span className="multi-select-price">R$ {Number(item.precoUnitario).toFixed(2)}</span>
          )}
          {item.quantidade !== undefined && (
            <span className="multi-select-stock">({item.quantidade} em estoque)</span>
          )}
        </label>
      ))}
    </div>
  )
}

export default function OrdensPage() {
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("")
  const [page, setPage] = useState(0)
  const [modalAberto, setModalAberto] = useState(false)
  const [ordemEditando, setOrdemEditando] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)
  const [erroForm, setErroForm] = useState("")
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(null)

  const { data, isLoading, isError } = useOrdens({ busca, status: filtroStatus, page })
  const { data: clientesData } = useClientes({ size: 200 })
  const { data: servicosAtivos } = useServicosAtivos()
  const { data: pecasDisponiveis } = usePecasDisponiveis()

  const criar = useCreateOrdem()
  const atualizar = useUpdateOrdem()
  const excluir = useDeleteOrdem()

  const ordens = data?.content || []
  const totalPaginas = data?.totalPages || 0
  const clientes = clientesData?.content || []

  function abrirCriar() {
    setOrdemEditando(null)
    setForm(FORM_VAZIO)
    setErroForm("")
    setModalAberto(true)
  }

  function abrirEditar(ordem) {
    setOrdemEditando(ordem)
    setForm({
      clienteId: ordem.clienteId?.toString() || "",
      veiculoId: ordem.veiculoId?.toString() || "",
      servicoIds: ordem.servicoIds || [],
      pecaIds: ordem.pecaIds || [],
      descricaoProblema: ordem.descricaoProblema || "",
      observacoes: ordem.observacoes || "",
      tipoCalculoPreco: ordem.tipoCalculoPreco || "PADRAO",
      status: ordem.status || "ABERTA",
    })
    setErroForm("")
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setOrdemEditando(null)
    setErroForm("")
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => {
      if (name === "clienteId") return { ...prev, clienteId: value, veiculoId: "" }
      return { ...prev, [name]: value }
    })
  }

  function toggleId(fieldName, id) {
    setForm((prev) => {
      const lista = prev[fieldName]
      if (lista.includes(id)) {
        return { ...prev, [fieldName]: lista.filter((x) => x !== id) }
      }
      return { ...prev, [fieldName]: [...lista, id] }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErroForm("")

    if (!form.clienteId) { setErroForm("Selecione um cliente."); return }
    if (!form.veiculoId) { setErroForm("Selecione um veículo."); return }

    const payload = {
      clienteId: parseInt(form.clienteId, 10),
      veiculoId: parseInt(form.veiculoId, 10),
      servicoIds: form.servicoIds,
      pecaIds: form.pecaIds,
      descricaoProblema: form.descricaoProblema.trim() || undefined,
      observacoes: form.observacoes.trim() || undefined,
      tipoCalculoPreco: form.tipoCalculoPreco,
      status: form.status,
    }

    try {
      if (ordemEditando) {
        await atualizar.mutateAsync({ id: ordemEditando.id, ...payload })
      } else {
        await criar.mutateAsync(payload)
      }
      fecharModal()
    } catch (err) {
      setErroForm(
        err?.response?.data?.mensagem ||
          err?.response?.data?.message ||
          "Erro ao salvar a ordem."
      )
    }
  }

  async function handleExcluir(id) {
    try {
      await excluir.mutateAsync(id)
      setConfirmandoExclusao(null)
    } catch (err) {
      alert(err?.response?.data?.mensagem || "Não foi possível excluir a ordem.")
    }
  }

  const salvando = criar.isPending || atualizar.isPending

  return (
    <div className="dashboard">
      <h1 className="page-title">Ordens de Serviço</h1>
      <p className="page-subtitle">Controle das ordens de serviço da oficina</p>

      <div className="page-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Buscar por cliente, placa ou problema..."
          value={busca}
          onChange={(e) => { setBusca(e.target.value); setPage(0) }}
        />
        {/*filtro por status */}
        <select
          className="form-input form-select toolbar-select"
          value={filtroStatus}
          onChange={(e) => { setFiltroStatus(e.target.value); setPage(0) }}
        >
          <option value="">Todos os status</option>
          {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
            <option key={val} value={val}>{cfg.label}</option>
          ))}
        </select>
        <button className="btn-primary" onClick={abrirCriar}>+ Nova ordem</button>
      </div>

      {isLoading && <div className="loading-center"><Loading size="md" /></div>}
      {isError && <div className="error-banner">Não foi possível carregar as ordens.</div>}

      {!isLoading && !isError && (
        <>
          {ordens.length === 0 ? (
            <div className="empty-state">
              {busca || filtroStatus ? "Nenhuma ordem encontrada para este filtro." : "Nenhuma ordem cadastrada ainda."}
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Cliente</th>
                    <th>Veículo</th>
                    <th>Problema</th>
                    <th>Valor Total</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ordens.map((o) => {
                    const cfg = STATUS_CONFIG[o.status] || { label: o.status, cls: "" }
                    return (
                      <tr key={o.id}>
                        <td className="td-mono td-muted">#{o.id}</td>
                        <td className="td-bold">{o.clienteNome}</td>
                        <td className="td-mono">{o.veiculoResumo}</td>
                        <td className="td-truncate">{o.descricaoProblema || "—"}</td>
                        <td className="td-mono">R$ {Number(o.valorTotal).toFixed(2)}</td>
                        <td>
                          <span className={`badge-status ${cfg.cls}`}>{cfg.label}</span>
                        </td>
                        <td className="td-actions">
                          <button className="btn-icon btn-edit" onClick={() => abrirEditar(o)} title="Editar">✏️</button>
                          <button className="btn-icon btn-delete" onClick={() => setConfirmandoExclusao(o)} title="Excluir">🗑️</button>
                        </td>
                      </tr>
                    )
                  })}
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

      {/* modal de criar/editar - em cascata */}
      <Modal open={modalAberto} onClose={fecharModal} title={ordemEditando ? "Editar ordem" : "Nova ordem de serviço"} size="lg">
        <form className="form" onSubmit={handleSubmit}>
          {erroForm && <div className="form-error">{erroForm}</div>}

          {/*  cliente */}
          <div className="form-section-label">1. Cliente e veículo</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Cliente *</label>
              <select className="form-input form-select" name="clienteId" value={form.clienteId} onChange={handleChange} required>
                <option value="">Selecione o cliente...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nomeCompleto}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              {/* veículo — carrega após selecionar cliente */}
              <label className="form-label">Veículo *</label>
              <SelectVeiculos
                clienteId={form.clienteId}
                value={form.veiculoId}
                onChange={(e) => setForm((prev) => ({ ...prev, veiculoId: e.target.value }))}
              />
            </div>
          </div>

          {/* descrição do problema */}
          <div className="form-section-label">2. Problema e observações</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Descrição do problema</label>
              <textarea className="form-input form-textarea" name="descricaoProblema" value={form.descricaoProblema} onChange={handleChange} placeholder="Descreva o problema do veículo..." rows={2} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Observações internas</label>
              <textarea className="form-input form-textarea" name="observacoes" value={form.observacoes} onChange={handleChange} placeholder="Anotações para a equipe..." rows={2} />
            </div>
          </div>

          {/* serviços */}
          <div className="form-section-label">3. Serviços a realizar</div>
          <MultiSelect
            items={servicosAtivos || []}
            selectedIds={form.servicoIds}
            onToggle={(id) => toggleId("servicoIds", id)}
            emptyMsg="Nenhum serviço ativo cadastrado."
          />

          {/* peças */}
          <div className="form-section-label">4. Peças utilizadas</div>
          <MultiSelect
            items={pecasDisponiveis || []}
            selectedIds={form.pecaIds}
            onToggle={(id) => toggleId("pecaIds", id)}
            labelKey="nome"
            emptyMsg="Nenhuma peça disponível em estoque."
          />

          {/*tipo de preço e status */}
          <div className="form-section-label">5. Precificação e status</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tipo de cálculo de preço</label>
              <select className="form-input form-select" name="tipoCalculoPreco" value={form.tipoCalculoPreco} onChange={handleChange}>
                {TIPO_PRECO_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status da ordem</label>
              <select className="form-input form-select" name="status" value={form.status} onChange={handleChange}>
                {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                  <option key={val} value={val}>{cfg.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={fecharModal}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={salvando}>
              {salvando ? "Salvando..." : ordemEditando ? "Salvar" : "Criar ordem"}
            </button>
          </div>
        </form>
      </Modal>

      {/* modal de confirmação de exclusão */}
      <Modal open={!!confirmandoExclusao} onClose={() => setConfirmandoExclusao(null)} title="Excluir ordem" size="sm">
        <p className="confirm-text">
          Excluir a ordem <strong>#{confirmandoExclusao?.id}</strong> de{" "}
          <strong>{confirmandoExclusao?.clienteNome}</strong>?
          <br />
          <span className="confirm-warning">
            O estoque das peças utilizadas será restaurado automaticamente.
          </span>
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