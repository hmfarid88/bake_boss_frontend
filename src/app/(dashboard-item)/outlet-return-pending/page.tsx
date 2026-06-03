'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useRouter } from "next/navigation";
import CurrentDate from "@/app/components/CurrentDate";
import { toast } from "react-toastify";

type Product = {
    productId: number;
    date: string;
    time: string;
    category: string;
    productName: string;
    invoiceNo: string;
    soldInvoice: string;
    username: string;
    saleRate: number;
    costPrice: number;
    productQty: number;
};


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const router = useRouter();
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    const handleSubmit = async (productId: number) => {
        try {
            // Get pending return record
            const response = await fetch(
                `${apiBaseUrl}/sales/outlet-return-pending/${productId}`
            );

            const product = await response.json();

            // Submit to outletStockReturn
            const saveResponse = await fetch(
                `${apiBaseUrl}/sales/outletStockReturn`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify([product])
                }
            );

            if (saveResponse.ok) {
                toast.success("Return accepted successfully");
                // Refresh the list of pending returns                  
                const updatedResponse = await fetch(`${apiBaseUrl}/sales/getAllpendingreturned`);
                const updatedData = await updatedResponse.json();
                setAllProducts(updatedData);
                setFilteredProducts(updatedData);   
            } else {
                toast.error("Failed");
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetch(`${apiBaseUrl}/sales/getAllpendingreturned`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);


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
            <div className="flex flex-col w-full">

                <div className="flex w-full justify-between p-5">

                    <label className="input input-bordered flex max-w-xs  items-center gap-2">
                        <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>
                    </label>
                    <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                </div>

                <div className="flex w-full items-center justify-center">
                    <div className="overflow-x-auto">
                        <div ref={contentToPrint} className="flex-1 p-5">
                            <div className="flex flex-col gap-2 items-center"><h4 className="font-bold text-lg">RETURNED PENDING PRODUCT</h4><CurrentDate /></div>
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>DATE</th>
                                        <th>TIME</th>
                                        <th>OUTLET</th>
                                        <th>CATEGORY</th>
                                        <th>PRODUCT NAME</th>
                                        <th>REASON</th>
                                        <th>SALE PRICE</th>
                                        <th>QUANTITY</th>
                                        <th>SUB TOTAL</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts?.map((product, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{product.date}</td>
                                            <td>{product.time}</td>
                                            <td className="capitalize">{product.username}</td>
                                            <td className="capitalize">{product.category}</td>
                                            <td className="capitalize">{product.productName}</td>
                                            <td className="capitalize">{product.soldInvoice}</td>
                                            <td>{Number(product.saleRate.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{product.productQty.toLocaleString('en-IN')}</td>
                                            <td>{Number((product.saleRate * product.productQty).toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td><button onClick={() => handleSubmit(product.productId)} className="btn btn-sm btn-success">Accept</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="font-semibold text-lg">
                                        <td colSpan={7}></td>
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