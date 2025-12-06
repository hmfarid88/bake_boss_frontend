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

    const handleReport = async (e: any) => {
        e.preventDefault();

        if (!outlet) {
            toast.error("Field is empty!");
            return;
        }

        router.push(`/management-profit-report?outlet=${outlet}`);
    };

    return (
        <div className="container-2xl min-h-screen">
            <div className="flex flex-col items-center justify-center p-5">
                <h4 className='text-lg p-5'>Outlet Profit Report</h4>
                <div className="card shadow shadow-slate-500 max-w-lg gap-3 p-5">
                    <div className="card-title text-sm">Select Outlet</div>
                    <Select className="text-black h-[38px] w-64" onChange={(selectedOption: any) => setOutlet(selectedOption.value)} options={salesuser} />
                    <button onClick={handleReport} className="btn w-xs h-[38px] btn-success btn-outline font-bold">GO</button>
                </div>
            </div>

        </div>
    )
}

export default Page