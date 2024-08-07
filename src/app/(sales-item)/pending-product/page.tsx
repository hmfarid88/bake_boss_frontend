'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { toast } from "react-toastify";
import revalidate from "@/app/revalidate";

type Product = {
    date: string;
    category: string;
    productName: string;
    dpRate: number;
    productQty: number;
    invoiceNo: string;
};


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [pending, setPending] = useState(false);

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);


    useEffect(() => {

        fetch(`${apiBaseUrl}/api/pendingSalesStock?customer=${username}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));

    }, [apiBaseUrl, username]);


    useEffect(() => {
        const filtered = allProducts.filter(product =>
            product.productName.toLowerCase().includes(filterCriteria.toLowerCase()) ||
            product.category.toLowerCase().includes(filterCriteria.toLowerCase()) ||
            product.date.toLowerCase().includes(filterCriteria.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };
    const totalValue = filteredProducts.reduce((total, product) => {
        return total + product.dpRate * product.productQty;
    }, 0);

    const totalQty = filteredProducts.reduce((total, product) => {
        return total + product.productQty;
    }, 0);

    const confirmAndHandleProductAccept = (e: any) => {
        e.preventDefault();
        const isConfirmed = window.confirm("Are you sure to accept the products ?");
        if (isConfirmed) {
            handleProductAccept(e);
        }
    };

    const handleProductAccept = async (e: any) => {
        e.preventDefault();
        if (allProducts.length === 0) {
            toast.warning("Sorry, your product list is empty!");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/addSalesStock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ customer: username }),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            } else {
                toast.success("Products added successfully !");
                revalidate();
            }

        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="container-2xl">
            <div className="flex flex-col w-full min-h-[calc(100vh-228px)] p-4 items-center justify-center">
                <div className="flex">
                    <div className="overflow-x-auto">
                        <div className="flex justify-between pl-5 pr-5">
                            <label className="input input-bordered flex max-w-xs  items-center gap-2">
                                <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                                    <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                                </svg>
                            </label>
                            <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                        </div>
                        <div ref={contentToPrint} className="flex-1 p-5">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>DATE</th>
                                        <th>INVOICE NO</th>
                                        <th>CATEGORY</th>
                                        <th>PRODUCT NAME</th>
                                        <th>PURCHASE RATE</th>
                                        <th>QTY (KG/PS)</th>
                                        <th>SUB TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts?.map((product, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{product.date}</td>
                                            <td className="uppercase">{product.invoiceNo}</td>
                                            <td>{product.category}</td>
                                            <td>{product.productName}</td>
                                            <td>{product.dpRate}</td>

                                            <td>{product.productQty.toLocaleString('en-IN')}</td>
                                            <td>{Number((product.dpRate * product.productQty).toFixed(2)).toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="font-semibold text-lg">
                                        <td colSpan={5}></td>
                                        <td>TOTAL</td>
                                        <td>{totalQty.toLocaleString('en-IN')}</td>
                                        <td>{Number(totalValue.toFixed(2)).toLocaleString('en-IN')}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <button onClick={confirmAndHandleProductAccept} className="btn btn-warning" disabled={pending} >{pending ? "Submitting..." : "ACCEPT PRODUCTS"}</button>
                </div>
            </div>
        </div>
    )
}

export default Page