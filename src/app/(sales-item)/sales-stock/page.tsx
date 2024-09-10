'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPlus, FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import Select from "react-select";
import { toast } from "react-toastify";

type Product = {
  date: string;
  category: string;
  productName: string;
  costPrice: number;
  remainingQty: number;
  invoiceNo: string;
  saleRate: number;
};


const Page = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const [pending, setPending] = useState(false);

  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
  });
  const [filterCriteria, setFilterCriteria] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);


  const [productName, setProductName] = useState("");
  const [productValue, setProductValue] = useState("");
  const [qtyPerKg, setQtyPerKg] = useState("");

  const handleProductRateSubmit = async (e: any) => {
    e.preventDefault();
    if (!productName || !productValue) {
      toast.warning("Field is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/productRateSetup`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName, saleRate: productValue, qty:qtyPerKg, username }),
      });

      if (response.ok) {
        toast.success("Rate added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setPending(false);
      setProductValue("");
      setQtyPerKg("");
    }
  };

  useEffect(() => {
    fetch(`${apiBaseUrl}/sales/getSalesStock?username=${username}`)
      .then(response => response.json())
      .then(data => {
        setAllProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username, productValue]);


  useEffect(() => {
    const filtered = allProducts.filter(product =>
      (product.productName?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
      (product.category?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
      (product.date?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
      (product.invoiceNo?.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
    );
    setFilteredProducts(filtered);
  }, [filterCriteria, allProducts]);

  const handleFilterChange = (e: any) => {
    setFilterCriteria(e.target.value);
  };
  const totalValue = filteredProducts.reduce((total, product) => {
    return total + product.saleRate * product.remainingQty;
  }, 0);

  const totalQty = filteredProducts.reduce((total, product) => {
    return total + product.remainingQty;
  }, 0);

  const [productOption, setProductOption] = useState([]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getMadeProducts`)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map((madeItem: any) => ({
          value: madeItem,
          label: madeItem
        }));
        setProductOption(transformedData);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);

  return (
    <div className="container-2xl min-h-screen">
      <div className="flex w-full justify-end pr-5">
        <a href="#my_modal_3" className="btn btn-circle btn-ghost"><FcPlus size={35} /></a>
      </div>
      <div className="flex w-full p-4 items-center justify-center">
        <div>
          <div className="modal sm:modal-middle" role="dialog" id="my_modal_3">
            <div className="modal-box">
              <h3 className="font-bold text-sm text-center">ADD PRODUCT RATE</h3>
              <div className="flex flex-col gap-3 w-full items-center justify-center p-2">
                <label className="form-control w-full max-w-xs pt-5">
                  <div className="label">
                    <span className="label-text-alt">SELECT PRODUCT</span>
                  </div>
                  <Select className="text-black" name="psupplier" onChange={(selectedOption: any) => setProductName(selectedOption.value)} options={productOption} />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text-alt">SALE RATE</span>
                  </div>
                  <input type="number" value={productValue} onChange={(e: any) => setProductValue(e.target.value)} placeholder="Type here" className="input-bordered border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text-alt">QTY PER KG</span>
                  </div>
                  <input type="number" value={qtyPerKg} onChange={(e: any) => setQtyPerKg(e.target.value)} placeholder="Type here" className="input-bordered border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" />
                </label>
                <label className="form-control w-full max-w-xs">
                  <button onClick={handleProductRateSubmit} disabled={pending} className="btn btn-outline btn-success">{pending ? "Adding..." : "ADD"}</button>
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

        <div className="overflow-x-auto">
          <div className="flex justify-between pl-5 pr-5 pt-1">
            <label className="input input-bordered flex max-w-xs  items-center gap-2">
              <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
              </svg>
            </label>
            <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
          </div>
          <div ref={contentToPrint} className="flex-1 p-5">
            <div className="flex font-semibold text-lg items-cente justify-center w-full pb-5">
              <h4>PRODUCT STOCK</h4>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>DATE</th>
                  <th>INVOICE NO</th>
                  <th>CATEGORY</th>
                  <th>PRODUCT NAME</th>
                  <th>PURCHASE PRICE</th>
                  <th>SALE PRICE</th>
                  <th>QUANTITY</th>
                  <th>SUB TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts?.map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{product.date}</td>
                    <td className="uppercase">{product.invoiceNo}</td>
                    <td className="capitalize">{product.category}</td>
                    <td className="capitalize">{product.productName}</td>
                    <td>{Number((product.costPrice).toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number((product.saleRate).toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number((product.remainingQty).toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number((product.saleRate * product.remainingQty).toFixed(2)).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold text-lg">
                  <td colSpan={6}></td>
                  <td>TOTAL</td>
                  <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
                  <td>{Number(totalValue.toFixed(2)).toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page