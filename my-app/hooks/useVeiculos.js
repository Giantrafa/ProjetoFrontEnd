"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/api"

const QUERY_KEY = "veiculos"

export function useVeiculos(params = {}) {
  const { busca = "", clienteId = null, page = 0, size = 10 } = params

  return useQuery({
    queryKey: [QUERY_KEY, busca, clienteId, page, size],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/veiculos", {
        params: {
          busca: busca || undefined,
          clienteId: clienteId || undefined,
          page,
          size,
        },
      })
      return data
    },
  })
}

export function useVeiculosDoCliente(clienteId) {
  return useQuery({
    queryKey: ["veiculos-cliente", clienteId],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/clientes/${clienteId}/veiculos`)
      return data
    },
    enabled: !!clienteId, // só vai roda se clienteId for válido
  })
}

export function useCreateVeiculo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/api/v1/veiculos", payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ["veiculos-cliente"] })
    },
  })
}

export function useUpdateVeiculo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await api.put(`/api/v1/veiculos/${id}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ["veiculos-cliente"] })
    },
  })
}

export function useDeleteVeiculo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/v1/veiculos/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ["veiculos-cliente"] })
    },
  })
}