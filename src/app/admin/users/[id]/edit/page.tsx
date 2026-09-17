import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { BackButton } from "@/components/ui/back-button"
import { EditUserForm } from "./edit-user-form"

export default async function EditUserPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await db.user.findUnique({
    where: { id: params.id },
    include: { 
      roles: true,
      worksiteAccesses: true
    }
  })

  if (!user) {
    redirect("/admin/users")
  }
  
  const roles = await db.role.findMany({
    orderBy: { name: 'asc' }
  })
  
  const worksites = await db.worksite.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <BackButton />
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Editar Usuário</h2>
          <p className="text-muted-foreground">{user.name}</p>
        </div>
      </div>

      <Card className="rounded-2xl border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Dados do Usuário</CardTitle>
          <CardDescription>
            Edite as informações do usuário, perfis e acesso a obras.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditUserForm user={user} roles={roles} worksites={worksites} />
        </CardContent>
      </Card>
    </div>
  )
}
