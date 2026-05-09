'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

type Product = {
    date: string,
    madeItem: string,
    materialsName: string,
    averageRate: number,
    materialsQty: number,
    supplierInvoice: string
};


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [pending, setPending] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const invoiceNo = searchParams.get('invoiceNo');

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch(`${apiBaseUrl}/invoice/getMaterialsInvoiceData?invoiceNo=${invoiceNo}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username, invoiceNo]);

    useEffect(() => {
        const filtered = allProducts.filter(product =>
            (product.materialsName.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.madeItem.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.date.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };
    const totalValue = filteredProducts.reduce((total, product) => {
        return total + (product?.averageRate ?? 0) * product.materialsQty;
    }, 0);

    const totalQty = filteredProducts.reduce((total, product) => {
        return total + product.materialsQty;
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
            const response = await fetch(`${apiBaseUrl}/api/transferToAdditionnal?madeItem=${username}&supplierInvoice=${invoiceNo}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            } else {
                toast.success("Products added successfully !");
                router.push('/pending-product');
               
            }

        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="container-2xl">
            <div className="flex flex-col w-full min-h-[calc(100vh-228px)] p-4 items-center">
                <div className="flex font-semibold text-lg items-center">
                    <h4>PENDING ADDITIONAL PRODUCT</h4>
                </div>
                <div className="flex flex-col pt-5">

                    <div className="flex justify-between pl-5 pr-5 pt-1">
                        <label className="input input-bordered flex max-w-xs  items-center gap-2">
                            <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                                <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                            </svg>
                        </label>
                        <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                    </div>
                    <div className="overflow-x-auto">
                        <div ref={contentToPrint} className="flex-1 p-5">
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
                                    {filteredProducts?.map((products, index) => (
                                        <tr key={index}>
                                            <td className='text-left p-0'>{index + 1}</td>
                                            <td>{products.materialsName}</td>
                                            <td>{Number((products?.averageRate ?? 0).toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number(products.materialsQty.toFixed(2))}</td>
                                            <td className='text-right pr-0'>{Number((products?.averageRate ?? 0 * products.materialsQty).toFixed(2)).toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className='text-md text-black'>
                                        <td></td>
                                        <td></td>
                                        <td>TOTAL</td>
                                        <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td className='text-end pr-0'>{Number(totalValue.toFixed(2)).toLocaleString('en-IN')}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <button onClick={confirmAndHandleProductAccept} className="btn btn-success" disabled={pending} >{pending ? "Submitting..." : "ACCEPT PRODUCTS"}</button>
                </div>
            </div>
        </div>
    )
}

export default Page