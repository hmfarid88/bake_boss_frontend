'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import CurrentDate from "@/app/components/CurrentDate";
import { MdOutlineEditNote } from "react-icons/md";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Product = {
    materialsId: number;
    date: string;
    supplierName: string;
    supplierInvoice: string;
    materialsName: string;
    averageRate: number;
    remainingQty: number;
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
    const [newprice, setNewprice] = useState('');
    const [newQty, setNewQty] = useState('');
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);


    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getRawMaterialsStock`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, newprice, newQty]);

    const handleRateEdit = async (materialsId: number) => {
        if (!materialsId || !newprice) {
            toast.warning("Product value is required!");
            return;
        }
        try {
            const response = await fetch(
                `${apiBaseUrl}/api/materials/average-rate/${materialsId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ averageRate: newprice })
                }
            );

            if (!response.ok) {
                throw new Error(await response.text());
            }
            setNewprice("")
            toast.success("Price updated successfully!");
        } catch (error: any) {
            toast.error(error.message || "Error updating.");
        }
    };

    const handleQtyEdit = async (materialsId: number) => {
        if (!materialsId || !newQty) {
            toast.warning("Product value is required!");
            return;
        }

        try {
            const response = await fetch(
                `${apiBaseUrl}/api/materials/materialsQty/${materialsId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ materialsQty: newQty })
                }
            );

            if (!response.ok) {
                throw new Error(await response.text());
            }
            setNewQty("")
            toast.success("Qty updated successfully!");
        } catch (error: any) {
            toast.error(error.message || "Error updating.");
        }
    };

    useEffect(() => {
        const filtered = allProducts.filter(product =>
            (product.date.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.materialsName.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };
    const totalValue = filteredProducts.reduce((total, product) => {
        return total + product.averageRate * product.remainingQty;
    }, 0);

    const totalQty = filteredProducts.reduce((total, product) => {
        return total + product.remainingQty;
    }, 0);

    return (
        <div className="container-2xl">
            <div className="flex flex-col w-full min-h-[calc(100vh-228px)] p-4 items-center justify-center">
                <div className="flex w-full justify-between pl-5 pr-5 pt-1">
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
                        <div className="flex flex-col items-center pb-5"><h4 className="font-bold">MATERIALS STOCK</h4>
                            <h4><CurrentDate /></h4>
                        </div>
                        <table className="table text-center">
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>DATE</th>
                                    <th>MATERIALS NAME</th>
                                    <th>AVE RATE</th>
                                    <th>QUANTITY</th>
                                    <th>SUB TOTAL</th>
                                    <th>EDIT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts?.map((product, index) => (
                                    <tr key={index} className="capitalize">
                                        <td>{index + 1}</td>
                                        <td>{product.date}</td>
                                        <td>{product.materialsName}</td>
                                        <td>{Number(product.averageRate.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td>{product.remainingQty.toLocaleString('en-IN')}</td>
                                        <td>{Number((product.averageRate * product.remainingQty).toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td><a href="#materialRateChange" onClick={() => setSelectedMaterialId(product.materialsId)} className="btn btn-primary btn-sm"><MdOutlineEditNote size={24} /></a></td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="font-semibold text-lg">
                                    <td colSpan={3}></td>
                                    <td>TOTAL</td>
                                    <td>{totalQty.toLocaleString('en-IN')}</td>
                                    <td>{Number(totalValue.toFixed(2)).toLocaleString('en-IN')}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div className="modal sm:modal-middle" role="dialog" id="materialRateChange">
                    <div className="modal-box">
                        <div className="flex w-full p-2">

                            <div className="flex flex-col w-full gap-3">
                                <label className="flex flex-col gap-2">
                                    <span className="label-text-alt">UPDATE AVE RATE</span>
                                    <input type="number" value={newprice} name="price" onChange={(e: any) => setNewprice(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" />
                                   <label>
                                    <button className="btn btn-success" disabled={selectedMaterialId === null} onClick={() => {
                                        if (selectedMaterialId !== null) {
                                            handleRateEdit(selectedMaterialId);
                                        }
                                    }}>Update
                                    </button>
                                    </label>
                                </label>
                                <label className="flex flex-col gap-2 pt-5">
                                    <span className="label-text-alt">UPDATE QTY</span>
                                    <input type="number" value={newQty} name="qty" onChange={(e: any) => setNewQty(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" />
                                    <label>
                                    <button className="btn btn-success" disabled={selectedMaterialId === null} onClick={() => {
                                        if (selectedMaterialId !== null) {
                                            handleQtyEdit(selectedMaterialId);
                                        }
                                    }}>Update
                                    </button>
                                    </label>
                                </label>

                            </div>

                        </div>
                        <div className="modal-action">
                            <a href="#" className="btn btn-square btn-ghost">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-10 h-10">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page