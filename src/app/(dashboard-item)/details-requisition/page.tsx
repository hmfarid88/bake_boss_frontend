'use client'
import React, { useState, useEffect, useRef } from "react";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/app/store";
import { addMaterials } from "@/app/store/requisitionMaterials";
import { uid } from "uid";
import { toast } from "react-toastify";
import Link from "next/link";
import { PiNotebook } from "react-icons/pi";

type Product = {
    reqId: number;
    date: string;
    productName: string;
    materialsName:string;
    productQty: number;

};

const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const searchParams = useSearchParams();
    const username = searchParams.get('username');
    const dispatch = useAppDispatch();
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getRequisition?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username, allProducts]);

    useEffect(() => {
        const filtered = allProducts.filter(product =>
            (product.date.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.productName.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };

    const totalQty = filteredProducts.reduce((total, product) => {
        return total + product.productQty;
    }, 0);

    const handleProductSubmit = async (productName: string, reqId: number) => {
        try {
            const response = await fetch(`${apiBaseUrl}/api/categoryAndProduct-details?productName=${productName}`);
            if (response.ok) {
                const data = await response.json();
                data.forEach((product: any) => {
                    const numericProductQty = Number(allProducts[0].productQty);
                    const requisitionProduct = {
                        id: uid(),
                        category: product.category,
                        productName: product.productName,
                        materialsName: product.materialsName,
                        qty: product.qty * numericProductQty,
                    };
                    dispatch(addMaterials(requisitionProduct));
                });
                fetch(`${apiBaseUrl}/api/accept?reqId=${reqId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
        } catch (error) {
            toast.error("An error occurred while processing the request.");
        }
    };

    return (
        <div className="container min-h-screen">
            <div className="flex justify-between p-3">
                <label className="input input-bordered flex max-w-xs  items-center gap-2">
                    <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                        <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                    </svg>
                </label>
                <div className="flex gap-5">
                    <Link href="requisition-materials" className="btn btn-sm btn-ghost mt-2"><PiNotebook size={18} />FIND MATERIALS</Link>
                    <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                </div>
            </div>
            <div ref={contentToPrint} className="overflow-x-auto">
                <div className="flex flex-col justify-center items-center p-3 font-bold">
                    <h4>Requisition List</h4>
                    <h4 className="capitalize">Outlet Name: {username}</h4>
                </div>
                <div className="flex items-center justify-center">
                    <div className="flex p-3">
                        <table className="table table-sm text-center">
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>DATE</th>
                                    <th>PRODUCT NAME</th>
                                    <th>QTY</th>
                                    <th>ACTION</th>

                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts?.map((product, index) => (
                                    <tr key={index} className="capitalize">
                                        <td>{index + 1}</td>
                                        <td>{product.date}</td>
                                        <td>{product.productName}</td>
                                        <td>{Number(product.productQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td><button onClick={() => handleProductSubmit(product.productName, product.reqId)} className="btn btn-success btn-sm" >Accept</button></td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="font-bold">
                                    <td colSpan={2}></td>
                                    <td>TOTAL</td>
                                    <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                </tr>
                            </tfoot>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page