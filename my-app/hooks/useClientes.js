"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/api"

const QUERY_KEY = "clientes"

export function useClientes(params = {}) {
  const { busca = "", page = 0, size = 10 } = params

  return useQuery({
    queryKey: [QUERY_KEY, busca, page, size],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/clientes", {
        params: { busca: busca || undefined, page, size },
      })
      return data
    },
  })
}

export function useCliente(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/clientes/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateCliente() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/api/v1/clientes", payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

export function useUpdateCliente() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await api.put(`/api/v1/clientes/${id}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

export function useDeleteCliente() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/v1/clientes/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}