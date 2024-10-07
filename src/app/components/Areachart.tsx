"use client"
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, YAxis, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAppSelector } from '../store';

  const Areachart = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/sales/current-month/saleprogress?username=${username}`);
        const salesData = await response.json();
        setData(salesData.map((item: { productName: any; saleAmount: any; }) => ({
          name: item.productName, 
          total: item.saleAmount
        })));
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, [apiBaseUrl, username]);
  return (
    <ResponsiveContainer width={1200} height={300}>
    <AreaChart data={data}
  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
  <defs>
    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
    </linearGradient>
    
  </defs>
  <XAxis dataKey="name"  tickMargin={10} />
  <YAxis />
  
  <CartesianGrid strokeDasharray="3 3" />
  <Tooltip />
  <Area type="monotone" dataKey="total" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
   
</AreaChart>
</ResponsiveContainer>
  )
}

export default Areachart

