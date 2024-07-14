"use client"
import React, { useEffect, useState } from 'react'
import { DatePicker } from 'react-date-picker';
import { toast, ToastContainer } from "react-toastify";
import { FcCalendar } from "react-icons/fc";
import { useAppSelector } from '@/app/store';
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
const OfficeRecev = () => {
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
    const [pending, setPending] = useState(false);
    const [date, setDate] = useState<Value>(new Date());
   
    const [receiveName, setReceiveName] = useState("");
    const [receiveAmount, setReceiveAmount] = useState("");
  
    
    const handleReceiveSubmit = async (e: any) => {
      e.preventDefault();
      if (!receiveName || !receiveAmount) {
        toast.warning("Item is empty !");
        return;
      }
      setPending(true);
      try {
        const response = await fetch(`${apiBaseUrl}/paymentApi/officeReceive`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ date, receiveName, amount:receiveAmount, username }),
        });
  
        if (response.ok) {
          toast.success("Amount added successfully !");
        } else {
          const data = await response.json();
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Invalid transaction !")
      } finally {
        setPending(false);
        setReceiveName("");
        setReceiveAmount("");
      }
    };
  return (
    <div>
         <p>DATE : <DatePicker calendarIcon={FcCalendar} className="rounded-md max-w-xs z-20" clearIcon={null} maxDate={new Date()} format='y-MM-dd' onChange={setDate} value={date} /></p>
            <div className="flex pt-5">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Receive Name</span>
                </div>
                <input type="text" value={receiveName} onChange={(e) => setReceiveName(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
              </label>
            </div>
            <div className="flex">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Receive Amount</span>
                </div>
                <input type="number" value={receiveAmount} onChange={(e)=>setReceiveAmount(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
              </label>
            </div>
            <div className="flex pt-5">
              <label className="form-control w-full max-w-xs">
                <button onClick={handleReceiveSubmit} className="btn btn-success btn-outline max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT"}</button>
              </label>
            </div>
    </div>
  )
}

export default OfficeRecev