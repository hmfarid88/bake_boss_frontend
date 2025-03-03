"use client"
import React, { useEffect, useState } from 'react'
import { FcCalendar, FcPlus } from 'react-icons/fc'
import { toast } from 'react-toastify';
import { useAppSelector } from "@/app/store";
import { uid } from 'uid';
import Select from "react-select";

const Page = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';

  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [additionalName, setAdditionalName] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [saleRate, setSaleRate] = useState("");
  const [productQty, setProductQty] = useState("");
  const [pending, setPending] = useState(false);
  const [maxDate, setMaxDate] = useState('');
  const [date, setDate] = useState("");
  const pid = uid();

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setMaxDate(formattedDate);
    setDate(formattedDate);
  }, []);

  const handleAdditionalName = async (e: any) => {
    e.preventDefault();

    if (!additionalName) {
      toast.warning("Additional name is empty !")
      return;
    }
    setPending(true)
    try {
      const response = await fetch(`${apiBaseUrl}/api/addAdditionalName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ additionalName }),
      });

      if (response.ok) {
        toast.success("Name added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid product name !")
    } finally {
      setPending(false);
      setAdditionalName("");
    }

  };
  const handleAdditionalSubmit = async (e: any) => {
    e.preventDefault();
    if (!category || !productName || !costPrice || !saleRate || !productQty) {
      toast.warning("All fields are required");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/addAdditionalSalesItemStock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ date, category, productName, costPrice, saleRate, productQty, status: 'stored', username, invoiceNo: pid }]),
      });

      if (!response.ok) {
        toast.error("Sorry, product not added!");
        return;
      } else {
        setProductName("");
        setCostPrice("");
        setSaleRate("");
        setProductQty("");
        toast.success("Product added successfully.")
      }
    } catch (error: any) {
      toast.error("An error occurred: " + error.message);
    } finally {
      setPending(false);
    }
  }
  const [itemOption, setItemOption] = useState([]);
  useEffect(() => {
    const fetchMadeProducts = () => {
      fetch(`${apiBaseUrl}/api/getAdditionalName`)
        .then(response => response.json())
        .then(data => {
          const transformedData = data.map((item: any) => ({
            value: item.additionalName,
            label: item.additionalName
          }));
          setItemOption(transformedData);
        })
        .catch(error => console.error('Error fetching products:', error));
    };

    // Fetch data initially
    fetchMadeProducts();
  }, [apiBaseUrl, additionalName]);

  return (
    <div className='container min-h-screen'>

      <div className="flex w-full p-4 items-center justify-center">
        <div className="flex flex-col gap-3 w-full items-center justify-center p-2">

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text-alt">DATE</span>
            </div>
            <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)} max={maxDate} value={date} className="border rounded-md p-2 mt-1.5 bg-white text-black  w-full max-w-xs h-[40px]" />
          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text-alt">CATEGORY NAME</span>
            </div>
            <select className='select select-bordered rounded-md bg-white text-black h-[38px]' onChange={(e: any) => { setCategory(e.target.value) }}>
              <option selected disabled>Select . . .</option>
              <option value="Additional">Additional</option>
              <option value="Barista">Barista</option>
              <option value="Birthday Item">Birthday Item</option>
              <option value="Bakery">Bakery</option>
              <option value="Sweets">Sweets</option>
              <option value="Pastry">Pastry</option>
              <option value="Fast Food">Fast Food</option>
              <option value="Iftar Item">Iftar Item</option>
              <option value="Others">Others</option>
            </select>

          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text-alt">PRODUCT NAME</span>
              <a href="#my_modal_additionalItem" className="btn btn-xs btn-circle btn-ghost"><FcPlus size={20} /></a>
            </div>
            <Select className="text-black" name="pname" onChange={(selectedOption: any) => setProductName(selectedOption.value)} options={itemOption} />

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
            <input type="number" value={productQty} step="any" onChange={(e: any) => setProductQty(e.target.value)} placeholder="Type here" className="border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" />
          </label>
          <label className="form-control w-full max-w-xs">
            <button onClick={handleAdditionalSubmit} disabled={pending} className="btn btn-outline btn-success">{pending ? "Adding..." : "ADD"}</button>
          </label>
        </div>
        <div className="modal sm:modal-middle" role="dialog" id="my_modal_additionalItem">
          <div className="modal-box">
            <div className="flex w-full items-center justify-center p-2">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text-alt">ADD PRODUCT NAME</span>
                </div>
                <div className="flex items-center justify-between">
                  <input type="text" value={additionalName} name="productName" onChange={(e: any) => setAdditionalName(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" />
                  <button onClick={handleAdditionalName} disabled={pending} className="btn btn-square btn-success">{pending ? "Adding..." : "ADD"}</button>
                </div>
              </label>
            </div>
            <div className="modal-action">
              <a href="#" className="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-10 h-10">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page