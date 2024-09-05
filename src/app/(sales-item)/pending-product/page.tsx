'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useRouter } from "next/navigation";
import FactoryPending from "@/app/components/FactoryPending";
import VendorPending from "@/app/components/VendorPending";


type Product = {
    productQty: number;
    invoiceNo: string;
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
            (product.invoiceNo.toLowerCase().includes(filterCriteria.toLowerCase()) || '')

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
        router.push(`/pending-product-details?invoiceNo=${encodeURIComponent(invoiceNo)}`);
    }

    return (
        <div className="container-2xl">
            <div className="flex flex-col w-full min-h-[calc(100vh-228px)] p-4 items-center">
                <div className="flex font-semibold text-lg items-center">
                    <h4>PENDING PRODUCT</h4>
                </div>
                <div role="tablist" className="tabs tabs-bordered p-3">
                    <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="FACTORY PENDING" defaultChecked />
                    <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                        <FactoryPending />
                    </div>
                    <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="VENDOR PENDING" />
                    <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                        <VendorPending />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Page