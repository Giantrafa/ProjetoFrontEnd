"use client"

import { useState } from "react"
import { useOrdens, useCreateOrdem, useUpdateOrdem, useDeleteOrdem } from "@/hooks/useOrdens"
import { useClientes } from "@/hooks/useClientes"
import { useVeiculosDoCliente } from "@/hooks/useVeiculos"
import { useServicosAtivos } from "@/hooks/useServicos"
import { usePecasDisponiveis } from "@/hooks/usePecas"
import Modal from "@/components/Modal"
import Loading from "@/components/Loading"

const STATUS = {
  ABERTA: { label: "Aberta", cls: "badge-aberta"    },
  EM_ANDAMENTO: { label: "Em andamento", cls: "badge-andamento" },
  CONCLUIDA: { label: "Concluída", cls: "badge-concluida" },
  CANCELADA: { label: "Cancelada", cls: "badge-cancelada" },
}

const TIPOS_PRECO = [
  { value: "PADRAO", label: "Padrão (sem desconto)" },
  { value: "DESCONTO_10", label: "Desconto 10%" },
  { value: "URGENCIA_20", label: "Urgência +20%" },
]

const VAZIO = { clienteId: "", 
    veiculoId: "", 
    servicoIds: [], 
    pecaIds: [],
    descricaoProblema: "", 
    observacoes: "", 
    tipoCalculoPreco: "PADRAO", 
    status: "ABERTA" 
}

function SelectVeiculos({ clienteId, value, onChange }) {
  const idNumerico = clienteId ? parseInt(clienteId, 10) : null
  const { data, isLoading, isError } = useVeiculosDoCliente(idNumerico)

  if (!idNumerico) return (
    <select className="form-input form-select" disabled>
      <option>Selecione um cliente primeiro...</option>
    </select>
  )

  if (isLoading) return (
    <select className="form-input form-select" disabled>
      <option>Carregando veículos...</option>
    </select>
  )

  if (isError) return (
    <select className="form-input form-select" disabled>
      <option>Erro ao carregar veículos</option>
    </select>
  )

  const veiculos = Array.isArray(data) ? data : []

  if (veiculos.length === 0) return (
    <select className="form-input form-select" disabled>
      <option>Este cliente não tem veículos cadastrados</option>
    </select>
  )

  return (
    <select className="form-input form-select" value={value} onChange={onChange} required>
      <option value="">Selecione o veículo...</option>
      {veiculos.map(v => (
        <option key={v.id} value={v.id}>
          {v.placa} — {v.modelo}{v.marca ? ` (${v.marca})` : ""}
        </option>
      ))}
    </select>
  )
}

function MultiSelect({ items, selectedIds, onToggle, priceKey, stockKey }) {
  if (!items?.length) return <div className="multi-select-empty">Nenhum item disponível.</div>
  return (
    <div className="multi-select">
      {items.map(item => (
        <label key={item.id} className="multi-select-item">
          <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => onToggle(item.id)} />
          <span style={{ flex: 1 }}>{item.nome}</span>
          {priceKey && <span className="multi-select-price">R$ {Number(item[priceKey]).toFixed(2)}</span>}
          {stockKey && <span className="multi-select-stock">({item[stockKey]} un.)</span>}
        </label>
      ))}
    </div>
  )
}

