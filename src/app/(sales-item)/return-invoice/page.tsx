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
    invoiceNo: string;
    soldInvoice: string;
    saleRate: number;
    costPrice: number;
    productQty: number;
};


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const searchParams = useSearchParams();
    const invoiceno = searchParams.get('invoiceNo');
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });

    const [allProducts, setAllProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch(`${apiBaseUrl}/sales/getOutletReturnedByInvoice?username=${username}&invoiceNo=${invoiceno}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);

            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username, invoiceno]);

    const totalValue = allProducts.reduce((total, product) => {
        return total + (product.saleRate * product.productQty);
    }, 0);
    const totalQty = allProducts.reduce((acc, item) => acc + item.productQty, 0);
    return (
        <div className="container-2xl min-h-[calc(100vh-228px)]">
            <div className="flex flex-col w-full">

                <div className="flex w-full justify-between p-5">
                    <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                </div>

                <div className="flex w-full items-center justify-center">
                    <div className='flex-1 max-w-[794px] h-auto border border-slate-700'>
                        <div ref={contentToPrint} className="flex-1 max-w-[794px] h-auto p-5 sm:p-8 text-black font-bold">
                            <div className="flex flex-col gap-3 pb-5"><h4 className="font-bold text-lg">RETURNED INVOICE</h4>
                            <h4 className="capitalize text-black">Return From: {username}</h4>
                            </div>
                            <div className="flex justify-between p-3">
                                <h4>Date: {allProducts[0]?.date}</h4>
                                <h4>Time: {allProducts[0]?.time}</h4>
                            </div>
                            <div className="flex justify-between p-3 capitalize">
                                <h4>Invoice No: {allProducts[0]?.invoiceNo}</h4>
                                <h4>Return Cause: {allProducts[0]?.soldInvoice}</h4>
                            </div>
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>CATEGORY</th>
                                        <th>PRODUCT NAME</th>
                                        <th>COST PRICE</th>
                                        <th>SALE PRICE</th>
                                        <th>QTY</th>
                                        <th>SUB TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allProducts?.map((product, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td className="capitalize">{product.category}</td>
                                            <td className="capitalize">{product.productName}</td>
                                            <td>{Number(product.costPrice.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number(product.saleRate.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{product.productQty.toLocaleString('en-IN')}</td>
                                            <td>{Number((product.saleRate * product.productQty).toFixed(2)).toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="font-semibold text-lg">
                                        <td colSpan={4}></td>
                                        <td>TOTAL</td>
                                        <td>{totalQty}</td>
                                        <td>{Number(totalValue.toFixed(2)).toLocaleString('en-IN')}</td>
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