"use server"

import { db } from "@/lib/db"
import { createSession } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function loginAction(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Por favor, preencha todos os campos." }
  }

  const user = await db.user.findUnique({
    where: { email },
    include: { roles: true }
  })

  if (!user) {
    return { error: "Credenciais inválidas." }
  }

  if (user.status !== "ACTIVE") {
    return { error: "Seu usuário está inativo." }
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash)

  if (!passwordMatch) {
    return { error: "Credenciais inválidas." }
  }

  await createSession(user.id, user.name, user.email, user.roles.map((r: any) => r.name))

  return { success: true }
}
