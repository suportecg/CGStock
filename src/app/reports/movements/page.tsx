import { requirePermissionPage } from "@/lib/permissions"
import { ArrowRightLeft } from "lucide-react"
import { MovementsReportTemplate } from "../components/movements-report-template"

export default async function MovementsReportPage(props: { searchParams: Promise<{ page?: string }> }) {
  await requirePermissionPage('REPORT_VIEW')

  const params = await props.searchParams
  const page = Number(params.page) || 1

  return (
    <MovementsReportTemplate
      page={page}
      title="Extrato de Movimentações"
      description="Histórico completo de transações em ordem cronológica."
      icon={ArrowRightLeft}
      basePath="/reports/movements"
    />
  )
}
