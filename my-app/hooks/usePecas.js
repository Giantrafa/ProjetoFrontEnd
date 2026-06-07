"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/api"

const QUERY_KEY = "pecas"

export function usePecas(params = {}) {
  const { busca = "", page = 0, size = 10 } = params

  return useQuery({
    queryKey: [QUERY_KEY, busca, page, size],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/pecas", {
        params: { busca: busca || undefined, page, size },
      })
      return data
    },
  })
}

export function usePecasDisponiveis() {
  return useQuery({
    queryKey: [QUERY_KEY, "disponiveis"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/pecas", {
        params: { size: 200 },
      })
      const todas = data.content || data
      return Array.isArray(todas) ? todas.filter((p) => p.quantidade > 0) : todas
    },
    staleTime: 30 * 1000,
  })
}

export function useCreatePeca() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/api/v1/pecas", payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

export function useUpdatePeca() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await api.put(`/api/v1/pecas/${id}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

export function useDeletePeca() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/v1/pecas/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}