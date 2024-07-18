"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast} from 'react-toastify';
import { LiaHandScissors } from "react-icons/lia";
const CashBook = () => {
    const router = useRouter();
    const [maxDate, setMaxDate] = useState('');

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setMaxDate(formattedDate);
    }, []);
    const [date, setDate] = useState('');
    const handleCashbook = (e: any) => {
        e.preventDefault();
        if (!date) {
            toast.warning("Please, select any date!");
            return;
        }
        router.push(`/sales-cashbook?date=${date}`);
        setDate('');
    }
    return (
        <div className="flex flex-col gap-3 justify-center font-bold">
            <input type='date' className='input input-sm input-success' onChange={(e: any) => setDate(e.target.value)} max={maxDate} />
            <button onClick={handleCashbook} className='btn btn-sm btn-success'><LiaHandScissors size={20} /> GO </button>
        </div>
    )
}

export default CashBook