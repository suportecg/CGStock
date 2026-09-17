import { encrypt } from "./src/lib/auth"
import http from "http"

async function main() {
  const cookieVal = await encrypt({
    userId: "4849c804-b3d7-49b5-a6d7-18f365a13e6b",
    name: "Administrador Sistema",
    email: "admin@estoka.com",
    roles: ["ADMIN"],
    expiresAt: new Date(Date.now() + 100000)
  })

  const res = await fetch("http://localhost:3000/admin/settings", {
    headers: {
      Cookie: `session=${cookieVal}`
    }
  })
  
  console.log("Status:", res.status)
  if (res.status !== 200) {
    const text = await res.text()
    console.log(text.substring(0, 500))
  } else {
    console.log("Page loaded successfully")
  }
}
main()
