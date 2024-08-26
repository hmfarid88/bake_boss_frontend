'use client'
import React, { useState, useEffect, useRef } from "react";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useRouter } from "next/navigation";

type info={
    username:string;
    totalQuantity:number;
}
const Page = () => {
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
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const handleDetails = (e: any) => {
        e.preventDefault();
        router.push(`/details-requisition?username=${encodeURIComponent(allProducts[0].username)}`);
    }
    const [allProducts, setAllProducts] = useState<info[]>([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/sum-requisition-qty`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);

            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl]);

    const totalValue = allProducts.reduce((total, product) => {
        return total + product.totalQuantity;
    }, 0);


    return (
        <div className="container-2xl">
            <div className="flex w-full min-h-[calc(100vh-228px)] p-4 items-center justify-center">
                <div className="overflow-x-auto">
                    <div className="flex justify-end pl-5 pr-5">
                        <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                    </div>
                    <div ref={contentToPrint} className="flex-1 p-5">
                        <div className="flex flex-col items-center pb-5"><h4 className="font-bold">REQUISITION LIST</h4>{maxDate}</div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>RETAILER</th>
                                    <th>QTY(KG/PS)</th>
                                    <th>DETAILS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allProducts?.map((product, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className="uppercase">{product.username}</td>
                                        <td>{Number(product.totalQuantity).toFixed(2)}</td>
                                        <td><button onClick={handleDetails} className="btn btn-sm btn-success btn-outline">Details</button></td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="font-semibold text-lg">
                                    <td colSpan={1}></td>
                                    <td>TOTAL</td>
                                    <td>{totalValue}</td>
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