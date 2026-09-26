'use client';

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <Button onClick={() => window.print()} className="gap-2 bg-primary hover:bg-primary">
      <Printer className="h-4 w-4" />
      Imprimir Crachás
    </Button>
  );
}
