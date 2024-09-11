
import React from "react";
import FactoryPending from "@/app/components/FactoryPending";
import VendorPending from "@/app/components/VendorPending";

const Page = () => {
   
    return (
        <div className="container-2xl">
            <div className="flex flex-col w-full min-h-[calc(100vh-228px)] p-4 items-center">
                <div className="flex font-semibold text-lg items-center">
                    <h4>PENDING PRODUCT</h4>
                </div>
                <div role="tablist" className="tabs tabs-bordered p-3">
                    <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="FACTORY PENDING" defaultChecked />
                    <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                        <FactoryPending />
                    </div>
                    <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="VENDOR PENDING" />
                    <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                        <VendorPending />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Page