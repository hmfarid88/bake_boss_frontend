'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import CurrentMonthYear from "@/app/components/CurrentMonthYear";
import DateToDate from "@/app/components/DateToDate";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

type Product = {
    date: string;
    time: string;
    receiveName: string;
    receiveNote: string;
    amount: number;

};


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [maxDate, setMaxDate] = useState('');
    const router = useRouter();
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setMaxDate(formattedDate);
    }, []);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            toast.warning("Start date and end date required !");
            return;
        }
        // Use the dynamic routePath for navigation
        router.push(`/datewise-management-receive?startDate=${startDate}&endDate=${endDate}&outlet=${outlet}`);
        setStartDate("");
        setEndDate("");
    };
    const searchParams = useSearchParams();
    const outlet = searchParams.get('outlet');

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch(`${apiBaseUrl}/paymentApi/getOfficeReceive?username=${outlet}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, outlet]);


    useEffect(() => {
        const filtered = allProducts.filter(product =>
            (product.receiveName.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.receiveNote.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };
    const totalValue = filteredProducts.reduce((total, product) => {
        return total + product.amount;
    }, 0);


    return (
        <div className="container-2xl">
            <div className="flex flex-col w-full min-h-[calc(100vh-228px)] p-4 items-center justify-center">
                <div className="flex items-center justify-center">
                    <div className="flex">
                        <div className='flex gap-3'>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text-alt">START DATE</span>
                                </div>
                                <input
                                    type="date"
                                    name="date"
                                    onChange={(e: any) => setStartDate(e.target.value)}
                                    max={maxDate}
                                    value={startDate}
                                    className="input input-bordered"
                                />
                            </label>

                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text-alt">END DATE</span>
                                </div>
                                <input
                                    type="date"
                                    name="date"
                                    onChange={(e: any) => setEndDate(e.target.value)}
                                    max={maxDate}
                                    value={endDate}
                                    className="input input-bordered"
                                />
                            </label>

                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text-alt">SEARCH</span>
                                </div>
                                <button onClick={handleSubmit} className='btn btn-success'>{'>>'}</button>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between w-full p-5">
                    <label className="input input-bordered flex max-w-xs  items-center gap-2">
                        <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>
                    </label>

                    <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                </div>
                <div ref={contentToPrint} className="flex-1 p-5">
                    <div className="flex flex-col items-center pb-5">
                        <h4 className="font-bold uppercase">{outlet}</h4>
                        <h4 className="font-bold">OFFICE RECEIVE REPORT</h4>
                        <CurrentMonthYear /></div>
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th>SN</th>
                                <th>DATE</th>
                                <th>TIME</th>
                                <th>RECEIVE NAME</th>
                                <th>RECEIVE NOTE</th>
                                <th>AMOUNT</th>

                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts?.map((product, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{product.date}</td>
                                    <td>{product.time}</td>
                                    <td>{product.receiveName}</td>
                                    <td>{product.receiveNote}</td>
                                    <td>{Number(product.amount.toFixed(2)).toLocaleString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-semibold text-lg">
                                <td colSpan={4}></td>
                                <td>TOTAL</td>
                                <td>{Number(totalValue.toFixed(2)).toLocaleString('en-IN')}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default Page