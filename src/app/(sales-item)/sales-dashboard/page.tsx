"use client"

import Areachart from "@/app/components/Areachart";
import Barchart from "@/app/components/Barchart";
import DailyAreaChart from "@/app/components/DailyAreaChart";
import HomeSummary from "@/app/components/HomeSummary";
import Linechart from "@/app/components/Linechart";

export default function Page() {

  return (
    <main>
      <div className="container mx-auto">
        <div className="flex">
          <HomeSummary />
        </div>
        <div className="grid grid-cols-1 gap-5 p-10">
          <div className="flex w-full items-center justify-center">

            <div role="tablist" className="tabs tabs-bordered">
              <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="TODAY'S PROGRESS" defaultChecked />
              <div role="tabpanel" className="tab-content p-10">
                <DailyAreaChart />
              </div>
              <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="MONTHLY PROGRESS" />
              <div role="tabpanel" className="tab-content p-10">
                <Areachart />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="p-5"><h4 className="uppercase font-bold text-sm">Last Six Month Sales Analysis</h4></div>
            <div><Barchart /></div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center pb-10">
          <div className="p-5"><h4 className="uppercase font-bold text-sm">Last 12 Month Profit-Loss Analysis</h4></div>
          <div><Linechart /></div>
        </div>
      </div>
    </main>
  );
}
