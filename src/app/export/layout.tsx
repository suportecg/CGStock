import { requirePermissionPage } from "@/lib/permissions"

export default async function ExportLayout({ children }: { children: React.ReactNode }) {
  await requirePermissionPage('REPORT_EXPORT')
  return children
}
