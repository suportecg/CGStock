"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { requirePermission } from "@/lib/permissions"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function updateSettingsAction(formData: FormData) {
  await requirePermission('CONFIG_MANAGE')
  
  const session = await getSession()
  if (!session) return

  const stringKeys = [
    "SYSTEM_NAME",
    "COMPANY_NAME",
    "SCANNER_DEFAULT_QTY"
  ]

  const booleanKeys = [
    "ALLOW_NEGATIVE_STOCK",
    "REQUIRE_LOCATION_ON_ENTRY",
    "REQUIRE_REQUEST_APPROVAL",
    "ALLOW_PARTIAL_FULFILLMENT",
    "INVENTORY_BLIND_COUNT"
  ]

  for (const key of stringKeys) {
    const val = formData.get(key) as string
    if (val !== null) {
      await db.systemSetting.upsert({
        where: { key },
        update: { value: val, updatedById: session.userId },
        create: { key, value: val, type: "STRING", updatedById: session.userId }
      })
    }
  }

  for (const key of booleanKeys) {
    const val = formData.get(key) ? "true" : "false"
    await db.systemSetting.upsert({
      where: { key },
      update: { value: val, updatedById: session.userId },
      create: { key, value: val, type: "BOOLEAN", updatedById: session.userId }
    })
  }

  revalidatePath("/admin/settings")
  revalidatePath("/")
  redirect("/admin/settings")
}
