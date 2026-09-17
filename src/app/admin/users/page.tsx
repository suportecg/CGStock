import { db } from "@/lib/db"
import { UsersClient } from "./users-client"

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams
  const q = resolvedParams?.q || ''
  const users = await db.user.findMany({
    where: q ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { email: { contains: q, mode: 'insensitive' } }] } : undefined,
    include: {
      roles: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return <UsersClient users={users} />
}
