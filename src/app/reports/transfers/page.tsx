import { requirePermissionPage } from "@/lib/permissions"
import { ArrowRightLeft } from "lucide-react"
import { MovementsReportTemplate } from "../components/movements-report-template"

export default async function TransfersReportPage(props: { searchParams: Promise<{ page?: string }> }) {
  await requirePermissionPage('REPORT_VIEW')

  const params = await props.searchParams
  const page = Number(params.page) || 1

  return (
    <MovementsReportTemplate
      page={page}
      title="Transferências"
      description="Remanejos internos de mercadorias."
      icon={ArrowRightLeft}
      typeFilter={{ in: ['TRANSFER_IN', 'TRANSFER_OUT'] }}
      basePath="/reports/transfers"
    />
  )
}
