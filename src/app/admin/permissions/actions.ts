"use server"

import { db } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { requirePermission } from "@/lib/permissions"
import { revalidatePath } from "next/cache"

export async function togglePermission(roleId: string, permissionId: string, enable: boolean) {
  const session = await getSession()
  if (!session) throw new Error("Não autenticado")

  await requirePermission("CONFIG_MANAGE")

  const role = await db.role.findUnique({ where: { id: roleId } })
  if (!role) throw new Error("Perfil não encontrado")

  if (role.name === "ADMIN") {
    throw new Error("Não é possível alterar as permissões do perfil ADMIN, pois ele tem acesso total por padrão.")
  }

  if (enable) {
    await db.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId
        }
      },
      update: {},
      create: {
        roleId,
        permissionId
      }
    })
  } else {
    await db.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId
      }
    })
  }

  revalidatePath("/admin/permissions")
  return { success: true }
}
