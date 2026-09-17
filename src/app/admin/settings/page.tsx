import { requirePermissionPage } from "@/lib/permissions"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, Settings2 } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"
import { updateSettingsAction } from "./actions"

export default async function SettingsPage() {
  await requirePermissionPage('CONFIG_MANAGE')

  const settings = await db.systemSetting.findMany()
  const getVal = (key: string) => settings.find(s => s.key === key)?.value || ""
  const getBool = (key: string) => getVal(key) === "true"

  return (
    <form action={updateSettingsAction} className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings2 className="h-6 w-6 text-indigo-600" />
            Configurações do Sistema
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie os parâmetros globais de funcionamento do CGStock.</p>
        </div>
        </div>
        <Button type="submit" className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Geral</CardTitle>
            <CardDescription>Configurações básicas da empresa.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Sistema</Label>
              <Input name="SYSTEM_NAME" defaultValue={getVal("SYSTEM_NAME") || "CGStock"} />
            </div>
            <div className="space-y-2">
              <Label>Nome da Empresa</Label>
              <Input name="COMPANY_NAME" defaultValue={getVal("COMPANY_NAME")} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Regras de Estoque</CardTitle>
            <CardDescription>Parâmetros de movimentações.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Permitir Estoque Negativo</Label>
                <p className="text-xs text-muted-foreground">Aceitar saídas sem saldo suficiente</p>
              </div>
              <Switch name="ALLOW_NEGATIVE_STOCK" value="true" defaultChecked={getBool("ALLOW_NEGATIVE_STOCK")} />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <Label>Exigir Localização</Label>
                <p className="text-xs text-muted-foreground">Tornar o campo de local obrigatório</p>
              </div>
              <Switch name="REQUIRE_LOCATION_ON_ENTRY" value="true" defaultChecked={getBool("REQUIRE_LOCATION_ON_ENTRY")} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Requisições e Aprovação</CardTitle>
            <CardDescription>Fluxo de saída de materiais.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Exigir Aprovação de Requisições</Label>
                <p className="text-xs text-muted-foreground">Requisições nascem pendentes</p>
              </div>
              <Switch name="REQUIRE_REQUEST_APPROVAL" value="true" defaultChecked={getBool("REQUIRE_REQUEST_APPROVAL")} />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <Label>Atendimento Parcial</Label>
                <p className="text-xs text-muted-foreground">Permitir entregar menos que o pedido</p>
              </div>
              <Switch name="ALLOW_PARTIAL_FULFILLMENT" value="true" defaultChecked={getBool("ALLOW_PARTIAL_FULFILLMENT")} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Coletor & Inventário</CardTitle>
            <CardDescription>Opções do modo PWA.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Exigir Conferência Cega</Label>
                <p className="text-xs text-muted-foreground">Ocultar sistema da tela do coletor</p>
              </div>
              <Switch name="INVENTORY_BLIND_COUNT" value="true" defaultChecked={getBool("INVENTORY_BLIND_COUNT")} />
            </div>
            <div className="space-y-2 pt-2">
              <Label>Quantidade Padrão ao Bipar</Label>
              <Input name="SCANNER_DEFAULT_QTY" type="number" defaultValue={getVal("SCANNER_DEFAULT_QTY") || "1"} />
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
