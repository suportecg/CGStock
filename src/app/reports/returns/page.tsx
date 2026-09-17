import { requirePermissionPage } from "@/lib/permissions"
import { RotateCcw } from "lucide-react"
import { MovementsReportTemplate } from "../components/movements-report-template"

export default async function ReturnsReportPage(props: { searchParams: Promise<{ page?: string }> }) {
  await requirePermissionPage('REPORT_VIEW')

  const params = await props.searchParams
  const page = Number(params.page) || 1

  return (
    <MovementsReportTemplate
      page={page}
      title="Devoluções"
      description="Histórico de materiais retornados."
      icon={RotateCcw}
      typeFilter="RETURN"
      basePath="/reports/returns"
    />
  )
}
