import { localDb } from "./localdb"

export async function queueOfflineOperation(operation: string, payload: any) {
  if (!localDb) throw new Error("IndexedDB not available")
  
  await localDb.syncQueue.add({
    operation: operation as any,
    entityId: crypto.randomUUID(),
    payload,
    status: 'PENDING',
    attempts: 0,
    createdAt: new Date()
  })
}
