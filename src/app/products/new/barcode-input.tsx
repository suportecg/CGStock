"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Wand2 } from "lucide-react"
import { useState } from "react"

export function BarcodeInput({ defaultValue = "" }: { defaultValue?: string }) {
  const [barcode, setBarcode] = useState(defaultValue)

  const generateBarcode = () => {
    // Prefix 200 is often used for internal barcodes (EAN-13 restricted circulation)
    let code = "200"
    for (let i = 0; i < 9; i++) {
      code += Math.floor(Math.random() * 10).toString()
    }
    
    // Calculate EAN-13 checksum
    let sum = 0
    for (let i = 0; i < 12; i++) {
      sum += parseInt(code[i]) * (i % 2 === 0 ? 1 : 3)
    }
    const checkDigit = (10 - (sum % 10)) % 10
    code += checkDigit.toString()
    
    setBarcode(code)
  }

  return (
    <div className="flex gap-2">
      <Input 
        name="barcode" 
        placeholder="EAN-13, EAN-8..." 
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        className="flex-1"
      />
      <Button 
        type="button" 
        variant="outline" 
        onClick={generateBarcode}
        title="Gerar código internamente"
        className="shrink-0 flex items-center gap-2"
      >
        <Wand2 className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only">Gerar</span>
      </Button>
    </div>
  )
}
