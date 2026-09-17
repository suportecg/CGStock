"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createWarehouseAction(formData: FormData) {
  const name = formData.get("name") as string
  const code = formData.get("code") as string
  const description = formData.get("description") as string
  const status = formData.get("status") as string

  await db.warehouse.create({
    data: { name, code, description, status }
  })
  
  revalidatePath("/admin/warehouses")
  redirect("/admin/warehouses")
}

export async function updateWarehouseAction(formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const code = formData.get("code") as string
  const description = formData.get("description") as string
  const status = formData.get("status") as string

  await db.warehouse.update({
    where: { id },
    data: { name, code, description, status }
  })

  revalidatePath("/admin/warehouses")
  revalidatePath(`/admin/warehouses/${id}`)
  redirect("/admin/warehouses")
}

export async function deleteWarehouseAction(formData: FormData) {
  const id = formData.get("id") as string
  await db.warehouse.delete({ where: { id } })
  revalidatePath("/admin/warehouses")
  redirect("/admin/warehouses")
}
