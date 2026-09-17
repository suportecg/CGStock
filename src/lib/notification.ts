import { db } from "./db"

export async function sendNotification(userId: string, title: string, message: string, type: string) {
  try {
    await db.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      }
    })
  } catch (error) {
    console.error("Failed to send notification:", error)
  }
}

export async function getUnreadNotifications(userId: string) {
  try {
    return await db.notification.findMany({
      where: { userId, readAt: null },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  } catch {
    return []
  }
}
