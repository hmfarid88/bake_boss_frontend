"use client"
import React, { useEffect, useState } from 'react'
import { DatePicker } from 'react-date-picker';
import { toast} from "react-toastify";
import { FcCalendar } from "react-icons/fc";
import { useAppSelector } from '@/app/store';
import Select from "react-select";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
const RetailerPayment = () => {
    const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [pending, setPending] = useState(false);
  const [date, setDate] = useState<Value>(new Date());

  const [retailerName, setRetailerName] = useState("");
  const [retailerNote, setRetailerNote] = useState("");
  const [retailerAmount, setRetailerAmount] = useState("");

  const handleRetailerSubmit = async (e: any) => {
    e.preventDefault();
    if (!retailerName || !retailerNote || !retailerAmount) {
      toast.warning("Item is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/paymentApi/retailerPayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, retailerName, amount:retailerAmount, note:retailerNote, username }),
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
      setRetailerNote("");
      setRetailerAmount("");
    }
  };

  const [salesuser, setSalesuser] = useState([]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/auth/user/getSalesUser`)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map((item: any) => ({
          value: item.username,
          label: item.username
        }));
        setSalesuser(transformedData);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl]);
  return (
    <div>
        <p>DATE : <DatePicker calendarIcon={FcCalendar} className="rounded-md max-w-xs z-20" clearIcon={null} maxDate={new Date()} format='y-MM-dd' onChange={setDate} value={date} /></p>
            <div className="flex pt-5">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Pick the Retailer</span>
                </div>
                <Select className="text-black h-[38px] w-full max-w-xs" onChange={(selectedOption: any) => setRetailerName(selectedOption.value)} options={salesuser} />
              </label>
            </div>
            <div className="flex">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Payment Note</span>
                </div>
                <input type="text" value={retailerNote} onChange={(e)=>setRetailerNote(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
              </label>
            </div>
            <div className="flex">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Payment Amount</span>
                </div>
                <input type="number" value={retailerAmount} onChange={(e)=>setRetailerAmount(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
              </label>
            </div>
            <div className="flex pt-5">
              <label className="form-control w-full max-w-xs">
              <button onClick={handleRetailerSubmit} className="btn btn-success btn-outline max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT"}</button>
              </label>
            </div>
    </div>
  )
}

export default RetailerPayment