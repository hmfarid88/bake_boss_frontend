'use client'
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, updateDiscount, deleteAllProducts, deleteProduct } from "@/app/store/salesProductSaleSlice";

import Select from "react-select";
import { uid } from 'uid';
import { DatePicker } from 'react-date-picker';
import { toast, ToastContainer } from "react-toastify";
import { FcCalendar, FcManager, FcPhone, FcViewDetails } from "react-icons/fc";
import { HiCurrencyBangladeshi } from "react-icons/hi";
import { FaHandHoldingMedical } from "react-icons/fa";
import { RiDeleteBin6Line, RiHandCoinLine } from "react-icons/ri";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const Page: React.FC = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();
    const [date, setDate] = useState<Value>(new Date());
    const [dob, setDob] = useState('');
    const [pending, setPending] = useState(false);
    const [total, setTotal] = useState(0);
    const [qtyTotal, setQtyTotal] = useState(0);
    const [received, setReceived] = useState('');
    const [returnAmount, setReturnAmount] = useState(0);


    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const saleProducts = useAppSelector((state) => state.salesProduct.products);
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

    const handleReceivedChange = (e: any) => {
        const receivedValue = e.target.value;
        setReceived(receivedValue);
        const returnAmountValue = receivedValue - total;
        setReturnAmount(returnAmountValue);
    };

    const [selectedProid, setSelectedProid] = useState("");
    const [discount, setDiscount] = useState("");

    const [selectedQty, setSelectedQty] = useState("");
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
    }, []);

    useEffect(() => {
        calculateTotals();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredProducts]);
    const calculateTotals = () => {
        const { total, qtyTotal } = filteredProducts.reduce(
            (acc, p) => ({
                total: acc.total + (p.saleRate * p.productQty) - p.discount,
                qtyTotal: acc.qtyTotal + p.productQty,
            }),
            { total: 0, qtyTotal: 0 }
        );
        setTotal(total);
        setQtyTotal(qtyTotal);
    };

    const handleUpdateDiscount = (id: any) => {
        dispatch(updateDiscount({ id, discount }));
    };

    const handleDeleteProduct = (id: any) => {
        dispatch(deleteProduct(id));
    };

    const fetchProductData = async (productId: string) => {
        try {
            const response = await fetch(`${apiBaseUrl}/sales/getSingleProduct?productId=${productId}&username=${username}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    };

    const handleProductSubmit = async (e: any) => {
        e.preventDefault();
        if (!selectedProid || !selectedQty) {
            toast.error("Field is empty!")
            return;
        }
        const data = await fetchProductData(selectedProid);
        if (!data) return;
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
            remainingQty: (productData.remainingQty - numericProductQty),
            saleRate: productData.saleRate,
            discount: 0,
            productQty: numericProductQty,
            status: 'sold',
            username: username
        };
        dispatch(addProducts(saleData));
        setSelectedQty("");
    };
    const productInfo = filteredProducts.map(product => ({
        ...product,
        soldInvoice: invoiceNo
    }));

    const handleUnitProductSubmit = async (e: any) => {
        e.preventDefault();
        if (!selectedProid) {
            toast.error("Field is empty!")
            return;
        }
        const data = await fetchProductData(selectedProid);
        if (!data) return;
        const productData = data[0];
        if (productData.remainingQty < numericProductQty) {
            toast.warning("Sorry, not enough qty !");
            return;
        }
        if (!productData.qty) {
            toast.warning("Sorry, quantity not seted !");
            return;
        }
        const saleData = {
            id: uid(),
            date: maxDate,
            category: productData.category,
            productName: productData.productName,
            costPrice: productData.costPrice,
            remainingQty: (productData.remainingQty - 1 / productData.qty),
            saleRate: productData.saleRate,
            discount: 0,
            productQty: 1 / productData.qty,
            status: 'sold',
            username: username
        };
        dispatch(addProducts(saleData));
        setSelectedQty("");

    };

    const handleFinalSubmit = async (e: any) => {
        e.preventDefault();

        if (productInfo.length === 0) {
            toast.error("Your product list is empty!");
            return;
        }
        const salesRequest = {
            customer: {
                customerName,
                phoneNumber,
                dob,
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


    return (
        <div className='container-2xl min-h-screen'>
            <div className="flex flex-col">
                <div className="flex justify-between font-bold pt-5 px-10 pb-0">
                    <p>DATE : <DatePicker calendarIcon={FcCalendar} className="rounded-md max-w-xs z-20" clearIcon={null} maxDate={new Date()} minDate={new Date()} format='y-MM-dd' onChange={setDate} value={date} /></p>
                </div>

                <div className="flex flex-col w-full">
                    <div className="divider divider-accent tracking-widest font-bold p-5">SALES AREA</div>
                </div>
                <div className="flex items-center justify-center gap-2 z-10">
                    <Select className="text-black h-[38px] w-64 md:w-96" autoFocus={true} onChange={handleProductSelect} options={productOption} />
                    <input type="number" className="w-[100px] h-[38px] p-2 bg-white text-black border rounded-md" ref={inputRef} placeholder="Qty" value={selectedQty} onChange={(e) => setSelectedQty(e.target.value)} />
                    <button onClick={handleProductSubmit} className='btn btn-outline btn-success btn-sm h-[38px]'>ADD</button>
                    <button onClick={handleUnitProductSubmit} className='btn btn-outline btn-info btn-sm h-[38px]'>UNIT</button>
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
                                    <th>DISCOUNT (%)</th>
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
                                        <td>{Number(p.productQty.toFixed(2))}</td>
                                        <td><input type="number" name="discount" placeholder="0.00" onChange={(e: any) => setDiscount(e.target.value)} className="bg-base-100 w-20 p-1 rounded-md border input-bordered" /></td>
                                        <td>{Number(((p.saleRate * p.productQty) - (p.discount)).toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td className="flex justify-between gap-3">
                                            <button onClick={() => {
                                                handleUpdateDiscount(p.id);
                                            }} className="btn btn-xs btn-success btn-outline">Apply
                                            </button>
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
                                    <td className="text-lg font-semibold">Total</td>
                                    <td className="text-lg font-semibold">{Number(qtyTotal).toFixed(2)}</td>
                                    <td></td>
                                    <td className="text-lg font-semibold">{Number(total.toFixed(2)).toLocaleString('en-IN')} Tk</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
                <div className="flex w-full justify-center p-5">
                    <div className="card shadow shadow-slate-500 w-full gap-3 p-5">
                        <div className="card-title text-sm font-bold tracking-widest">CUSTOMER INFORMATION</div>
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="flex flex-col gap-3">
                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
                                    <FcManager size={20} />
                                    <input type="text" className="grow" value={customerName} onChange={(e: any) => setCustomerName(e.target.value)} placeholder="Customer Name" />
                                </label>
                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
                                    <FcPhone size={20} />
                                    <input type="text" className="grow" maxLength={11} onChange={(e: any) => setPhoneNumber(e.target.value.replace(/\D/g, ""))} value={phoneNumber} placeholder="Mobile Number" />
                                </label>
                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
                                    <FcCalendar size={20} />
                                    <input type="date" className="grow" onChange={(e: any) => setDob(e.target.value)} value={dob} placeholder="Date of Birth" />
                                </label>
                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
                                    <FcViewDetails size={20} />
                                    <input type="text" name="soldby" autoComplete="soldby" className="grow" value={soldBy} onChange={(e: any) => setSoldBy(e.target.value)} placeholder="Sold By" />
                                </label>

                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
                                    <HiCurrencyBangladeshi size={20} />
                                    <input type="text" className="grow" value={Number(total.toFixed(2)).toLocaleString('en-IN')} placeholder="Total Amount" readOnly />
                                </label>
                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
                                    <FaHandHoldingMedical size={20} />
                                    <input type="text" className="grow" value={received} onChange={handleReceivedChange} placeholder="Received Amount" />
                                </label>
                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
                                    <RiHandCoinLine size={20} />
                                    <input type="text" className="grow" value={returnAmount.toFixed(2)} placeholder="Return Amount" readOnly />
                                </label>
                                <label className="form-control w-full max-w-xs">
                                    <button onClick={handleFinalSubmit} disabled={pending} className="btn btn-success btn-outline  font-bold">{pending ? <span className="loading loading-ring loading-md text-accent"></span> : "SUBMIT"}</button>
                                </label>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

            <ToastContainer autoClose={1000} theme="dark" />
        </div>
    )
}

export default Page