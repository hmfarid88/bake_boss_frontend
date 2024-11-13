"use client"
import React, { useEffect, useState } from 'react'
import Select from "react-select";
import { toast } from 'react-toastify';
import { useAppSelector } from "@/app/store";
import { FiEdit } from 'react-icons/fi';

const DistEdit = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    const [qtyProductId, setQtyProductId] = useState();
    const [updatedQty, setUpdatedQty] = useState('');
    const handleQtyUpdate = async () => {
        if (!qtyProductId || !updatedQty) {
            toast.warning("Please select a customer before updating.");
            return;
        }
        try {
            const response = await fetch(`${apiBaseUrl}/api/updateProductQty?productQty=${encodeURIComponent(updatedQty)}&productId=${encodeURIComponent(qtyProductId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                toast.success("Update Successful!");
                setUpdatedQty('')
            } else {
                const data = await response.json();
                toast.warning(data.message)
            }

        } catch (error: any) {
            toast.error(error)
        }
    }

    const [customer, setCustomer] = useState("");
    const handleOutletUpdate = async (invoiceNo: string) => {
        if (!customer) {
            toast.warning("Please select a customer before updating.");
            return;
        }
        try {
            const response = await fetch(`${apiBaseUrl}/api/updateInvoiceOutletName?invoiceNo=${encodeURIComponent(invoiceNo)}&customer=${encodeURIComponent(customer)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                toast.success("Update Successful!");
            } else {
                const data = await response.json();
                toast.warning(data.message)
            }

        } catch (error: any) {
            toast.error(error)
        }

    }

    const [newProduct, setNewProduct] = useState("");
    const [productId, setProductId] = useState<number | undefined>();
    const handleProductUpdate = async () => {
        if (!productId || !newProduct) {
            toast.warning("Please select a product before updating.");
            return;
        }
        try {
            const response = await fetch(`${apiBaseUrl}/api/updateInvoiceProductName/${encodeURIComponent(productId)}?productName=${encodeURIComponent(newProduct)}&username=${encodeURIComponent(username)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                toast.success("Update Successful!");
            } else {
                const data = await response.json();
                toast.warning(data.message || "Update failed with unknown error.");
            }
        } catch (error) {
            toast.error("An error occurred while updating the product. Please try again later.");
        }
    };

    interface items {
        productId: number,
        invoiceNo: string,
        customer: string,
        productName: string,
        productQty: number,
    }
    interface Product {
        invoiceNo: string,
        customer: string,
    }

    const [invoiceProducts, setInvoiceProducts] = useState<items[]>([]);
    const [productName, setProductsName] = useState([])
    const handleEditClick = async (invoiceNo: string) => {
        try {
            const response = await fetch(`${apiBaseUrl}/api/getInvoiceProducts?invoiceNo=${invoiceNo}`);
            const data = await response.json();
            const transformedData = data.map((item: any) => ({
                value: item.productId,
                label: `${item.productName}, ${Number(item.productQty).toFixed(2)}`

            }));

            setInvoiceProducts(data);
            setProductsName(transformedData);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    const [product, setProducts] = useState<Product[]>([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getEditableDistribution?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username, customer]);

    const [salesuser, setSalesuser] = useState([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/auth/user/getSalesUser`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    value: item.username,
                    label: item.username
                }));
                setSalesuser(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl]);

    const [itemOption, setItemOption] = useState([]);
    useEffect(() => {
        const fetchMadeProducts = () => {
            fetch(`${apiBaseUrl}/api/getMadeProducts`)
                .then(response => response.json())
                .then(data => {
                    const transformedData = data.map((madeItem: any) => ({
                        value: madeItem,
                        label: madeItem
                    }));
                    setItemOption(transformedData);
                })
                .catch(error => console.error('Error fetching products:', error));
        };

        fetchMadeProducts();
    }, [apiBaseUrl]);
    return (

        <div className="flex items-center justify-center">
            <table className='table table-sm'>
                <thead>
                    <tr>
                        <th>SN</th>
                        <th>OUTLET NAME</th>
                        <th>INVOICE NO</th>
                        <th>EDIT</th>
                    </tr>
                </thead>
                <tbody>
                    {product?.map((p, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td className='capitalize'>{p.customer}</td>
                            <td className='uppercase'>{p.invoiceNo}</td>
                            <td><a href="#my_modal_edit_dist" className="btn btn-xs btn-ghost"> <FiEdit size={16} onClick={() => handleEditClick(p.invoiceNo)} /> </a></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {invoiceProducts && (
                <div className="modal sm:modal-middle" role="dialog" id="my_modal_edit_dist">
                    <div className="modal-box gap-5">
                        <h3 className="font-bold text-lg uppercase p-2">INVOICE NO: {invoiceProducts[0]?.invoiceNo}</h3>
                        <div className="flex flex-col gap-2 p-2">
                            <div className="flex w-full justify-between gap-2">
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text-alt">OUTLET NAME</span>
                                    </div>
                                    <p className='capitalize p-1'>{invoiceProducts[0]?.customer}</p>
                                </label>
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text-alt">NEW OUTLET</span>
                                    </div>
                                    <Select className="text-black h-[38px] w-40" onChange={(selectedOption: any) => setCustomer(selectedOption.value)} options={salesuser} />
                                </label>
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text-alt">ACTION</span>
                                    </div>
                                    <button className='btn btn-sm btn-info h-[38px] w-20' onClick={() => {
                                        if (window.confirm("Are you sure you want to update this item?")) {
                                            handleOutletUpdate(invoiceProducts[0]?.invoiceNo);
                                        }
                                    }}>Update</button>
                                </label>
                            </div>
                            <div className="flex flex-col w-full">
                                <div className="divider divider-accent tracking-widest font-bold p-2">Product Update</div>
                            </div>
                            <div className="flex w-full justify-between gap-2">
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text-alt">PRODUCT NAME</span>
                                    </div>
                                    <Select className="text-black h-[38px] w-40" onChange={(selectedOption: any) => setProductId(selectedOption.value)} options={productName} />
                                </label>
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text-alt">NEW PRODUCT</span>
                                    </div>
                                    <Select className="text-black h-[38px] w-40" onChange={(selectedOption: any) => setNewProduct(selectedOption.value)} options={itemOption} />
                                </label>
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text-alt">ACTION</span>
                                    </div>
                                    <button className='btn btn-sm btn-info h-[38px] w-20' onClick={() => {
                                        if (window.confirm("Are you sure you want to update this item?")) {
                                            handleProductUpdate();
                                        }
                                    }}>Update</button>
                                </label>
                            </div>
                            <div className="flex flex-col w-full">
                                <div className="divider divider-accent tracking-widest font-bold p-2">Quantity Update</div>
                            </div>
                            <div className="flex w-full justify-between gap-2">
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text-alt">PRODUCT NAME</span>
                                    </div>
                                    <Select className="text-black h-[38px] w-40" onChange={(selectedOption: any) => setQtyProductId(selectedOption.value)} options={productName} />
                                </label>
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text-alt">NEW QTY</span>
                                    </div>
                                    <input type='number' className='input bg-white text-black h-[38px] w-32' value={updatedQty} onChange={(e: any) => setUpdatedQty(e.target.value)} placeholder='Qty' name='qty' />
                                </label>
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text-alt">ACTION</span>
                                    </div>
                                    <button className='btn btn-sm btn-info h-[38px] w-20' onClick={() => {
                                        if (window.confirm("Are you sure you want to update this item?")) {
                                            handleQtyUpdate();
                                        }
                                    }}>Update</button>
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
            )}

        </div>

    )
}

export default DistEdit