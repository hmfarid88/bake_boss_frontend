"use client"
import React, { useEffect, useState } from 'react'
import { DatePicker } from 'react-date-picker';
import { toast, ToastContainer } from "react-toastify";
import { FcCalendar } from "react-icons/fc";
import { useAppSelector } from "@/app/store";
import Select from "react-select";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];


const Payment = () => {
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [pending, setPending] = useState(false);
  const [date, setDate] = useState<Value>(new Date());
  // expense
  const [expenseName, setExpenseName] = useState("");
  const [expensAmount, setExpenseAmount] = useState("");

  const handleExpenseSubmit = async (e: any) => {
    e.preventDefault();
    if (!expenseName || !expensAmount) {
      toast.warning("Item is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/paymentApi/paymentRecord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, paymentName: expenseName, paymentType: "expense", amount: expensAmount, username }),
      });

      if (response.ok) {
        toast.success("Payment added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid transaction !")
    } finally {
      setPending(false);
      setExpenseName("");
      setExpenseAmount("");
    }
  };
  // office cost

  const [paymentName, setPaymentName] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const handlePaymentSubmit = async (e: any) => {
    e.preventDefault();
    if (!paymentName || !paymentAmount) {
      toast.warning("Item is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/paymentApi/paymentRecord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, paymentName, paymentType: "office", amount: paymentAmount, username }),
      });

      if (response.ok) {
        toast.success("Payment added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid transaction !")
    } finally {
      setPending(false);
      setPaymentName("");
      setPaymentAmount("");
    }
  };
  // supplier payment
  const [supplierName, setSupplierName] = useState("");
  const [supplierAmount, setSupplierAmount] = useState("");
  const [supplierNote, setSupplierNote] = useState("");

  const handleSupplierPayment = async (e: any) => {
    e.preventDefault();
    if (!supplierName || !supplierAmount || !supplierNote) {
      toast.warning("Item is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/paymentApi/supplierPayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, supplierName, note: supplierNote, amount: supplierAmount, username }),
      });

      if (response.ok) {
        toast.success("Payment added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid transaction !")
    } finally {
      setPending(false);
      setSupplierNote("");
      setSupplierAmount("");
    }
  };

  const [supplierOption, setSupplierOption] = useState([]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getSuppliersName?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map((item: any) => ({
          id: item.id,
          value: item.supplierName,
          label: item.supplierName
        }));
        setSupplierOption(transformedData);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);

  return (
    <div className='container-2xl min-h-screen'>
      <div className="flex w-full">
        <div role="tablist" className="tabs tabs-bordered">
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="EXPENSE" defaultChecked />
          <div role="tabpanel" className="tab-content p-10">
            <p>DATE : <DatePicker calendarIcon={FcCalendar} className="rounded-md max-w-xs z-20" clearIcon={null} maxDate={new Date()} format='y-MM-dd' onChange={setDate} value={date} /></p>
            <div className="flex pt-5">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Expense Name</span>
                </div>
                <input type="text" value={expenseName} onChange={(e) => setExpenseName(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
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

          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="OFFICE PAYMENT" />
          <div role="tabpanel" className="tab-content p-10">
            <p>DATE : <DatePicker calendarIcon={FcCalendar} className="rounded-md max-w-xs z-20" clearIcon={null} maxDate={new Date()} format='y-MM-dd' onChange={setDate} value={date} /></p>
            <div className="flex pt-5">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Payment Name</span>
                </div>
                <input type="text" value={paymentName} onChange={(e) => setPaymentName(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
              </label>
            </div>
            <div className="flex">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Payment Amount</span>
                </div>
                <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
              </label>
            </div>
            <div className="flex pt-5">
              <label className="form-control w-full max-w-xs">
                <button onClick={handlePaymentSubmit} className="btn btn-success btn-outline max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT"}</button>
              </label>
            </div>
          </div>

          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="SUPPLIER PAYMENT" />
          <div role="tabpanel" className="tab-content p-10">
            <p>DATE : <DatePicker calendarIcon={FcCalendar} className="rounded-md max-w-xs z-20" clearIcon={null} maxDate={new Date()} format='y-MM-dd' onChange={setDate} value={date} /></p>
            <div className="flex pt-5">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Pick the Supplier</span>
                </div>
                <Select className="text-black" name="supplier" onChange={(selectedOption: any) => setSupplierName(selectedOption.value)} options={supplierOption} />
              </label>
            </div>
            <div className="flex">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Payment Note</span>
                </div>
                <input type="text" value={supplierNote} onChange={(e) => setSupplierNote(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
              </label>
            </div>
            <div className="flex">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Payment Amount</span>
                </div>
                <input type="number" value={supplierAmount} onChange={(e) => setSupplierAmount(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
              </label>
            </div>
            <div className="flex pt-5">
              <label className="form-control w-full max-w-xs">
                <button onClick={handleSupplierPayment} className="btn btn-success btn-outline max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT"}</button>
              </label>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={1000} theme='dark' />
    </div>
  )
}

export default Payment