import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { AppShellClient } from "./app-shell-client"

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  let permissions: string[] = []

  if (session) {
    if (session.roles.includes("ADMIN")) {
      permissions = ["ADMIN"]
    } else {
      const user = await db.user.findUnique({
        where: { id: session.userId },
        include: {
          roles: { include: { permissions: { include: { permission: true } } } }
        }
      })
      if (user && user.status === "ACTIVE") {
        permissions = user.roles.flatMap((r: any) => r.permissions.map((rp: any) => rp.permission.key))
      }
    }
  }

  return <AppShellClient user={session ? { ...session, permissions } : null}>{children}</AppShellClient>
}
