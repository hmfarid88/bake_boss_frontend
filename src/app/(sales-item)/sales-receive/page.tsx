import React from 'react'
import OfficeReceive from '@/app/components/OfficeReceive';

const Receive = () => {
   return (
    <div className='container-2xl min-h-screen'>
      <div className="flex w-full">
        <div role="tablist" className="tabs tabs-bordered">
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="OFFICE RECEIVE" defaultChecked />
          <div role="tabpanel" className="tab-content p-10">
            <OfficeReceive />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Receive