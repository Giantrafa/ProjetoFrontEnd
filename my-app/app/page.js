"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/zustand"
import Loading from "@/components/Loading"

export default function Home() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) {
      router.push(isAuthenticated ? "/dashboard" : "/login")
    }
  }, [hydrated, isAuthenticated, router])

  return <Loading fullscreen />
}
