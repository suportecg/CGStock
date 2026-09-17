# Estok - Sistema de Gestão de Estoque e Almoxarifado

**Estok** é um sistema completo e moderno de gestão de armazéns (WMS - Warehouse Management System) e controle de estoque, construído para oferecer controle granular sobre inventários, entradas, saídas e logística interna. 

---

## 🛠️ Stack Tecnológico

O sistema foi desenvolvido utilizando as tecnologias mais modernas do ecossistema JavaScript/TypeScript:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Turbopack)
- **Linguagem**: TypeScript
- **Banco de Dados & ORM**: PostgreSQL gerido via [Prisma](https://www.prisma.io/)
- **Estilização**: Tailwind CSS v4 + Radix UI (Componentes acessíveis)
- **Ícones e Gráficos**: Lucide React e Recharts
- **Autenticação**: Sessões customizadas com `jose` (JWT) e criptografia de senhas com `bcryptjs`
- **Leitura de Código de Barras/QR Code**: `html5-qrcode` e `qrcode.react`
- **PWA (Progressive Web App)**: Suporte a uso offline e instalação móvel através do `@ducanh2912/next-pwa`.

---

## 📦 Módulos do Sistema

O **Estok** é estruturado em múltiplos módulos interconectados, desenhados para rastrear todas as etapas da cadeia de suprimentos interna de uma organização.

### 1. 🔐 Autenticação e Autorização (Admin)
- **Usuários (`User`)**: Sistema de login seguro.
- **Controle de Acesso (RBAC)**: Gerenciamento flexível de Papéis (`Role`) e Permissões (`Permission`), garantindo que apenas usuários autorizados realizem certas operações.
- **Trilha de Auditoria (`AuditLog`)**: Registro de todas as ações importantes realizadas no sistema, permitindo rastreabilidade (quem fez, o que fez e quando).
- **Notificações**: Sistema integrado de alertas e notificações para os usuários.

### 2. 📋 Catálogo de Produtos
- **Produtos (`Product`)**: Cadastro completo contendo código, código de barras/QR, descrição, limites de estoque (mínimo e máximo) e localização padrão.
- **Categorias (`ProductCategory`)**: Agrupamento lógico de produtos.
- **Unidades de Medida (`ProductUnit`)**: Gerenciamento das unidades físicas (Caixa, Unidade, Kg, etc).

### 3. 🏢 Estrutura Física (Armazéns e Locais)
- **Almoxarifados (`Warehouse`)**: Múltiplos estoques e depósitos independentes.
- **Locais de Armazenamento (`WarehouseLocation`)**: Estrutura hierárquica (Corredor > Prateleira > Posição) para o mapeamento exato de onde cada item se encontra, o que acelera a separação e o inventário.

### 4. 📦 Controle de Estoque
- **Posição de Estoque (`Stock`)**: Rastreio em tempo real da quantidade de cada produto em locais específicos do armazém, bem como a "quantidade reservada" aguardando expedição.
- **Movimentações (`StockMovement`)**: Histórico imutável de qualquer alteração física no estoque (Entradas, Saídas, Ajustes e Transferências).

### 5. 📥 Recebimentos (Entradas)
- **Fornecedores (`Supplier`)**: Cadastro das empresas parceiras.
- **Notas de Recebimento (`StockReceipt`)**: Registro de recebimento de mercadorias. Os itens (`StockReceiptItem`) são conferidos, associados às suas respectivas notas fiscais e então alocados fisicamente nos locais do armazém.

### 6. 📤 Requisições de Material (Saídas)
- **Pedidos (`MaterialRequest`)**: Usuários ou departamentos podem solicitar materiais.
- **Fluxo de Aprovação**: Controle de status (Rascunho > Aguardando Aprovação > Aprovado > Em Separação > Atendido).
- **Separação**: O almoxarife separa e registra a quantidade entregue da requisição.

### 7. 🔄 Transferências e Devoluções
- **Transferências (`StockTransfer`)**: Movimentação rastreável de itens entre diferentes locais do mesmo almoxarifado ou entre almoxarifados distintos.
- **Devoluções (`MaterialReturn`)**: Registro de estorno e retorno de materiais não utilizados (com opção de classificar o estado do item: Bom, Danificado, etc).

### 8. 🔍 Inventário e Contagem (Balanço)
- O módulo de inventário mais robusto:
  - **Planejamento (`Inventory`)**: Criação de inventários totais, parciais ou cíclicos.
  - **Coleta de Dados (`InventoryCollection`)**: Permite aos operadores, muitas vezes usando dispositivos móveis e leitores de código de barras (via PWA/Collector), registrar as contagens físicas do que foi achado em cada local.
  - **Análise de Divergências (`InventoryDivergence`)**: O sistema compara automaticamente o estoque atual (sistema) com o valor contado, gerando relatórios de quebra ou sobra. Requer aprovação de superiores para ajustar o banco de dados.

---

## 🚀 Como o Fluxo Funciona na Prática?

1. **Configuração Inicial**: O administrador cadastra o Almoxarifado, cria a topologia das prateleiras (Locais), e insere os Produtos e Fornecedores.
2. **Entrada**: Uma mercadoria chega. É criado um *Recebimento (Stock Receipt)*, conferindo o que entrou versus a Nota Fiscal, convertendo isso num *Movimento de Estoque* de entrada e injetando na *Posição de Estoque*.
3. **Consumo**: Um funcionário cria uma *Requisição*. Após aprovação, o saldo do produto no armazém fica parcialmente "reservado" até que a expedição ocorra.
4. **Inventário Periódico**: Administradores abrem sessões de inventário; operadores com celulares vão até as prateleiras contar itens. As divergências vão para revisão, e o estoque é automaticamente ajustado com um log de auditoria.

---

## 💻 Comandos e Scripts Úteis

- Iniciar ambiente de desenvolvimento: `npm run dev`
- Realizar build de produção: `npm run build`
- Iniciar versão de produção: `npm run start`
- Sincronizar Prisma: `npx prisma generate` / `npx prisma db push`
- Alimentar banco inicial: `npm run prisma:seed` (configurado via tsx)

---

> *Este README serve como guia definitivo da arquitetura e das capacidades do sistema.*
