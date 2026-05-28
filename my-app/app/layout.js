import { Geist, Geist_Mono } from "next/font/google"
import QueryProvider from "@/components/QueryProvider"
import "../styles/global.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "AutoShop Pro",
  description: "Sistema de gerenciamento para oficinas mecânicas",
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
