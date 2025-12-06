'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useSearchParams } from "next/navigation";

type Product = {
  date: string;
  category: string;
  productName: string;
  costPrice: number;
  salePrice: number;
  qty: number;
  discount: number;

};


const Page = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';

  const searchParams = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const outlet=searchParams.get('outlet')

  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
  });
  const [filterCriteria, setFilterCriteria] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/sales/getDatewiseSalesProfit?username=${outlet}&startDate=${startDate}&endDate=${endDate}&percent=100`)
      .then(response => response.json())
      .then(data => {
        setAllProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, outlet, startDate, endDate]);


  useEffect(() => {
    const filtered = allProducts.filter(product =>
      (product.productName.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
      (product.category.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
      (product.date.toLowerCase().includes(filterCriteria.toLowerCase()) || '')

    );
    setFilteredProducts(filtered);
  }, [filterCriteria, allProducts]);

  const handleFilterChange = (e: any) => {
    setFilterCriteria(e.target.value);
  };

  const totalCost = filteredProducts.reduce((acc, item) => acc + item.costPrice, 0);
  const totalSale = filteredProducts.reduce((acc, item) => acc + item.salePrice, 0);
  const totalQty = filteredProducts.reduce((acc, item) => acc + item.qty, 0);
  const totalDis = filteredProducts.reduce((acc, item) => acc + item.discount, 0);

  const grandTotal = filteredProducts.reduce((acc, item) => {
    return acc + (((item.salePrice - item.costPrice)*item.qty) - item.discount);
  }, 0);
  
  return (
    <div className="container-2xl min-h-[calc(100vh-228px)]">
      <div className="flex w-full justify-between p-5">

        <div className="pt-2">
          <label className="input input-bordered flex max-w-xs  items-center gap-2">
            <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
              <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
            </svg>
          </label>
        </div>
        <div className="pt-5"><button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button></div>

      </div>

      <div className="flex w-full items-center justify-center">
        <div className="overflow-x-auto">
          <div ref={contentToPrint} className="flex-1 p-5">
            <div className="flex flex-col gap-2 items-center"><h4 className="font-bold">PROFIT REPORT</h4>
            <h4 className="uppercase">Outlet : {outlet}</h4>
              {startDate} TO {endDate}
            </div>
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>DATE</th>
                  <th>CATEGORY</th>
                  <th>PRODUCT NAME</th>
                  <th>SALE PRICE</th>
                  <th>COST PRICE</th>
                  <th>UNIT PROFIT</th>
                  <th>QUANTITY</th>
                  <th>DISCOUNT</th>
                  <th>SUB TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts?.map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{product.date}</td>
                    <td className="capitalize">{product.category}</td>
                    <td className="capitalize">{product.productName}</td>
                    <td>{Number(product.salePrice.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number(product.costPrice.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number((product.salePrice - product.costPrice).toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number(product.qty.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number(product.discount?.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number(((((product.salePrice - product.costPrice) * product.qty) - product.discount)).toFixed(2)).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold text-lg">
                  <td colSpan={3}></td>
                  <td>TOTAL</td>
                  <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
                  <td>{Number(totalSale.toFixed(2)).toLocaleString('en-IN')}</td>
                  <td>{Number(totalCost.toFixed(2)).toLocaleString('en-IN')}</td>
                  <td>{Number((totalSale - totalCost).toFixed(2)).toLocaleString('en-IN')}</td>
                  <td>{Number(totalDis.toFixed(2)).toLocaleString('en-IN')}</td>
                  <td>{Number((grandTotal).toFixed(2)).toLocaleString('en-IN')}</td>
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