"use client"

import Areachart from "@/app/components/Areachart";
import Barchart from "@/app/components/Barchart";
import HomeSummary from "@/app/components/HomeSummary";
import Linechart from "@/app/components/Linechart";

export default function Page() {
  
    return (
    <main>
      <div className="container mx-auto">
        <div className="flex">
          <HomeSummary/>
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
