"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/api"

const QUERY_KEY = "ordens"

export function useOrdens(params = {}) {
  const { busca = "", status = "", page = 0, size = 10 } = params

  return useQuery({
    queryKey: [QUERY_KEY, busca, status, page, size],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/ordens-servico", {
        params: {
          busca: busca || undefined,
          status: status || undefined,
          page,
          size,
        },
      })
      return data
    },
  })
}

export function useOrdem(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/ordens-servico/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateOrdem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/api/v1/ordens-servico", payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ["pecas"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}

export function useUpdateOrdem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await api.put(`/api/v1/ordens-servico/${id}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ["pecas"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}

export function useDeleteOrdem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/v1/ordens-servico/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ["pecas"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}