
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, YAxis, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '../store';

const Barchart = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';

  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/sales/lastsixmonth/saleprogress?username=${username}`);
        const salesData = await response.json();

        // Process data
        const processedData: any = [];
        const categorySet = new Set<string>();

        salesData.forEach((item: any) => {
          const monthName = item.monthname; // Month name from API
          const foundMonth = processedData.find((data: any) => data.name === monthName);

          if (foundMonth) {
            foundMonth[item.category] = item.totalSale;
          } else {
            processedData.push({
              name: monthName,
              [item.category]: item.totalSale,
            });
          }

          // Track unique category names
          categorySet.add(item.category);
        });

        setChartData(processedData);
        setCategories(Array.from(categorySet));

      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, [apiBaseUrl, username]);

  return (
    <div>
      <ResponsiveContainer width={1200} height={400}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} tickMargin={25} />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />

          {categories.map((category) => (
            <Bar key={category} dataKey={category} fill={getRandomColor()} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Utility function to generate random colors for different categories
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default Barchart;


