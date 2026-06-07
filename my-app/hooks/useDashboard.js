"use client"
 
import { useQuery } from "@tanstack/react-query"
import api from "@/api"

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/dashboard/resumo")
      return data
    },
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  })
}
 