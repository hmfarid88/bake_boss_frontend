import React from 'react'
import { BarChart, Bar, YAxis, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
const data = [
    {
      "name": "January",
      "Mobile": 4000,
      "Accessories": 2400
    },
    {
      "name": "February",
      "Mobile": 3000,
      "Accessories": 1398
    },
    {
      "name": "March",
      "Mobile": 2000,
      "Accessories": 9800
    },
    {
      "name": "April",
      "Mobile": 2780,
      "Accessories": 3908
    },
    {
      "name": "May",
      "Mobile": 1890,
      "Accessories": 4800
    },
    {
      "name": "June",
      "Mobile": 2390,
      "Accessories": 3800
    }
   
  ]
const Barchart = () => {
    return (
        <div>
          <ResponsiveContainer width={600} height={250}>
            <BarChart  data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickMargin={10} />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign='top' height={36} />
                <Bar dataKey="Mobile" fill="#8884d8" />
                <Bar dataKey="Accessories" fill="#82ca9d" />
            </BarChart>
            </ResponsiveContainer>
        </div>

    )
}

export default Barchart;

