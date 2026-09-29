"use server"

import { db } from "@/lib/db"
import { getSession, createSession } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function changePasswordAction(prevState: unknown, formData: FormData) {
  const session = await getSession()
  if (!session) return { error: "Não autorizado." }

  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Por favor, preencha todos os campos." }
  }

  if (newPassword !== confirmPassword) {
    return { error: "As novas senhas não coincidem." }
  }

  if (newPassword.length < 6) {
    return { error: "A nova senha deve ter no mínimo 6 caracteres." }
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: { roles: true }
  })

  if (!user) {
    return { error: "Usuário não encontrado." }
  }

  const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash)
  if (!passwordMatch) {
    return { error: "Senha atual incorreta." }
  }

  const newHash = await bcrypt.hash(newPassword, 10)

  await db.user.update({
    where: { id: user.id },
    data: {
      passwordHash: newHash,
      mustChangePassword: false
    }
  })

  // Renew session to remove mustChangePassword flag
  await createSession(user.id, user.name, user.email, user.roles.map((r: any) => r.name), false)

  return { success: true }
}
