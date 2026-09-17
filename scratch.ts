import { db } from "./src/lib/db"

async function run() {
  const invs = await db.inventory.findMany({ include: { locations: true } })
  console.log(invs)
}
run()
