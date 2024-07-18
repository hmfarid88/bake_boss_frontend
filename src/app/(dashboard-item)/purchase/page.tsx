import React from "react";
import { FcPlus } from "react-icons/fc";
import ItemMake from "@/app/components/ItemMake";
import Materials from "@/app/components/Materials";
import ProductStock from "@/app/components/ProductStock";
import StockModal from "@/app/components/StockModal";


const Page: React.FC = () => {
  return (
    <div className="container-2xl min-h-screen">
      <div className="flex w-full justify-end">
        <div>
          <a href="#my_modal_stock" className="btn btn-circle btn-ghost"><FcPlus size={35} /></a>
          <div className="modal sm:modal-middle" role="dialog" id="my_modal_stock">
            <div className="modal-box">
              <StockModal />
              <div className="modal-action">
                <a href="#" className="btn btn-square btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-10 h-10">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full">
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
        </div>
      </div>
    </div>

  )
}

export default Page