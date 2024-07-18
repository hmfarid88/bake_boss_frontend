"use client"
import React, { useEffect, useRef, useState } from 'react'
import { FcPlus, FcPrint } from 'react-icons/fc'
import { toast } from 'react-toastify';
import { useAppSelector } from "@/app/store";
import { useReactToPrint } from 'react-to-print';

type Product = {
  category: string;
  productName: string;
  costPrice: number;
  salePrice: number;
};
const Page = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const [productName, setProductName] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [pending, setPending] = useState(false);


  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
  });
  const [filterCriteria, setFilterCriteria] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const handleAdditionalSubmit = async (e: any) => {
    e.preventDefault();
    if (!productName || !costPrice || !salePrice) {
      toast.warning("All field is required");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/additionalStock/addOrUpdate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: "Additional", productName, costPrice, salePrice, username }),
      });

      if (!response.ok) {
        toast.error("Sorry, product not added!");
        return;
      } else {
        toast.success("Product added successfully.")
        setProductName("");
        setCostPrice("");
        setSalePrice("");
      }
    } catch (error: any) {
      toast.error("An error occurred: " + error.message);
    } finally {
      setPending(false);
    }
  }
  useEffect(() => {
    fetch(`${apiBaseUrl}/additionalStock/getAdditionalProducts?username=${username}`)
      .then(response => response.json())
      .then(data => {
        setAllProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, productName, username]);


  useEffect(() => {
    const filtered = allProducts.filter(product =>
      product.productName.toLowerCase().includes(filterCriteria.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [filterCriteria, allProducts]);

  const handleFilterChange = (e: any) => {
    setFilterCriteria(e.target.value);
  };

  return (
    <div className='container min-h-screen'>
      <div className="flex w-full justify-end">
        <a href="#my_modal_additional" className="btn btn-circle btn-ghost"><FcPlus size={35} /></a>
      </div>
      <div className="flex w-full p-4 items-center justify-center">
        <div>
          <div className="modal sm:modal-middle" role="dialog" id="my_modal_additional">
            <div className="modal-box">
              <h4 className="font-bold text-sm">ADD ADDITIONAL PRODUCT</h4>
              <div className="flex flex-col gap-3 w-full items-center justify-center p-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text-alt">Product Name</span>
                  </div>
                  <input type='text' placeholder="Type here" className="border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" value={productName} onChange={(e: any) => setProductName(e.target.value)} />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text-alt">Cost Price</span>
                  </div>
                  <input type="number" value={costPrice} onChange={(e: any) => setCostPrice(e.target.value)} placeholder="Type here" className="border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text-alt">Sale Price</span>
                  </div>
                  <input type="number" value={salePrice} onChange={(e: any) => setSalePrice(e.target.value)} placeholder="Type here" className="border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" />
                </label>
                <button onClick={handleAdditionalSubmit} disabled={pending} className="btn btn-outline btn-success">{pending ? "Adding..." : "ADD"}</button>
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
          <div className="flex justify-between pl-5 pr-5">
            <label className="input input-bordered flex max-w-xs  items-center gap-2">
              <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
              </svg>
            </label>
            <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
          </div>
          <div ref={contentToPrint} className="flex-1 p-5">
            <table className="table uppercase">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>CATEGORY</th>
                  <th>PRODUCT NAME</th>
                  <th>COST PRICE</th>
                  <th>SALE PRICE</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts?.map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{product.category}</td>
                    <td>{product.productName}</td>
                    <td>{product.costPrice}</td>
                    <td>{product.salePrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page