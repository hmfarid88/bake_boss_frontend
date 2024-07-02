"use client"
import React, { useRef, useEffect, useState } from 'react'
import { useAppSelector } from "@/app/store";
import { useReactToPrint } from 'react-to-print';
import { FcPrint, FcPlus, FcDataSheet} from "react-icons/fc";
import Link from 'next/link';
import Loading from '@/app/loading';
import { useSearchParams } from 'next/navigation';

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
                <Link href="/sale">  <button className='btn btn-ghost btn-square'><FcPlus size={36} /></button></Link>
                <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
            </div>
            <div className="flex justify-center pb-5">
                <div className='flex-1 max-w-[794px] h-auto border border-slate-700'>
                <div ref={contentToPrint} className="flex-1 max-w-[794px] h-auto p-5 sm:p-10">
                    <div className="flex w-full justify-between">
                        <h1><FcDataSheet size={50} /></h1>
                        <h1 className='tracking-widest font-bold text-sm md:text-xl'>INVOICE</h1>
                    </div>
                    <div className="flex flex-col w-full justify-end items-end">
                        <h1 className='uppercase font-bold text-xs md:text-md'>BAKE BOSS (PRODUCTION)</h1>
                        <h4 className='font-serif text-xs md:text-md'>Jalkuri, Fatullah</h4>
                        <h4 className='font-serif text-xs md:text-md'>Narayanganj</h4>
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="divider divider-accent tracking-widest text-xs font-semibold mt-0 mb-1">INFORMATION</div>
                    </div>
                    <div className="flex w-full justify-between">
                        <div className="flex flex-col">
                            <h2 className='uppercase font-bold text-xs md:text-md'>{invoiceData[0]?.customer}</h2>

                        </div>
                        <div className="flex flex-col items-end">
                            <h4 className='font-semibold text-xs md:text-md uppercase'>Invoice No : {invoiceData[0]?.invoiceNo}</h4>
                            <h4 className='font-semibold text-xs md:text-md uppercase pt-1'>Date : {invoiceData[0]?.date}</h4>
                        </div>
                    </div>
                    <div className="w-full pt-2">
                        <table className="table">
                            <thead>
                                <tr className='border-b-base-content text-xs md:text-md font-bold'>
                                    <th className='text-left p-0'>DESCRIPTION</th>
                                    <th>VALUE</th>
                                    <th>QTY</th>
                                    <th className='text-right pt-3 pr-0'>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody className='text-xs md:text-md uppercase'>
                                {invoiceData?.map((products, index) => (
                                    <tr key={index}>
                                        <td className='text-left p-0'>{products.category} {products.productName}</td>
                                        <td>{products.dpRate.toLocaleString('en-IN')}.00</td>
                                        <td>{products.productQty}</td>
                                        <td className='text-right pr-0'>{(products.dpRate * products.productQty).toLocaleString('en-IN')}.00</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className='text-md font-bold'>
                                    <td></td>
                                    <td>TOTAL</td>
                                    <td>{totalQty.toLocaleString('en-IN')}</td>
                                    <td className='text-end pr-0'>{subtotal.toLocaleString('en-IN')}.00</td>
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