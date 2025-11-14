import React from 'react'

interface AuthPageProps {
  children: React.ReactNode
}

export const AuthPage: React.FC<AuthPageProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">{children}</div>
  )
}