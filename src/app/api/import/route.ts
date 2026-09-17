import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { filename, data } = body

    if (!data || !Array.isArray(data)) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    // Identifica se é Mahay pelo nome do arquivo
    const isMahay = filename?.toLowerCase().includes('mahay')
    
    // 1. Obter ou criar a Categoria Padrão
    let defaultCategory = await prisma.productCategory.findFirst({
      where: { name: 'Geral' }
    })
    
    if (!defaultCategory) {
      defaultCategory = await prisma.productCategory.create({
        data: { name: 'Geral', description: 'Categoria padrão de importação' }
      })
    }

    // 2. Obter ou criar Armazém e Localização
    const warehouseCode = isMahay ? 'MAHAY' : 'ALM-01'
    const warehouseName = isMahay ? 'Almoxarifado Mahay' : 'Almoxarifado Principal'
    
    let warehouse = await prisma.warehouse.findUnique({
      where: { code: warehouseCode }
    })
    
    if (!warehouse) {
      warehouse = await prisma.warehouse.create({
        data: { code: warehouseCode, name: warehouseName }
      })
    }
    
    let location = await prisma.warehouseLocation.findFirst({
      where: { warehouseId: warehouse.id, code: 'GERAL' }
    })
    
    if (!location) {
      location = await prisma.warehouseLocation.create({
        data: { 
          warehouseId: warehouse.id, 
          code: 'GERAL', 
          name: 'Geral' 
        }
      })
    }

    // 3. Obter um usuário para ser o responsável pelas movimentações
    let adminUser = await prisma.user.findFirst({
      where: { email: 'admin@estoka.com' }
    })
    
    if (!adminUser) {
       adminUser = await prisma.user.findFirst()
    }
    
    if (!adminUser) {
      return NextResponse.json({ error: 'Nenhum usuário no banco de dados.' }, { status: 500 })
    }

    let processedCount = 0

    // 4. Processar cada linha
    for (const row of data) {
      const code = String(row['Material'])
      const name = String(row['Especificação'])
      const unitCode = String(row['Unidade']).toUpperCase() || 'UN'
      const quantity = Number(row['Quantidade']) || 0
      const statedCost = Number(row['Pr. Unitário']) || 0
      const totalValue = Number(row['Valor']) || 0
      
      // Calculate exact averageCost to avoid rounding divergence from 'Pr. Unitário'
      const averageCost = (quantity > 0 && totalValue > 0) ? (totalValue / quantity) : statedCost
      const minimumStock = Number(row['Estq.Mínimo']) || 0

      if (!code || code === 'undefined' || !name || name === 'undefined') {
        continue // Pula linhas vazias
      }

      // 4.1 Unidade
      let unit = await prisma.productUnit.findUnique({
        where: { code: unitCode }
      })
      
      if (!unit) {
        unit = await prisma.productUnit.create({
          data: { code: unitCode, name: unitCode }
        })
      }

      // 4.2 Produto (Upsert)
      const product = await prisma.product.upsert({
        where: { code },
        update: {
          name,
          unitId: unit.id,
          minimumStock,
          averageCost,
        },
        create: {
          code,
          name,
          categoryId: defaultCategory.id,
          unitId: unit.id,
          minimumStock,
          averageCost,
          status: 'ACTIVE'
        }
      })

      // 4.3 Estoque e Movimentação
      // Busca saldo atual
      const currentStock = await prisma.stock.findUnique({
        where: {
          productId_locationId: {
            productId: product.id,
            locationId: location.id
          }
        }
      })

      const currentQty = currentStock?.quantity || 0
      const difference = quantity - currentQty

      if (difference !== 0) {
        // Atualiza/Cria saldo em estoque
        await prisma.stock.upsert({
          where: {
            productId_locationId: {
              productId: product.id,
              locationId: location.id
            }
          },
          update: {
            quantity
          },
          create: {
            productId: product.id,
            warehouseId: warehouse.id,
            locationId: location.id,
            quantity
          }
        })

        // Registra Movimentação de Ajuste
        await prisma.stockMovement.create({
          data: {
            productId: product.id,
            warehouseId: warehouse.id,
            locationId: location.id,
            type: difference > 0 ? 'ADJUSTMENT_IN' : 'ADJUSTMENT_OUT',
            quantity: Math.abs(difference),
            unitCost: averageCost,
            totalCost: averageCost * Math.abs(difference),
            referenceType: 'INVENTORY_ADJUSTMENT',
            reason: 'Importação de Planilha Excel',
            performedById: adminUser.id
          }
        })

      }

      processedCount++
    }
    
    try {
      revalidatePath('/products')
    } catch(e) {}

    return NextResponse.json({ success: true, processedCount })

  } catch (error: any) {
    console.error('Import error:', error)
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 })
  }
}
