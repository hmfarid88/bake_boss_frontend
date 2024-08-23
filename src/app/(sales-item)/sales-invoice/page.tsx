"use client"
import React, { useRef, useEffect, useState } from 'react'
import { useAppSelector } from "@/app/store";
import { useReactToPrint } from 'react-to-print';
import { FcPrint, FcPlus, FcDataSheet } from "react-icons/fc";
import { FaRegHandshake } from "react-icons/fa6";
import Link from 'next/link';
import Loading from '@/app/loading';
import { useSearchParams } from 'next/navigation';
import { IoLocationOutline } from "react-icons/io5";
import { FaPhoneVolume } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";

const Invoice = () => {
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });

    const searchParams = useSearchParams();
    const soldInvoice = searchParams.get('soldInvoice');
    const [invoiceData, setInvoiceData] = useState<invoiceData>();

    interface invoiceData {
        customerInfo: any;
        salesStock: any;
        date: string,
        customerName: string,
        phoneNumber: string,
        soldBy: string,
        soldInvoice: string,
        category: string,
        productName: string,
        saleRate: number,
        productQty: number,

    }
    interface shopData{
        shopName:string,
        phoneNumber:string,
        address:string,
        email:string
    }
    const [shopInfo, setShopInfo] = useState<shopData>();
    useEffect(() => {
        fetch(`${apiBaseUrl}/invoice/getShopInfo?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setShopInfo(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    useEffect(() => {
        if (soldInvoice) {
            fetch(`${apiBaseUrl}/invoice/outletInvoice?soldInvoice=${soldInvoice}`)
                .then(response => response.json())
                .then(data => {
                    setInvoiceData(data);
                })
                .catch(error => console.error('Error fetching invoice data:', error));
        }
    }, [apiBaseUrl, soldInvoice]);

    if (!invoiceData) {
        return <div><Loading /></div>;
    }

    const subtotal = invoiceData.salesStock.reduce((acc: number, item: { saleRate: number; productQty: number; }) => acc + item.saleRate * item.productQty, 0);
    const totalQty = invoiceData.salesStock.reduce((acc: any, item: { productQty: any; }) => acc + item.productQty, 0);


    return (
        <div className="container min-h-[calc(100vh-228px)]">
            <div className="flex justify-end pr-10 pt-5 gap-3">
                <Link href="/sales-shop">  <button className='btn btn-ghost btn-square'><FcPlus size={36} /></button></Link>
                <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
            </div>
            <div className="flex justify-center pb-5">
                <div className='flex-1 max-w-[794px] h-auto border border-slate-700'>
                    <div ref={contentToPrint} className="flex-1 max-w-[794px] h-auto p-5 sm:p-10">
                        <div className="flex w-full justify-between">
                            <h1><FcDataSheet className='font-bold' size={50} /></h1>
                            <h1 className='tracking-widest font-extrabold text-sm md:text-xl'>INVOICE</h1>
                        </div>
                        <div className="flex flex-col w-full justify-end items-end">
                            <h1 className='uppercase font-bold text-sm md:text-md'>{shopInfo?.shopName}</h1>
                            <h4 className='flex font-sans font-bold text-xs md:text-md'><IoLocationOutline className='mt-0.5 mr-1'/> {shopInfo?.address}</h4>
                            <h4 className='flex font-sans font-bold text-xs md:text-md'><FaPhoneVolume className='mt-0.5 mr-1' /> {shopInfo?.phoneNumber}</h4>
                            <h4 className='flex font-sans font-bold text-xs md:text-md'><AiOutlineMail className='mt-0.5 mr-1'/> {shopInfo?.email}</h4>
                        </div>
                        <div className="flex flex-col w-full pt-3">
                            <div className="divider divider-accent tracking-widest text-xs font-bold mt-0 mb-1">INFORMATION</div>
                        </div>
                        <div className="flex w-full justify-between">
                            <div className="flex flex-col">
                                <h2 className='uppercase font-bold text-xs md:text-md'>NAME: {invoiceData.customerInfo.customerName || "Customer"}</h2>
                                <p className='uppercase text-xs font-bold pt-1'>SOLD BY: {invoiceData.customerInfo.soldBy || "Shop"}</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <h4 className='font-bold text-xs md:text-md uppercase'>Invoice No : {invoiceData.customerInfo.soldInvoice}</h4>
                                <h4 className='font-bold text-xs md:text-md uppercase pt-1'>Date : {invoiceData.salesStock[0].date}</h4>
                            </div>
                        </div>
                        <div className="w-full pt-2">
                            <table className="table font-black">
                                <thead>
                                    <tr className='border-b-base-content text-xs md:text-md font-black'>
                                        <th className='text-left p-0'>DESCRIPTION</th>
                                        <th>VALUE</th>
                                        <th>QTY</th>
                                        <th className='text-right pt-3 pr-0'>TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody className='text-xs md:text-md uppercase'>
                                    {invoiceData.salesStock.map((products: any, index: any) => (
                                        <tr key={index}>
                                            <td className='text-left p-0'>{products.category} {products.productName}</td>
                                            <td>{Number(products.saleRate.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{products.productQty}</td>
                                            <td className='text-right pr-0'>{Number((products.saleRate * products.productQty).toFixed(2)).toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className='text-md font-bold'>
                                        <td></td>
                                        <td>TOTAL</td>
                                        <td>{totalQty.toLocaleString('en-IN')}</td>
                                        <td className='text-end pr-0'>{Number(subtotal.toFixed(2)).toLocaleString('en-IN')}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="flex w-full justify-between">
                            <div className="flex flex-col w-1/2 justify-start pt-10">
                                <div className="font-bold tracking-widest text-xs md:text-sm mb-0">Signature --------</div>
                            </div>
                        </div>
                        <div className="flex gap-2 pt-10">
                            <FaRegHandshake size={24} />  <p className='font-bold text-sm'>ধন্যবাদ, আবার আসবেন ।</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
};

export default Invoice