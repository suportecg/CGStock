import { getSession } from "@/lib/auth"
import { AppShellClient } from "./app-shell-client"

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return <AppShellClient user={session}>{children}</AppShellClient>
}
