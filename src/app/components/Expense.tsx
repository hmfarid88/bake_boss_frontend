"use client"
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import { useAppSelector } from "@/app/store";

const Expense = () => {
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

  // expense
  const [expenseName, setExpenseName] = useState("");
  const [expenseNote, setExpenseNote] = useState("");
  const [expensAmount, setExpenseAmount] = useState("");

  const handleExpenseSubmit = async (e: any) => {
    e.preventDefault();
    if (!date || !expenseName || !expenseNote || !expensAmount) {
      toast.warning("Item is empty !");
      return;
    }
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/paymentApi/expenseRecord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, expenseName, expenseNote, amount: expensAmount, time:currentTime, username }),
      });

      if (response.ok) {
        toast.success("Expense added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid transaction !")
    } finally {
      setPending(false);
      setExpenseNote("");
      setExpenseAmount("");
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
            <span className="label-text">Expense Name</span>
          </div>
          <select className='select select-bordered' onChange={(e: any) => { setExpenseName(e.target.value) }}>
            <option selected disabled>Select . . .</option>
            <option value="OFFICE COST">OFFICE COST</option>
            <option value="OFFICE ASSET">OFFICE ASSET</option>
            <option value="STAFF SALARY">STAFF SALARY</option>
            <option value="SHOP RENT">SHOP RENT</option>
          </select>

        </label>
      </div>
      <div className="flex">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Expense Note</span>
          </div>
          <input type="text" name='note' autoComplete='note' value={expenseNote} onChange={(e) => setExpenseNote(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
        </label>
      </div>
      <div className="flex">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Expense Amount</span>
          </div>
          <input type="number" value={expensAmount} onChange={(e) => setExpenseAmount(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
        </label>
      </div>
      <div className="flex pt-5">
        <label className="form-control w-full max-w-xs">
          <button onClick={handleExpenseSubmit} className="btn btn-success btn-outline max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT"}</button>
        </label>
      </div>
    </div>
  )
}

export default Expense