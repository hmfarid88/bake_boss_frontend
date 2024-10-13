'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useSearchParams } from "next/navigation";

type Product = {
    date: string;
    time: string;
    category: string;
    productName: string;
    soldInvoice: string;
    saleRate: number;
    productQty: number;
};

const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    const searchParams = useSearchParams();
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch(`${apiBaseUrl}/sales/getDatewiseVendorSale?username=${username}&startDate=${startDate}&endDate=${endDate}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, startDate, endDate, username]);


    useEffect(() => {
        const filtered = allProducts.filter(product =>
            (product.productName.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.category.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.date.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.soldInvoice.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };
    const totalValue = filteredProducts.reduce((total, product) => {
        return total + (product.saleRate * product.productQty);
    }, 0);
    const totalQty = filteredProducts.reduce((acc, item) => acc + item.productQty, 0);

    return (
        <div className="container-2xl min-h-[calc(100vh-228px)]">
            <div className="flex w-full  p-4 items-center justify-center">
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
                        <div className="flex flex-col w-full items-center justify-center">
                            <h4 className="font-semibold">VENDOR SALES REPORT</h4>
                            <h4>DATE : {startDate} TO {endDate}</h4>
                        </div>
                        <div className="pt-5">
                            <table className="table text-center">
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>DATE</th>
                                        <th>TIME</th>
                                        <th>CATEGORY</th>
                                        <th>PRODUCT NAME</th>
                                        <th>INVOICE NO</th>
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
                                            <td>{product.time}</td>
                                            <td className="capitalize">{product.category}</td>
                                            <td className="capitalize">{product.productName}</td>
                                            <td className="uppercase">{product.soldInvoice}</td>
                                            <td>{Number(product.saleRate.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number(product.productQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number((product.saleRate * product.productQty).toFixed(2)).toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="font-semibold text-lg">
                                        <td colSpan={6}></td>
                                        <td>TOTAL</td>
                                        <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td>{Number((totalValue).toFixed(2)).toLocaleString('en-IN')}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page