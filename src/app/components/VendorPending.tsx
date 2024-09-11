'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useRouter } from "next/navigation";


type Product = {
    username: string;
    soldInvoice: string;
    productQty: number;

};

const VendorPending = () => {
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

    useEffect(() => {

        fetch(`${apiBaseUrl}/sales/pendingVendorStock?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));

    }, [apiBaseUrl, username]);


    useEffect(() => {
        const filtered = allProducts.filter(product =>
            (product.soldInvoice.toLowerCase().includes(filterCriteria.toLowerCase()) || '')

        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };

    const totalQty = filteredProducts.reduce((total, product) => {
        return total + product.productQty;
    }, 0);

    const handleDetails = (invoiceNo: string) => {
        router.push(`/pending-vendor-details?invoiceNo=${encodeURIComponent(invoiceNo)}`);
    }

    return (

        <div className="overflow-x-auto">
            <div className="flex justify-between pl-5 pr-5 pt-1">
                <label className="input input-bordered flex max-w-xs  items-center gap-2">
                    <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                        <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                    </svg>
                </label>
                <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
            </div>
            <div ref={contentToPrint} className="flex-1 p-5">
                <table className="table text-center">
                    <thead>
                        <tr>
                            <th>SN</th>
                            <th>VENDOR FROM</th>
                            <th>INVOICE NO</th>
                            <th>QTY (KG/PS)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts?.map((product, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="uppercase">{product.username}</td>
                                <td className="uppercase">{product.soldInvoice}</td>
                                <td>{Number(product.productQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                <td><button onClick={() => handleDetails(product.soldInvoice)} className="btn btn-success btn-sm">Details</button></td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="font-semibold text-lg">
                            <td colSpan={2}></td>
                            <td>TOTAL</td>
                            <td>{Number((totalQty).toFixed(2)).toLocaleString('en-IN')}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

    )
}

export default VendorPending