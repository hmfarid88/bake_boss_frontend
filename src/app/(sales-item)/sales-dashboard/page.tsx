"use client"

import Areachart from "@/app/components/Areachart";
import Barchart from "@/app/components/Barchart";
import Linechart from "@/app/components/Linechart";

export default function Page() {

  const dashboardData = [
    {
      id: 1,
      title: "Product Stock"
    },
    {
      id: 2,
      title: "Sales Today"
    },
    {
      id: 3,
      title: "Monthly Total"
    },
    {
      id: 4,
      title: "Cash Balance"
    },
    {
      id: 5,
      title: "Low Stock"
    }
   
  ]
  return (
    <main>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row  gap-5 p-4 items-center justify-center">
          {dashboardData?.map((item) =>
            <div key={item.id} className="card shadow-md shadow-slate-700 border border-accent text-center font-bold h-32 w-60 p-2">
              {item.title}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-5 p-10">
          <div className="flex flex-col items-center justify-center">
            <div className="p-5"><h4>This month sales progress</h4></div>
            <div>
              <Areachart />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="p-5"><h4>Last six month sales analysis</h4></div>
            <div><Barchart /></div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="p-5"><h4>Last 12 month profit-loss analysis</h4></div>
          <div><Linechart /></div>
        </div>
      </div>
    </main>
  );
}
