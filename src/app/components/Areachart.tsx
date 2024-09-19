"use client"

import React from 'react'
import { AreaChart, Area, YAxis, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

  const data = [
    {
      "name": "Pizza",
      "total": 40000,
       },
    {
      "name": "Burger",
      "total": 60000,
      
    },
    {
      "name": "Cake",
      "total": 50000,
      
    },
    {
      "name": "Sweets",
      "total": 70000,
     
    },
    {
      "name": "Biscuits",
      "total": 50000,
      
    },
   
  ]
const Areachart = () => {
  return (
    <ResponsiveContainer width={600} height={240}>
    <AreaChart data={data}
  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
  <defs>
    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
    </linearGradient>
    
  </defs>
  <XAxis dataKey="name" tickMargin={10} />
  <YAxis />
  
  <CartesianGrid strokeDasharray="3 3" />
  <Tooltip />
  <Area type="monotone" dataKey="total" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
   
</AreaChart>
</ResponsiveContainer>
  )
}

export default Areachart