export default function OrdensPage() {
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltro] = useState("")
  const [page, setPage] = useState(0)
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(VAZIO)
  const [erro, setErro] = useState("")
  const [excluindo, setExcluindo] = useState(null)

  const { data, isLoading, isError } = useOrdens({ busca, status: filtroStatus, page })
  const { data: cData } = useClientes({ size: 200 })
  const { data: servicosAtivos } = useServicosAtivos()
  const { data: pecasDisponiveis } = usePecasDisponiveis()
  const criar = useCreateOrdem()
  const atualizar = useUpdateOrdem()
  const excluir = useDeleteOrdem()

  const ordens = data?.content || []
  const total = data?.totalPages || 0
  const clientes = cData?.content || []

  function abrirCriar() { setEditando(null); setForm(VAZIO); setErro(""); setModal(true) }
  function abrirEditar(o) {
    setEditando(o)
    setForm({ clienteId: o.clienteId?.toString() || "", veiculoId: o.veiculoId?.toString() || "",
              servicoIds: o.servicoIds || [], pecaIds: o.pecaIds || [],
              descricaoProblema: o.descricaoProblema || "", observacoes: o.observacoes || "",
              tipoCalculoPreco: o.tipoCalculoPreco || "PADRAO", status: o.status || "ABERTA" })
    setErro(""); setModal(true)
  }
  function fechar() { setModal(false); setEditando(null); setErro("") }
  function ch(e) {
    const { name, value } = e.target
    setForm(p => name === "clienteId" ? { ...p, clienteId: value, veiculoId: "" } : { ...p, [name]: value })
  }
  function toggleId(field, id) {
    setForm(p => ({
      ...p, [field]: p[field].includes(id) ? p[field].filter(x => x !== id) : [...p[field], id]
    }))
  }

  async function submit(e) {
    e.preventDefault(); setErro("")
    if (!form.clienteId) { setErro("Selecione um cliente."); return }
    if (!form.veiculoId) { setErro("Selecione um veículo."); return }
    const payload = {
      clienteId: parseInt(form.clienteId, 10), veiculoId: parseInt(form.veiculoId, 10),
      servicoIds: form.servicoIds, pecaIds: form.pecaIds,
      descricaoProblema: form.descricaoProblema.trim() || undefined,
      observacoes: form.observacoes.trim() || undefined,
      tipoCalculoPreco: form.tipoCalculoPreco, status: form.status,
    }
    try {
      editando
        ? await atualizar.mutateAsync({ id: editando.id, ...payload })
        : await criar.mutateAsync(payload)
      fechar()
    } catch (err) { setErro(err?.response?.data?.mensagem || "Erro ao salvar.") }
  }

  const salvando = criar.isPending || atualizar.isPending

  return (
    <div className="dashboard">
      <h1 className="page-title">Ordens de Serviço</h1>
      <p className="page-subtitle">Controle das ordens de serviço da oficina</p>

      <div className="page-toolbar">
        <input className="search-input" type="text" placeholder="Buscar por cliente, placa ou problema..."
               value={busca} onChange={(e) => { setBusca(e.target.value); setPage(0) }} />
        <select className="toolbar-select" value={filtroStatus}
                onChange={(e) => { setFiltro(e.target.value); setPage(0) }}>
          <option value="">Todos os status</option>
          {Object.entries(STATUS).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
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
                    <th>#</th><th>Cliente</th><th>Veículo</th><th>Problema</th><th>Valor</th><th>Status</th><th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ordens.map((o) => {
                    const s = STATUS[o.status] || { label: o.status, cls: "" }
                    return (
                      <tr key={o.id}>
                        <td className="td-mono td-muted">#{o.id}</td>
                        <td className="td-bold">{o.clienteNome}</td>
                        <td className="td-mono">{o.veiculoResumo}</td>
                        <td className="td-truncate">{o.descricaoProblema || "—"}</td>
                        <td className="td-mono">R$ {Number(o.valorTotal).toFixed(2)}</td>
                        <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                        <td>
                          <div className="td-actions">
                            <button className="btn-icon" onClick={() => abrirEditar(o)} title="Editar">✏️</button>
                            <button className="btn-icon" onClick={() => setExcluindo(o)} title="Excluir">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
          {total > 1 && (
            <div className="pagination">
              <button className="btn-page" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Anterior</button>
              <span className="page-info">Página {page + 1} de {total}</span>
              <button className="btn-page" disabled={page + 1 >= total} onClick={() => setPage(p => p + 1)}>Próxima →</button>
            </div>
          )}
        </>
      )}

      <Modal open={modal} onClose={fechar} title={editando ? "Editar ordem" : "Nova ordem de serviço"} size="lg">
        <form className="form" onSubmit={submit}>
          {erro && <div className="form-error">{erro}</div>}

          <p className="form-section-label">1. Cliente e veículo</p>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Cliente *</label>
              <select className="form-input form-select" name="clienteId" value={form.clienteId} onChange={ch} required>
                <option value="">Selecione o cliente...</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nomeCompleto}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Veículo *</label>
              <SelectVeiculos clienteId={form.clienteId} value={form.veiculoId}
                              onChange={(e) => setForm(p => ({ ...p, veiculoId: e.target.value }))} />
            </div>
          </div>

          <p className="form-section-label">2. Problema e observações</p>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Descrição do problema</label>
              <textarea className="form-input form-textarea" name="descricaoProblema" value={form.descricaoProblema} onChange={ch} placeholder="Descreva o problema do veículo..." rows={2} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Observações internas</label>
              <textarea className="form-input form-textarea" name="observacoes" value={form.observacoes} onChange={ch} placeholder="Anotações para a equipe..." rows={2} />
            </div>
          </div>

          <p className="form-section-label">3. Serviços a realizar</p>
          <MultiSelect items={servicosAtivos} selectedIds={form.servicoIds}
                       onToggle={(id) => toggleId("servicoIds", id)} priceKey="precoBase" />

          <p className="form-section-label">4. Peças utilizadas</p>
          <MultiSelect items={pecasDisponiveis} selectedIds={form.pecaIds}
                       onToggle={(id) => toggleId("pecaIds", id)} priceKey="precoUnitario" stockKey="quantidade" />

          <p className="form-section-label">5. Precificação e status</p>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tipo de cálculo</label>
              <select className="form-input form-select" name="tipoCalculoPreco" value={form.tipoCalculoPreco} onChange={ch}>
                {TIPOS_PRECO.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input form-select" name="status" value={form.status} onChange={ch}>
                {Object.entries(STATUS).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={fechar}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={salvando}>
              {salvando ? "Salvando..." : editando ? "Salvar" : "Criar ordem"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!excluindo} onClose={() => setExcluindo(null)} title="Excluir ordem" size="sm">
        <p className="confirm-text">Excluir a ordem <strong>#{excluindo?.id}</strong> de <strong>{excluindo?.clienteNome}</strong>?</p>
        <p className="confirm-warning">O estoque das peças será restaurado automaticamente.</p>
        <div className="form-actions">
          <button className="btn-secondary" onClick={() => setExcluindo(null)}>Cancelar</button>
          <button className="btn-danger" onClick={async () => { try { await excluir.mutateAsync(excluindo.id); setExcluindo(null) } catch (err) { alert(err?.response?.data?.mensagem || "Não foi possível excluir.") } }} disabled={excluir.isPending}>
            {excluir.isPending ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </Modal>
    </div>
  )
}