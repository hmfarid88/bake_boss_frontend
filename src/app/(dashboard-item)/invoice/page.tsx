"use client"
import React, { useRef, useEffect, useState } from 'react'
import { useAppSelector } from "@/app/store";
import { useReactToPrint } from 'react-to-print';
import { FcPrint, FcPlus, FcDataSheet} from "react-icons/fc";
import Link from 'next/link';
import Loading from '@/app/loading';
import { useSearchParams } from 'next/navigation';
import { IoLocationOutline } from 'react-icons/io5';
import { FaPhoneVolume } from 'react-icons/fa';
import { AiOutlineMail } from 'react-icons/ai';

const Invoice = () => {
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });

    const searchParams = useSearchParams();
    const invoiceNo = searchParams.get('invoiceNo');
    const [invoiceData, setInvoiceData] = useState<invoiceData[]>([]);

    interface invoiceData {
        date: string,
        category: string,
        productName: string,
        dpRate: number,
        productQty: number,
        customer: string,
        invoiceNo: number,

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
        if (username && invoiceNo) {
            fetch(`${apiBaseUrl}/api/getInvoiceData?username=${username}&invoiceNo=${invoiceNo}`)
                .then(response => response.json())
                .then(data => {
                    setInvoiceData(data);
                })
                .catch(error => console.error('Error fetching invoice data:', error));
        }
    }, [apiBaseUrl, username, invoiceNo]);


    if (!invoiceData) {
        return <div><Loading /></div>;
    }

    const subtotal = invoiceData.reduce((acc, item) => acc + item.dpRate*item.productQty, 0);
    const totalQty = invoiceData.reduce((acc, item) => acc + item.productQty, 0);

    return (
        <div className="container min-h-[calc(100vh-228px)]">
            <div className="flex justify-end pr-10 pt-5 gap-3">
                <Link href="/dp-dist">  <button className='btn btn-ghost btn-square'><FcPlus size={36} /></button></Link>
                <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
            </div>
            <div className="flex justify-center pb-5">
                <div className='flex-1 max-w-[794px] h-auto border border-slate-700'>
                <div ref={contentToPrint} className="flex-1 max-w-[794px] h-auto p-5 sm:p-10">
                    <div className="flex w-full justify-between">
                        <h1><FcDataSheet className='text-black' size={50} /></h1>
                        <h1 className='tracking-widest text-black font-bold text-sm md:text-xl'>INVOICE</h1>
                    </div>
                    <div className="flex flex-col w-full justify-end items-end">
                            <h1 className='uppercase text-black text-sm md:text-md'>{shopInfo?.shopName}</h1>
                            <h4 className='flex font-sans text-xs md:text-md'><IoLocationOutline className='mt-0.5 mr-1'/> {shopInfo?.address}</h4>
                            <h4 className='flex font-sans text-xs md:text-md'><FaPhoneVolume className='mt-0.5 mr-1' /> {shopInfo?.phoneNumber}</h4>
                            <h4 className='flex font-sans text-xs md:text-md'><AiOutlineMail className='mt-0.5 mr-1'/> {shopInfo?.email}</h4>
                        </div>
                   
                    <div className="flex w-full justify-between">
                        <div className="flex flex-col">
                            <h2 className='uppercase text-black font-bold text-xs md:text-md'>{invoiceData[0]?.customer}</h2>

                        </div>
                        <div className="flex flex-col items-end">
                            <h4 className='font-semibold text-xs md:text-md uppercase'>Invoice No : {invoiceData[0]?.invoiceNo}</h4>
                            <h4 className='font-semibold text-xs md:text-md uppercase pt-1'>Date : {invoiceData[0]?.date}</h4>
                        </div>
                    </div>
                    <div className="w-full pt-2">
                        <table className="table">
                            <thead>
                                <tr className='border-b-base-content text-xs md:text-md text-black'>
                                    <th className='text-left p-0'>SN</th>
                                    <th>DESCRIPTION</th>
                                    <th>VALUE</th>
                                    <th>QTY(KG/PS)</th>
                                    <th className='text-right pt-3 pr-0'>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody className='text-xs md:text-md capitalize'>
                                {invoiceData?.map((products, index) => (
                                    <tr key={index}>
                                        <td className='text-left p-0'>{index+1}</td>
                                        <td>{products.category}, {products.productName}</td>
                                        <td>{Number(products.dpRate.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td>{Number(products.productQty.toFixed(2))}</td>
                                        <td className='text-right pr-0'>{Number((products.dpRate * products.productQty).toFixed(2)).toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className='text-md text-black'>
                                    <td></td>
                                    <td></td>
                                    <td>TOTAL</td>
                                    <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                    <td className='text-end pr-0'>{Number(subtotal.toFixed(2)).toLocaleString('en-IN')}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                   
                    <div className="flex w-full justify-between">
                        <div className="flex flex-col w-1/2 justify-start pt-10">
                            <div className="font-semibold tracking-widest text-xs md:text-sm mb-0">Signature --------</div>
                        </div>

                    </div>

                </div>
                </div>
            </div>
        </div>
    )
};

export default Invoice