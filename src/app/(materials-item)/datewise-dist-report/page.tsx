'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useRouter, useSearchParams } from "next/navigation";
import { FiEdit } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";

type Product = {
    date: string;
    materialsName: string;
    madeItem: string;
    supplierInvoice: string;
    materialsRate: number;
    materialsQty: number;
    materialsId: number;

};

const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const router = useRouter();
    const searchParams = useSearchParams();
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [groupView, setGroupView] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product>();
    const [updatedQty, setUpdatedQty] = useState<number | "">("");
    const [updatedRate, setUpdatedRate] = useState<number | "">("");
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/datewiseSoldRawMaterialsLedger?username=${username}&startDate=${startDate}&endDate=${endDate}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username, startDate, endDate, updatedQty, updatedRate]);

    const handleInvoice = (invoiceNo: string) => {
        router.push(`/materials-invoice?invoiceNo=${encodeURIComponent(invoiceNo)}`);
    };
    const handleEditClick = (product: any) => {
        setSelectedProduct(product);
    };
    const handleRateUpdate = async (productId: number) => {
        if (!updatedRate) {
            toast.warning("Rate is empty !");
            return;
        }
        try {
            const response = await fetch(`${apiBaseUrl}/sales/update-materials-rate/${productId}?username=${username}&newRate=${updatedRate}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setUpdatedRate("");
                toast.success("Update Successful!");
            } else {
                const data = await response.json();
                toast.warning(data.message || "Something went wrong!");
            }
        } catch (error: any) {
            toast.error("Failed to update rate: " + error.message);
        }
    };
    const handleQtyUpdate = async (productId: number) => {
        if (!updatedQty) {
            toast.warning("Quantity is empty !");
            return;
        }
        try {
            const response = await fetch(`${apiBaseUrl}/sales/update-materials-quantity/${productId}?username=${username}&newQty=${updatedQty}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setUpdatedQty("");
                toast.success("Update Successful!");
            } else {
                const data = await response.json();
                toast.warning(data.message || "Something went wrong!");
            }
        } catch (error: any) {
            toast.error("Failed to update quantity: " + error.message);
        }
    };
    const handleProductDelete = async (productId: number) => {
        try {
            const response = await fetch(`${apiBaseUrl}/sales/delete-materials/${productId}?username=${username}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success("Product deleted successfully !");
            } else {
                const data = await response.json();
                toast.warning(data.message || "Failed to delete product!");
            }
        } catch (error: any) {
            toast.error("Error deleting product: " + error.message);
        }
    };
    useEffect(() => {
        const searchText = filterCriteria.toLowerCase().trim();
        let filtered = allProducts;
        if (searchText) {
            // If exact customer match
            const exactMatch = allProducts.filter(
                product => product.madeItem?.toLowerCase() === searchText
            );
            if (exactMatch.length > 0) {
                filtered = exactMatch;
            } else {
                // Build one string containing outlet + product details
                filtered = allProducts.filter(product => {
                    const combinedText = [
                        product.madeItem,
                        product.materialsName,
                        product.supplierInvoice,
                        product.date
                    ]
                        .map(f => f?.toLowerCase() || "")
                        .join(" ");
                    return combinedText.includes(searchText);
                });
            }
        }
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);
    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };
    const totalQty = filteredProducts.reduce((total, product) => {
        return total + product.materialsQty;
    }, 0);

    const totalValue = filteredProducts.reduce((total, product) => {
        return total + product.materialsQty * product.materialsRate;
    }, 0);
    const groupedProducts = Object.values(
        filteredProducts.reduce((acc: any, product) => {
            if (!acc[product.materialsName]) {
                acc[product.materialsName] = {
                    materialsName: product.materialsName,
                    totalQty: 0,
                    totalValue: 0,
                };
            }

            acc[product.materialsName].totalQty += Number(product.materialsQty);
            acc[product.materialsName].totalValue +=
                Number(product.materialsQty) * Number(product.materialsRate);

            return acc;
        }, {})
    );
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
                    <div className="flex gap-2">
                        <button
                            className={`btn btn-sm ${!groupView ? "btn-primary" : "btn-outline"}`}
                            onClick={() => setGroupView(false)}
                        >
                            Details
                        </button>

                        <button
                            className={`btn btn-sm ${groupView ? "btn-primary" : "btn-outline"}`}
                            onClick={() => setGroupView(true)}
                        >
                            Group
                        </button>

                        <button
                            onClick={handlePrint}
                            className="btn btn-ghost btn-square"
                        >
                            <FcPrint size={36} />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <div ref={contentToPrint} className="flex-1 p-5">
                        <div className="flex flex-col items-center pb-5"><h4 className="font-bold">MATERIALS DISTRIBUTION</h4>Date: {startDate} TO {endDate}</div>
                        <table className="table table-sm text-center">

                            <thead>
                                {!groupView ? (
                                    <tr>
                                        <th>SN</th>
                                        <th>DATE</th>
                                        <th>MATERIALS NAME</th>
                                        <th>OUTLET NAME</th>
                                        <th>INVOICE NO</th>
                                        <th>COST PRICE</th>
                                        <th>QTY</th>
                                        <th>SUB TOTAL</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                ) : (
                                    <tr>
                                        <th>SN</th>
                                        <th colSpan={4}>MATERIALS NAME</th>
                                        <th>TOTAL QTY</th>
                                        <th>TOTAL VALUE</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody>
                                {!groupView ? (
                                    filteredProducts.map((product, index) => (
                                        <tr key={index} className="capitalize">
                                            <td>{index + 1}</td>
                                            <td>{product.date}</td>
                                            <td>{product.materialsName}</td>
                                            <td>{product.madeItem}</td>
                                            <td className="uppercase">
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleInvoice(product.supplierInvoice);
                                                    }}
                                                    className="cursor-pointer"
                                                >
                                                    {product.supplierInvoice}
                                                </a>
                                            </td>
                                            <td>{Number(product.materialsRate).toLocaleString("en-IN")}</td>
                                            <td>{Number(product.materialsQty).toLocaleString("en-IN")}</td>
                                            <td>
                                                {Number(
                                                    product.materialsQty * product.materialsRate
                                                ).toLocaleString("en-IN")}
                                            </td>
                                            <td>
                                                <a href="#edit_materials_sale" className="btn btn-xs btn-ghost"> <FiEdit size={16} onClick={() => handleEditClick(product)} /> </a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    groupedProducts.map((product: any, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td colSpan={4}>{product.materialsName}</td>
                                            <td>
                                                {Number(product.totalQty.toFixed(2)).toLocaleString("en-IN")}
                                            </td>
                                            <td>
                                                {Number(product.totalValue.toFixed(2)).toLocaleString("en-IN")}
                                            </td>
                                            <td>
                                                <a href="#edit_materials_sale" className="btn btn-xs btn-ghost"> <FiEdit size={16} onClick={() => handleEditClick(product)} /> </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            <tfoot>
                                {!groupView ? (
                                    <tr className="font-semibold text-lg">
                                        <td colSpan={5}></td>
                                        <td>TOTAL</td>
                                        <td>{Number(totalQty?.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td>{Number(totalValue?.toFixed(2)).toLocaleString('en-IN')}</td>
                                    </tr>
                                ) : (
                                    <tr className="font-semibold text-lg">
                                        <td colSpan={4}></td>
                                        <td>TOTAL</td>
                                        <td>{Number(totalQty?.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td>{Number(totalValue?.toFixed(2)).toLocaleString('en-IN')}</td>
                                    </tr>
                                )}
                            </tfoot>
                        </table>
                    </div>
                </div>

                {selectedProduct && (
                    <div className="modal sm:modal-middle" role="dialog" id="edit_materials_sale">
                        <div className="modal-box gap-5">
                            <h3 className="font-bold text-lg">Edit Product: {selectedProduct.materialsName}</h3>
                            <div className="flex flex-col gap-2 p-3">
                                <p>Outlet: {selectedProduct.madeItem}</p>
                                <p>Sold Invoice: {selectedProduct.supplierInvoice}</p>
                                <p>Sale Rate: {selectedProduct.materialsRate.toLocaleString('en-IN')}
                                    <input className="input input-sm input-bordered ml-2 w-[100px]" type="number" value={updatedRate} name="productRate" onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 0) {
                                        setUpdatedRate(value);
                                    }
                                }} />
                                <button className="btn btn-sm btn-accent ml-3" onClick={() => {
                                        if (window.confirm("Are you sure you want to update this item?")) {
                                            handleRateUpdate(selectedProduct.materialsId);
                                        }
                                    }} >Apply</button>
                                </p>
                                <p>Quantity: {selectedProduct.materialsQty.toFixed(2)}
                                <input className="input input-sm input-bordered ml-2 w-[100px]" type="number" value={updatedQty} name="productQty" onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 0) {
                                        setUpdatedQty(value);
                                    }
                                }} />
                                    <button className="btn btn-sm btn-accent ml-3" onClick={() => {
                                        if (window.confirm("Are you sure you want to update this item?")) {
                                            handleQtyUpdate(selectedProduct.materialsId);
                                        }
                                    }} >Apply</button></p>

                                <p>Total: {((selectedProduct.materialsRate * selectedProduct.materialsQty)).toLocaleString('en-IN')}</p>
                            </div>
                            <div className="flex gap-3 p-3">
                                <button className="btn btn-sm btn-error ml-3" onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this item?")) {
                                        handleProductDelete(selectedProduct.materialsId);
                                    }
                                }} >Delete This Item</button>
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
                )}
            </div>
            <ToastContainer autoClose={1000} theme="dark" />
        </div>
    )
}

export default Page