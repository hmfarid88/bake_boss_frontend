import React from 'react'
import Expense from '@/app/components/Expense';
import SupplierPayment from '@/app/components/SupplierPayment';
import OfficePayment from '@/app/components/OfficePayment';

const Payment = () => {
  return (
    <div className='container-2xl min-h-screen'>
      <div className="flex w-full">
        <div role="tablist" className="tabs tabs-bordered">
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="EXPENSE" defaultChecked />
          <div role="tabpanel" className="tab-content p-10">
            <Expense />
          </div>
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="OFFICE PAYMENT" />
          <div role="tabpanel" className="tab-content p-10">
            <OfficePayment />
          </div>
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="SUPPLIER PAYMENT" />
          <div role="tabpanel" className="tab-content p-10">
            <SupplierPayment />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment