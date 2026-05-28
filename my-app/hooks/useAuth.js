"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import api from "@/api"
import { useAuthStore } from "@/zustand"

export function useLogin() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await api.post("/auth/login", { email, password })
      return data
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      router.push("/dashboard")
    },
  })
}

export function useRegister() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: async ({ name, email, password }) => {
      const { data } = await api.post("/auth/register", { name, email, password })
      return data
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      router.push("/dashboard")
    },
  })
}

export function useCurrentUser() {
  const token = useAuthStore((state) => state.token)

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me")
      return data
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  })
}
