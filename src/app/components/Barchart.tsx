import React from 'react'
import { BarChart, Bar, YAxis, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
const data = [
    {
      "name": "January",
      "Bakery": 4000,
      "Sweets": 2400
    },
    {
      "name": "February",
      "Bakery": 3000,
      "Sweets": 1398
    },
    {
      "name": "March",
      "Bakery": 2000,
      "Sweets": 9800
    },
    {
      "name": "April",
      "Bakery": 2780,
      "Sweets": 3908
    },
    {
      "name": "May",
      "Bakery": 1890,
      "Sweets": 4800
    },
    {
      "name": "June",
      "Bakery": 2390,
      "Sweets": 3800
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
                <Bar dataKey="Bakery" fill="#8884d8" />
                <Bar dataKey="Sweets" fill="#82ca9d" />
            </BarChart>
            </ResponsiveContainer>
        </div>

    )
}

export default Barchart;

