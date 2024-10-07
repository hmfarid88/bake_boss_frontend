"use client"
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import { useAppSelector } from '@/app/store';

const OfficeReceive = () => {
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [pending, setPending] = useState(false);
  const [date, setDate] = useState("");
  const [maxDate, setMaxDate] = useState('');
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setMaxDate(formattedDate);
    setDate(formattedDate);
  }, []);
  const [receiveName, setReceiveName] = useState("");
  const [receiveNote, setReceiveNote] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");


  const handleReceiveSubmit = async (e: any) => {
    e.preventDefault();
    if (!receiveName || !receiveAmount) {
      toast.warning("Item is empty !");
      return;
    }
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/paymentApi/officeReceive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, receiveName, receiveNote, amount: receiveAmount, time:currentTime, username }),
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
      setReceiveNote("");
      setReceiveAmount("");
    }
  };
  return (
    <div>
      <div className="flex">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text-alt">Date</span>
          </div>
          <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)} max={maxDate} value={date} className="border rounded-md p-2 mt-1.5 bg-white text-black  w-full max-w-xs h-[40px]" />
        </label>
      </div>
      <div className="flex">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Receive Name</span>
          </div>
          <input type="text" name='receiveName' autoComplete='receiveName' value={receiveName} onChange={(e) => setReceiveName(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
        </label>
      </div>
      <div className="flex">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Receive Note</span>
          </div>
          <input type="text" name='receiveNote' autoComplete='receiveNote' value={receiveNote} onChange={(e) => setReceiveNote(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
        </label>
      </div>
      <div className="flex">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Receive Amount</span>
          </div>
          <input type="number" value={receiveAmount} onChange={(e) => setReceiveAmount(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
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

export default OfficeReceive