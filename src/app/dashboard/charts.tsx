"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"

type ChartData = {
  name: string
  entradas: number
  saidas: number
}

export function DashboardCharts({ data }: { data: ChartData[] }) {
  if (data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground border border-dashed rounded-md">
        Dados insuficientes para gerar o gráfico.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
        <Legend iconType="circle" />
        <Bar dataKey="entradas" fill="#10b981" radius={[4, 4, 0, 0]} name="Entradas" />
        <Bar dataKey="saidas" fill="#ef4444" radius={[4, 4, 0, 0]} name="Saídas" />
      </BarChart>
    </ResponsiveContainer>
  )
}
