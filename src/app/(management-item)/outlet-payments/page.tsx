"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Select from "react-select";
import { toast } from 'react-toastify';
const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [salesuser, setSalesuser] = useState([]);
    const [outlet, setOutlet] = useState();
    const router = useRouter();
    useEffect(() => {
        fetch(`${apiBaseUrl}/auth/user/getSalesUser`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    value: item.username,
                    label: item.username
                }));
                setSalesuser(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl]);

    const handleExpenseReport = async (e: any) => {
        e.preventDefault();

        if (!outlet) {
            toast.error("Field is empty!");
            return;
        }

        router.push(`/management-expense-report?outlet=${outlet}`);
    };
    const handlePaymentReport = async (e: any) => {
        e.preventDefault();

        if (!outlet) {
            toast.error("Field is empty!");
            return;
        }

        router.push(`/management-payment-report?outlet=${outlet}`);
    };
    const handleReceiveReport = async (e: any) => {
        e.preventDefault();

        if (!outlet) {
            toast.error("Field is empty!");
            return;
        }

        router.push(`/management-receive-report?outlet=${outlet}`);
    };
       
    return (
        <div className="container-2xl min-h-screen">
            <div className="flex items-center justify-between p-5">
                <div className="flex flex-col items-center justify-center p-5">
                    <h4 className='text-lg p-5'>Expense Report</h4>
                    <div className="card shadow shadow-slate-500 max-w-lg gap-3 p-5">
                        <div className="card-title text-sm">Select Outlet</div>
                        <Select className="text-black h-[38px] w-64" onChange={(selectedOption: any) => setOutlet(selectedOption.value)} options={salesuser} />
                        <button onClick={handleExpenseReport} className="btn w-xs h-[38px] btn-success btn-outline font-bold">NEXT</button>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center p-5">
                    <h4 className='text-lg p-5'>Office Payment Report</h4>
                    <div className="card shadow shadow-slate-500 max-w-lg gap-3 p-5">
                        <div className="card-title text-sm">Select Outlet</div>
                        <Select className="text-black h-[38px] w-64" onChange={(selectedOption: any) => setOutlet(selectedOption.value)} options={salesuser} />
                        <button onClick={handlePaymentReport} className="btn w-xs h-[38px] btn-success btn-outline font-bold">NEXT</button>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center p-5">
                    <h4 className='text-lg p-5'>Office Receive Report</h4>
                    <div className="card shadow shadow-slate-500 max-w-lg gap-3 p-5">
                        <div className="card-title text-sm">Select Outlet</div>
                        <Select className="text-black h-[38px] w-64" onChange={(selectedOption: any) => setOutlet(selectedOption.value)} options={salesuser} />
                        <button onClick={handleReceiveReport} className="btn w-xs h-[38px] btn-success btn-outline font-bold">NEXT</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Page