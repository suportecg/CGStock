import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Iniciando Configuração de Permissões (RBAC) ---')

  const permissionsData = [
    { key: 'PRODUCT_VIEW', name: 'Visualizar Produtos', description: 'Ver catálogo de produtos' },
    { key: 'PRODUCT_CREATE', name: 'Criar Produtos', description: 'Adicionar novos produtos' },
    { key: 'PRODUCT_UPDATE', name: 'Atualizar Produtos', description: 'Editar informações de produtos' },
    
    { key: 'STOCK_VIEW', name: 'Visualizar Estoque', description: 'Ver saldo e locais' },
    { key: 'STOCK_ENTRY', name: 'Entrada de Estoque', description: 'Receber materiais e registrar entrada' },
    { key: 'STOCK_EXIT', name: 'Saída de Estoque', description: 'Registrar saída avulsa' },
    { key: 'STOCK_ADJUST', name: 'Ajuste de Estoque', description: 'Realizar ajustes de saldo' },
    { key: 'STOCK_TRANSFER', name: 'Transferência', description: 'Transferir entre locais' },
    
    { key: 'REQUEST_CREATE', name: 'Criar Requisição', description: 'Solicitar materiais' },
    { key: 'REQUEST_APPROVE', name: 'Aprovar Requisição', description: 'Analisar e aprovar requisições' },
    { key: 'REQUEST_FULFILL', name: 'Atender Requisição', description: 'Separar e entregar material' },
    
    { key: 'INVENTORY_CREATE', name: 'Criar Inventário', description: 'Iniciar ciclo de contagem' },
    { key: 'INVENTORY_COUNT', name: 'Contagem Física', description: 'Realizar contagem (via app/coletor)' },
    { key: 'INVENTORY_REVIEW', name: 'Revisar Divergências', description: 'Analisar sobras e faltas' },
    { key: 'INVENTORY_APPROVE', name: 'Aprovar Ajustes', description: 'Efetivar saldo do inventário no estoque' },
    
    { key: 'REPORT_VIEW', name: 'Visualizar Relatórios', description: 'Ver dashboards e relatórios' },
    { key: 'REPORT_EXPORT', name: 'Exportar Relatórios', description: 'Baixar dados (Excel/PDF)' },
    
    { key: 'USER_VIEW', name: 'Visualizar Usuários', description: 'Ver equipe' },
    { key: 'USER_MANAGE', name: 'Gerenciar Usuários', description: 'Criar e editar contas de usuário' },
    
    { key: 'CONFIG_MANAGE', name: 'Configurações', description: 'Ajustes gerais do sistema' },
    { key: 'AUDIT_VIEW', name: 'Visualizar Auditoria', description: 'Ver logs do sistema' },
  ]

  console.log('Limpando permissões antigas (padrao antigo)...')
  const validKeys = permissionsData.map(p => p.key)
  await prisma.permission.deleteMany({
    where: {
      key: { notIn: validKeys }
    }
  })

  console.log('Inserindo/Atualizando 21 permissões...')
  for (const p of permissionsData) {
    await prisma.permission.upsert({
      where: { key: p.key },
      update: { name: p.name, description: p.description },
      create: p,
    })
  }

  console.log('Mapeando permissões aos perfis...')
  const roles = await prisma.role.findMany()
  const dbPerms = await prisma.permission.findMany()

  const getPermIds = (keys: string[]) => {
    return keys.map(k => dbPerms.find(p => p.key === k)?.id).filter(Boolean) as string[]
  }

  const roleMappings: Record<string, string[]> = {
    'ADMIN': validKeys,
    'GESTOR': [
      'PRODUCT_VIEW', 'PRODUCT_CREATE', 'PRODUCT_UPDATE',
      'STOCK_VIEW', 'STOCK_ADJUST',
      'REQUEST_APPROVE',
      'INVENTORY_CREATE', 'INVENTORY_REVIEW', 'INVENTORY_APPROVE',
      'REPORT_VIEW', 'REPORT_EXPORT',
      'USER_VIEW', 'USER_MANAGE', 'CONFIG_MANAGE', 'AUDIT_VIEW'
    ],
    'ALMOXARIFE': [
      'PRODUCT_VIEW',
      'STOCK_VIEW', 'STOCK_ENTRY', 'STOCK_EXIT', 'STOCK_TRANSFER',
      'REQUEST_FULFILL',
      'INVENTORY_COUNT',
      'REPORT_VIEW'
    ],
    'CONFERENTE': [
      'PRODUCT_VIEW', 'STOCK_VIEW', 'INVENTORY_COUNT'
    ],
    'SOLICITANTE': [
      'PRODUCT_VIEW', 'REQUEST_CREATE'
    ]
  }

  for (const role of roles) {
    const keysToAssign = roleMappings[role.name] || []
    if (keysToAssign.length === 0) continue

    const permIds = getPermIds(keysToAssign)
    
    await prisma.rolePermission.deleteMany({
      where: { roleId: role.id }
    })

    const createData = permIds.map(permId => ({
      roleId: role.id,
      permissionId: permId
    }))

    if (createData.length > 0) {
      await prisma.rolePermission.createMany({
        data: createData
      })
    }
    console.log(`- Perfil ${role.name}: ${createData.length} permissões vinculadas.`)
  }

  console.log('--- Configuração RBAC concluída com sucesso! ---')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
