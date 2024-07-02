"use client"
import React, { useState } from 'react'
import { DatePicker } from 'react-date-picker';
import { toast, ToastContainer } from "react-toastify";
import { FcCalendar } from "react-icons/fc";
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const Receive = () => {
  const [date, setDate] = useState<Value>(new Date());
  return (
    <div className='container-2xl min-h-screen'>
      <div className="flex w-full">
        <div role="tablist" className="tabs tabs-bordered">
         
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="OFFICE RECEIVE" defaultChecked/>
          <div role="tabpanel" className="tab-content p-10">
            <p>DATE : <DatePicker calendarIcon={FcCalendar} className="rounded-md max-w-xs z-20" clearIcon={null} maxDate={new Date()} format='y-MM-dd' onChange={setDate} value={date} /></p>
            <div className="flex pt-5">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Receive Name</span>
                </div>
                <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
              </label>
            </div>
            <div className="flex">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Receive Amount</span>
                </div>
                <input type="number" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
              </label>
            </div>
            <div className="flex pt-5">
              <label className="form-control w-full max-w-xs">
                <input type="button" value="SUBMIT" className="btn btn-bordered w-full max-w-xs" />
              </label>
            </div>
          </div>

          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="RETAILER PAYMENT" />
          <div role="tabpanel" className="tab-content p-10">
            <p>DATE : <DatePicker calendarIcon={FcCalendar} className="rounded-md max-w-xs z-20" clearIcon={null} maxDate={new Date()} format='y-MM-dd' onChange={setDate} value={date} /></p>
            <div className="flex pt-5">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Pick the Retailer</span>
                </div>
                <select className="select select-bordered">
                  <option disabled selected>Pick one</option>
                  <option>Star Wars</option>
                  <option>Harry Potter</option>
                  <option>Lord of the Rings</option>
                  <option>Planet of the Apes</option>
                  <option>Star Trek</option>
                </select>
              </label>
            </div>
            <div className="flex">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Payment Note</span>
                </div>
                <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
              </label>
            </div>
            <div className="flex">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Payment Amount</span>
                </div>
                <input type="number" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
              </label>
            </div>
            <div className="flex pt-5">
              <label className="form-control w-full max-w-xs">
                <input type="button" value="SUBMIT" className="btn btn-bordered w-full max-w-xs" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Receive