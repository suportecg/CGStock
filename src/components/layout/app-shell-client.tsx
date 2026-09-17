"use client"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"
import { usePathname } from "next/navigation"

export function AppShellClient({ 
  children, 
  user 
}: { 
  children: React.ReactNode,
  user: any
}) {
  const pathname = usePathname()

  if (pathname === '/login') {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted font-sans">
      <div className="hidden lg:block">
        <Sidebar user={user} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
