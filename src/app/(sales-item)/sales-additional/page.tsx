"use client"
import React, { useEffect, useState } from 'react'
import { FcCalendar} from 'react-icons/fc'
import { toast } from 'react-toastify';
import { useAppSelector } from "@/app/store";
import { uid } from 'uid';
import DatePicker from 'react-date-picker';
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const Page = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const [productName, setProductName] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [saleRate, setSaleRate] = useState("");
  const [productQty, setProductQty] = useState("");
  const [pending, setPending] = useState(false);
  const [maxDate, setMaxDate] = useState('');
  const [date, setDate] = useState<Value>(new Date());
  const pid = uid();
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setMaxDate(formattedDate);
  }, []);
   
  const handleAdditionalSubmit = async (e: any) => {
    e.preventDefault();
    if (!productName || !costPrice || !saleRate) {
      toast.warning("All field is required");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/addAdditionalSalesItemStock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ date, category: "Additional", productName, costPrice, saleRate, productQty, status: 'stored', username, invoiceNo: pid }]),
      });

      if (!response.ok) {
        toast.error("Sorry, product not added!");
        return;
      } else {
        toast.success("Product added successfully.")
        setProductName("");
        setCostPrice("");
        setSaleRate("");
        setProductQty("");
      }
    } catch (error: any) {
      toast.error("An error occurred: " + error.message);
    } finally {
      setPending(false);
    }
  }
 
  return (
    <div className='container min-h-screen'>

      <div className="flex w-full p-4 items-center justify-center">
        <div className="flex flex-col gap-3 w-full items-center justify-center p-2">
          <div className="flex justify-between font-bold pt-5 px-10 pb-0">
            <p>DATE : <DatePicker calendarIcon={FcCalendar} className="rounded-md max-w-xs z-20" clearIcon={null} maxDate={new Date()} minDate={new Date()} format='y-MM-dd' onChange={setDate} value={date} /></p>
          </div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text-alt">PRODUCT NAME</span>
            </div>
            <input type='text' placeholder="Type here" className="border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" value={productName} onChange={(e: any) => setProductName(e.target.value)} />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text-alt">COST PRICE</span>
            </div>
            <input type="number" value={costPrice} onChange={(e: any) => setCostPrice(e.target.value)} placeholder="Type here" className="border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text-alt">SALE PRICE</span>
            </div>
            <input type="number" value={saleRate} onChange={(e: any) => setSaleRate(e.target.value)} placeholder="Type here" className="border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" />
          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text-alt">QUANTITY</span>
            </div>
            <input type="number" value={productQty} onChange={(e: any) => setProductQty(e.target.value)} placeholder="Type here" className="border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" />
          </label>
          <label className="form-control w-full max-w-xs">
            <button onClick={handleAdditionalSubmit} disabled={pending} className="btn btn-outline btn-success">{pending ? "Adding..." : "ADD"}</button>
          </label>
        </div>

      </div>
    </div>
  )
}

export default Page