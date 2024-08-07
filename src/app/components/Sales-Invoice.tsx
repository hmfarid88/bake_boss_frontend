"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const Invoice = () => {
    const router = useRouter();
    const [invoiceNo, setInvoiceNo] = useState("");
    const handleInvoice = (e: any) => {
        e.preventDefault();
        if(!invoiceNo){
            toast.warning("Invoice no is required !");
            return;
        }
        router.push(`/sales-invoice?soldInvoice=${invoiceNo}`);
        setInvoiceNo("");
    }
    return (
        <div className="flex flex-col gap-3 justify-center font-bold">
            <input type='text' value={invoiceNo} className='input input-sm input-success w-[150px]' placeholder='Invoice No' onChange={(e: any) => setInvoiceNo(e.target.value)} />
            <button onClick={handleInvoice} className='btn btn-sm btn-success w-[150px]'> FIND </button>
        </div>
    )
}

export default Invoice