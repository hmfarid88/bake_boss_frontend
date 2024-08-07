import React from 'react'
import OfficeReceive from '@/app/components/OfficeReceive';
import RetailerPayment from '@/app/components/RetailerPayment';

const Receive = () => {
  return (
    <div className='container-2xl min-h-screen'>
      <div className="flex w-full">
        <div role="tablist" className="tabs tabs-bordered">
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="OFFICE RECEIVE" defaultChecked />
          <div role="tabpanel" className="tab-content p-10">
            <OfficeReceive />
          </div>
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="RETAILER PAYMENT" />
          <div role="tabpanel" className="tab-content p-10">
            <RetailerPayment />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Receive