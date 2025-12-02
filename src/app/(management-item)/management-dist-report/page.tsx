'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import Print from "@/app/components/Print";
import CurrentMonthYear from "@/app/components/CurrentMonthYear";
import DateToDate from "@/app/components/DateToDate";

type Product = {
  date: string;
  time: string;
  customer: string;
  category: string;
  productName: string;
  invoiceNo: string;
  dpRate: number;
  costPrice: number;
  productQty: number;
  saleRate: number;
};


const Page = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const contentToPrint = useRef<HTMLDivElement>(null);

  const [filterCriteria, setFilterCriteria] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);


  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getSoldProduct?username=aurora&percent=100`)
      .then(response => response.json())
      .then(data => {
        setAllProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);


useEffect(() => {
  const searchText = filterCriteria.toLowerCase().trim();

  let filtered = allProducts;

  if (searchText) {
    // If exact customer match
    const exactMatch = allProducts.filter(
      product => product.customer?.toLowerCase() === searchText
    );

    if (exactMatch.length > 0) {
      filtered = exactMatch;
    } else {
      // Build one string containing outlet + product details
      filtered = allProducts.filter(product => {
        const combinedText = [
          product.customer,
          product.category,
          product.productName,
          product.date,
          product.invoiceNo
        ]
          .map(f => f?.toLowerCase() || "")
          .join(" ");

        return combinedText.includes(searchText);
      });
    }
  }

  setFilteredProducts(filtered);
}, [filterCriteria, allProducts]);


  const handleFilterChange = (e: any) => {
    setFilterCriteria(e.target.value);
  };
  const totalValue = filteredProducts.reduce((total, product) => {
    return total + (product.dpRate * product.productQty);
  }, 0);
  const totalMrp = filteredProducts.reduce((total, product) => {
    return total + (product.saleRate * product.productQty);
  }, 0);

  const totalCost = filteredProducts.reduce((total, product) => {
    return total + (product.costPrice * product.productQty);
  }, 0);
  const totalQty = filteredProducts.reduce((acc, item) => acc + item.productQty, 0);
  return (
    <div className="container-2xl">
      <div className="flex flex-col w-full min-h-screen items-center justify-center">
        <div className="flex">
          <DateToDate routePath="/datewise-management-dist-report" />
        </div>
        <div className="flex w-full justify-between pl-5 pr-5 pt-1">
          <label className="input input-bordered flex max-w-xs  items-center gap-2">
            <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
              <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
            </svg>
          </label>
          <Print contentRef={contentToPrint} />
        </div>
        <div className="overflow-x-auto w-full">
          <div ref={contentToPrint} className="flex flex-col w-full p-5">
            <div className="flex flex-col items-center pb-5"><h4 className="font-bold">DISTRIBUTION REPORT</h4><CurrentMonthYear /></div>
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>DATE</th>
                  <th>TIME</th>
                  <th>OUTLET</th>
                  <th>CATEGORY</th>
                  <th>PRODUCT NAME</th>
                  <th>INVOICE NO</th>
                  <th>COST PRICE</th>
                  <th>DP PRICE</th>
                  <th>MRP</th>
                  <th>QTY</th>
                  <th>DP TOTAL</th>
                  <th>MRP TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts?.map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{product.date}</td>
                    <td>{product.time}</td>
                    <td className="capitalize">{product.customer}</td>
                    <td className="capitalize">{product.category}</td>
                    <td className="capitalize">{product.productName}</td>
                    <td className="uppercase">{product.invoiceNo}</td>
                    <td>{Number(product.costPrice.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number(product.dpRate.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number(product.saleRate.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number(product.productQty.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number((product.dpRate * product.productQty).toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number((product.saleRate * product.productQty).toFixed(2)).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold text-md">
                  <td colSpan={6}></td>
                  <td>TOTAL</td>
                  <td>{Number(totalCost.toFixed(2)).toLocaleString('en-IN')}</td>
                  <td></td>
                  <td></td>
                  <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
                  <td>{Number(totalValue.toFixed(2)).toLocaleString('en-IN')}</td>
                  <td>{Number(totalMrp.toFixed(2)).toLocaleString('en-IN')}</td>
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

