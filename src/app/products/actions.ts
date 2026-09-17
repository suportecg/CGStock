"use server"

import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

export async function createProductAction(formData: FormData) {
  const session = await getSession()
  if (!session) redirect("/login")

  let code = formData.get("code") as string
  const barcode = formData.get("barcode") as string || null
  const name = formData.get("name") as string
  const shortDescription = formData.get("shortDescription") as string || null
  const categoryId = formData.get("categoryId") as string
  const unitId = formData.get("unitId") as string
  const minimumStock = parseInt(formData.get("minimumStock") as string) || 0
  const maximumStock = parseInt(formData.get("maximumStock") as string) || 0
  const brand = formData.get("brand") as string || null
  const model = formData.get("model") as string || null
  const defaultLocationId = formData.get("defaultLocationId") as string || null

  if (!code && categoryId) {
    const category = await db.productCategory.findUnique({ where: { id: categoryId } })
    if (category) {
      const prefix = category.name
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z]/g, "")
        .substring(0, 3)
        .toUpperCase()
        .padEnd(3, 'X')
      
      const count = await db.product.count({ where: { categoryId } })
      
      let isUnique = false
      let attempts = count + 1
      while (!isUnique) {
        code = `${prefix}-${String(attempts).padStart(3, '0')}`
        const existingCode = await db.product.findUnique({ where: { code } })
        if (!existingCode) {
          isUnique = true
        } else {
          attempts++
        }
      }
    }
  }

  if (!code || !name || !categoryId || !unitId) {
    redirect("/products/new?error=missing_fields")
  }

  // Verifica duplicação de código
  const existing = await db.product.findUnique({ where: { code } })
  if (existing) {
    redirect("/products/new?error=duplicate_code")
  }

  try {
    await db.product.create({
      data: {
        code,
        barcode,
        name,
        shortDescription,
        categoryId,
        unitId,
        minimumStock,
        maximumStock,
        brand,
        model,
        defaultLocationId: defaultLocationId || null
      }
    })
  } catch (error) {
    console.error(error)
    redirect("/products/new?error=create_failed")
  }

  redirect("/products")
}

export async function updateProductAction(formData: FormData) {
  const session = await getSession()
  if (!session) redirect("/login")

  const id = formData.get("id") as string
  const code = formData.get("code") as string
  const barcode = formData.get("barcode") as string || null
  const name = formData.get("name") as string
  const shortDescription = formData.get("shortDescription") as string || null
  const categoryId = formData.get("categoryId") as string
  const unitId = formData.get("unitId") as string
  const minimumStock = parseInt(formData.get("minimumStock") as string) || 0
  const maximumStock = parseInt(formData.get("maximumStock") as string) || 0
  const brand = formData.get("brand") as string || null
  const model = formData.get("model") as string || null
  const defaultLocationId = formData.get("defaultLocationId") as string || null
  const status = formData.get("status") as any || "ACTIVE"

  if (!id || !code || !name || !categoryId || !unitId) {
    redirect(`/products/${id}/edit?error=missing_fields`)
  }

  // Verifica duplicação de código apenas se o código mudou
  const existing = await db.product.findUnique({ where: { code } })
  if (existing && existing.id !== id) {
    redirect(`/products/${id}/edit?error=duplicate_code`)
  }

  try {
    await db.product.update({
      where: { id },
      data: {
        code,
        barcode,
        name,
        shortDescription,
        categoryId,
        unitId,
        minimumStock,
        maximumStock,
        brand,
        model,
        defaultLocationId: defaultLocationId || null,
        status
      }
    })
  } catch (error) {
    console.error(error)
    redirect(`/products/${id}/edit?error=update_failed`)
  }

  redirect("/products")
}

export async function deleteProduct(id: string) {
  const session = await getSession()
  if (!session) throw new Error("Unauthorized")

  try {
    await db.product.delete({
      where: { id }
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    throw new Error("Failed to delete product")
  }
}

import { revalidatePath } from "next/cache"

export async function deleteAllProducts() {
  const session = await getSession()
  if (!session) throw new Error("Unauthorized")

  try {
    // Apaga os movimentos primeiro devido as restrições
    await db.stockMovement.deleteMany()
    await db.stock.deleteMany()
    await db.product.deleteMany()
    revalidatePath('/products')
  } catch (error) {
    console.error("Error deleting all products:", error)
    throw new Error("Failed to delete all products")
  }
}
