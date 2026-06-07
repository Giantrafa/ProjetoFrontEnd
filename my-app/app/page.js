"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/zustand"
import Loading from "@/components/Loading"
import AutoPrimeLanding from "@/components/AutoPrimeLanding"

export default function Home() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [hydrated, isAuthenticated, router])

  if (!hydrated) return <Loading fullscreen />

  return isAuthenticated ? <Loading fullscreen /> : <AutoPrimeLanding />
}
