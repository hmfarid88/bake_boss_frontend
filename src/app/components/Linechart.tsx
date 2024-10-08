
"use client"
import React, { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useAppSelector } from '../store';

const Linechart = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchProfitLossData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/sales/lasttwelvemonth/profitloss?username=${username}`);
        const profitLossData = await response.json();

        // Process data for recharts
        const processedData = profitLossData.map((item: any) => ({
          name: item.month,
          Profit: item.profit,
          Loss: item.loss
        }));

        setChartData(processedData);
      } catch (error) {
        console.error('Error fetching profit/loss data:', error);
      }
    };

    fetchProfitLossData();
  }, [apiBaseUrl, username]);

  return (
    <div>
      <ResponsiveContainer width={1200} height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 35, left: 10, bottom: 45 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} tickMargin={25} />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line type="monotone" dataKey="Profit" stroke="#82ca9d" />
          <Line type="monotone" dataKey="Loss" stroke="#ff0000" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Linechart;
