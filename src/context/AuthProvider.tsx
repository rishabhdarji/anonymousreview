'use client'    
import { SessionProvider } from "next-auth/react"

export default function AuthProvider({
  children,
}: {children: React.ReactNode}){
  // This component wraps the application with the NextAuth SessionProvider 
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}