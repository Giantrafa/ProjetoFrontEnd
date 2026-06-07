"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/api"

const QUERY_KEY = "servicos"

export function useServicos(params = {}) {
  const { busca = "", page = 0, size = 10 } = params

  return useQuery({
    queryKey: [QUERY_KEY, busca, page, size],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/servicos", {
        params: { busca: busca || undefined, page, size },
      })
      return data
    },
  })
}

export function useServicosAtivos() {
  return useQuery({
    queryKey: [QUERY_KEY, "ativos"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/servicos", {
        params: { size: 100 },
      })
      const todos = data.content || data
      return Array.isArray(todos) ? todos.filter((s) => s.ativo) : todos // vai filtrar pro front, só os serviços que forem ativos
    },
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreateServico() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/api/v1/servicos", payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

export function useUpdateServico() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await api.put(`/api/v1/servicos/${id}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

// Alterna ativo/inativo usando o endpoint dedicado PATCH /toggle-ativo
// Não precisa enviar o body completo — só o ID
export function useToggleServico() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.patch(`/api/v1/servicos/${id}/toggle-ativo`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

export function useDeleteServico() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/v1/servicos/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}