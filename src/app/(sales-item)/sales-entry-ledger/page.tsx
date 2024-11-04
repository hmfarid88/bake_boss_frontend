'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import CurrentMonthYear from "@/app/components/CurrentMonthYear";
import DateToDate from "@/app/components/DateToDate";

type Product = {
    date: string;
    time: string;
    category: string;
    productName: string;
    invoiceNo: string;
    costPrice: number;
    productQty: number;

};


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);


    useEffect(() => {
        fetch(`${apiBaseUrl}/sales/salesStock/thismonth-entry?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);


    useEffect(() => {
        const filtered = allProducts.filter(product =>
            (product.productName.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.category.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.invoiceNo.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.date.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };
    const totalQty = filteredProducts.reduce((total, product) => {
        return total + product.productQty;
    }, 0);
    return (
        <div className="container-2xl min-h-screen">
            <div className="flex flex-col w-full p-4 items-center justify-center">
                <div className="flex w-full justify-between p-5">
                    <DateToDate routePath="/datewise-entry-ledger" />
                    <div className="flex">
                        <label className="input input-bordered flex max-w-xs  items-center gap-2">
                            <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                                <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                            </svg>
                        </label>
                    </div>
                    <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                </div>
                <div ref={contentToPrint} className="flex-1 p-5">
                    <div className="flex flex-col items-center justify-center gap-2 p-3"><h4 className="font-semibold">STOCK ENTRY LEDGER</h4><CurrentMonthYear /></div>
                    <table className="table table-sm capitalize text-center">
                        <thead>
                            <tr>
                                <th>SN</th>
                                <th>DATE</th>
                                <th>TIME</th>
                                <th>INVOICE NO</th>
                                <th>CATEGORY</th>
                                <th>PRODUCT NAME</th>
                                <th>PURCHASE PRICE</th>
                                <th>ENTRY QTY</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts?.map((product, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{product.date}</td>
                                    <td>{product.time}</td>
                                    <td className="uppercase">{product.invoiceNo}</td>
                                    <td className="capitalize">{product.category}</td>
                                    <td className="capitalize">{product.productName}</td>
                                    <td>{product.costPrice.toFixed(2)}</td>
                                    <td>{product.productQty.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-semibold text-lg">
                                <td colSpan={6}></td>
                                <td>TOTAL</td>
                                <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default Page