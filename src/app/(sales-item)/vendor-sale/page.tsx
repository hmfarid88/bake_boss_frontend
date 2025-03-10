'use client'
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, deleteAllProducts, deleteProduct } from "@/app/store/vendorSale";
import Select from "react-select";
import { uid } from 'uid';
import { toast, ToastContainer } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";

const Page: React.FC = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();
    const [date, setDate] = useState("");
    const [pending, setPending] = useState(false);
    const [total, setTotal] = useState(0);
    const [qtyTotal, setQtyTotal] = useState(0);

    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const saleProducts = useAppSelector((state) => state.vendorSalesProduct.products);
    const filteredProducts = saleProducts.filter((p) => p.username === username);
    const dispatch = useAppDispatch();
    const invoiceNo = uid();

    const inputRef = useRef<HTMLInputElement>(null);
    const handleProductSelect = (selectedOption: any) => {
        setSelectedProid(selectedOption.value);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const [selectedProid, setSelectedProid] = useState("");
    const [selectedQty, setSelectedQty] = useState<number | "">("");
    const numericProductQty: number = Number(selectedQty);

    const [customerName, setCustomerName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [soldBy, setSoldBy] = useState("");

    const [maxDate, setMaxDate] = useState('');
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setMaxDate(formattedDate);
        setDate(formattedDate);
    }, []);


    useEffect(() => {
        calculateTotal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredProducts]);


    useEffect(() => {
        calculateQtyTotal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredProducts]);


    const calculateTotal = () => {
        const total = filteredProducts.reduce((sum, p) => {
            return sum + (p.saleRate * p.productQty);
        }, 0);
        setTotal(total);
    };


    const calculateQtyTotal = () => {
        const qtytotal = filteredProducts.reduce((sum, p) => {
            return sum + (p.productQty);
        }, 0);
        setQtyTotal(qtytotal);
    };

    const handleDeleteProduct = (id: any) => {
        dispatch(deleteProduct(id));
    };


    const handleProductSubmit = async (e: any) => {
        e.preventDefault();
        if (!selectedProid || !selectedQty) {
            toast.error("Field is empty!")
            return;
        }

        try {
            const response = await fetch(`${apiBaseUrl}/sales/getSingleProduct?productId=${selectedProid}&username=${username}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const productData = data[0];
            if (productData.remainingQty < numericProductQty) {
                toast.error("Sorry, not enough qty!");
                return;
            }
            const saleData = {
                id: uid(),
                date: maxDate,
                category: productData.category,
                productName: productData.productName,
                costPrice: productData.costPrice,
                saleRate: productData.costPrice,
                stockRate: productData.costPrice,
                productQty: numericProductQty,
                status: 'vendor',
                username: username
            };
            dispatch(addProducts(saleData));
            setSelectedQty("");
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };
    const productInfo = filteredProducts.map(product => ({
        ...product,
        soldInvoice: invoiceNo
    }));

    const handleFinalSubmit = async (e: any) => {
        e.preventDefault();
        if (productInfo.length === 0) {
            toast.warning("Your product list is empty!");
            return;
        }
        if (!customerName) {
            toast.warning("Outlet name is empty!");
            return;
        }
        const salesRequest = {
            customer: {
                customerName,
                phoneNumber,
                soldBy,
                soldInvoice: invoiceNo
            },
            salesItems: productInfo,
        };
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/sales/outletSale`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(salesRequest),
            });

            if (!response.ok) {
                toast.error("Product sale not submitted !");
                return;
            }
            setCustomerName("");
            setPhoneNumber("");
            setSoldBy("");
            dispatch(deleteAllProducts(username));
            router.push(`/sales-invoice?soldInvoice=${invoiceNo}`);

        } catch (error: any) {
            toast.error("An error occurred: " + error.message);
        } finally {
            setPending(false);
        }
    };

    const [productOption, setProductOption] = useState([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/sales/getSalesStock?username=${username}`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    value: item.productId,
                    label: `${item.productName}, ${Number(item.remainingQty).toFixed(2)}`
                }));
                setProductOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

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

    return (
        <div className='container-2xl min-h-screen'>
            <div className="flex flex-col">
                <div className="flex pt-5 px-10 pb-0">
                    <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)} max={maxDate} value={date} className="input input-ghost" />
                </div>

                <div className="flex flex-col w-full">
                    <div className="divider divider-accent tracking-widest font-bold p-5">VENDOR SALE AREA</div>
                </div>
                <div className="flex items-center justify-center gap-2 z-10" onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleProductSubmit(e);
                    }
                }}>
                    <Select className="text-black h-[38px] w-64 md:w-96" autoFocus={true} onChange={handleProductSelect} options={productOption} />
                    <input type="number" className="w-[100px] h-[38px] p-2 bg-white text-black border rounded-md" placeholder="Qty" ref={inputRef} value={selectedQty}   onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 0) {
                                setSelectedQty(value);
                            }
                        }} />
                    <button onClick={handleProductSubmit} className='btn btn-outline btn-success btn-sm h-[38px]'>ADD</button>
                </div>
                <div className="flex items-center justify-center w-full p-5">
                    <div className="overflow-x-auto max-h-96">
                        <table className="table table-pin-rows">
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>DESCRIPTION</th>
                                    <th>UNIT RATE</th>
                                    <th>QTY</th>
                                    <th>SUB TOTAL</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts?.map((p, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{p.productName} </td>
                                        <td>{Number(p.saleRate.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td>{p.productQty}</td>
                                        <td>{Number((p.saleRate * p.productQty).toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td className="flex justify-between gap-3">
                                            <button onClick={() => {
                                                handleDeleteProduct(p.id);
                                            }} className="btn-xs rounded-md btn-outline btn-error"> <RiDeleteBin6Line size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td className="text-lg font-semibold">TOTAL</td>
                                    <td className="text-lg font-semibold">{qtyTotal} PS</td>
                                    <td className="text-lg font-semibold">{Number(total.toFixed(2)).toLocaleString('en-IN')} TK</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
                <div className="flex w-full justify-center p-5">
                    <div className="card shadow shadow-slate-500 max-w-lg gap-3 p-5">
                        <div className="card-title text-sm">Select Outlet</div>
                        <Select className="text-black h-[38px] w-64" onChange={(selectedOption: any) => setCustomerName(selectedOption.value)} options={salesuser} />
                        <button onClick={handleFinalSubmit} disabled={pending} className="btn w-xs h-[38px] btn-success btn-outline font-bold">{pending ? <span className="loading loading-ring loading-md text-accent"></span> : "SUBMIT"}</button>
                    </div>
                </div>
            </div>

            <ToastContainer autoClose={1000} theme="dark" />
        </div>
    )
}

export default Page