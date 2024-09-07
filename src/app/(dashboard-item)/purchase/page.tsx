import React from "react";
import ItemMake from "@/app/components/ItemMake";
import Materials from "@/app/components/Materials";
import ProductStock from "@/app/components/ProductStock";
import { ToastContainer } from "react-toastify";
import ReItemMake from "@/app/components/ReItemMake";


const Page: React.FC = () => {
  return (
    <div className="container-2xl min-h-screen">
      <div className="flex w-full items-center justify-center">
        <div role="tablist" className="tabs tabs-bordered p-3">
          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="ITEM MAKING" defaultChecked />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <ItemMake />
          </div>
          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="MATERIALS STOCK" />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <div className="flex w-full">
              <Materials />
            </div>
          </div>

          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="PRODUCT STOCK" />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <ProductStock />
          </div>

          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="RE-ITEM MAKING" />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <ReItemMake />
          </div>
        </div>
      </div>
      <ToastContainer autoClose={1000} theme="dark" />
    </div>

  )
}

export default Page