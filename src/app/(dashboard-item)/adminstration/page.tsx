"use client"
import { useAppSelector } from '@/app/store';
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from "react-toastify";

const Page = () => {
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [dpMargin, setDpMargin] = useState("");
  const [rpMargin, setRpMargin] = useState("");
  const [pending, setPending] = useState(false);

  const handleMargin = async (e: any) => {
    e.preventDefault();
    if (!dpMargin || !rpMargin) {
      toast.warning("Item is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/paymentApi/marginSetup`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, dpMargin: parseFloat(dpMargin), rpMargin: parseFloat(rpMargin) }),
      });

      if (response.ok) {
        toast.success("Margin setup successfull !");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to set up margin.");
      }
    } catch (error) {
      toast.error("Invalid margin setup !")
    } finally {
      setPending(false);
      setDpMargin("");
      setRpMargin("");
    }
  }
  
  return (
    <div className='container min-h-screen'>
      <div className="flex flex-col gap-3 items-center justify-center">
      
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text uppercase">DP Profit Margin (%)</span>
            </div>
            <input type="number" value={dpMargin} onChange={(e) => setDpMargin(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text uppercase">RP Profit Margin (%)</span>
            </div>
            <input type="number" value={rpMargin} onChange={(e) => setRpMargin(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
          </label>
            
          <label className="form-control w-full max-w-xs">
            <button onClick={handleMargin} className="btn btn-success btn-outline max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT"}</button>
          </label>
           </div>
     
      <ToastContainer autoClose={1000} theme='dark' />
    </div>
  )
}

export default Page