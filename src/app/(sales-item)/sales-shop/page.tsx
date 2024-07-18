'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, deleteAllProducts, deleteProduct } from "@/app/store/salesProductSaleSlice";
import { aaddProducts, adeleteAllProducts, adeleteProduct } from "@/app/store/additionalSale";
import Select from "react-select";
import { uid } from 'uid';
import { DatePicker } from 'react-date-picker';
import { toast, ToastContainer } from "react-toastify";
import { FcCalendar, FcManager, FcPhone, FcPlus, FcViewDetails } from "react-icons/fc";
import { FaHandHoldingUsd } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { RiDeleteBin6Line, RiHandCoinLine } from "react-icons/ri";
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const Page: React.FC = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();
    const [date, setDate] = useState<Value>(new Date());
    const [pending, setPending] = useState(false);
    const [total, setTotal] = useState(0);
    const [qtyTotal, setQtyTotal] = useState(0);
    const [addtotal, setAddTotal] = useState(0);
    const [addqtyTotal, setAddQtyTotal] = useState(0);
    const [received, setReceived] = useState('');
    const [returnAmount, setReturnAmount] = useState(0);

    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const saleProducts = useAppSelector((state) => state.salesProduct.products);
    const addsaleProducts = useAppSelector((state) => state.additionalSale.products);
    const dispatch = useAppDispatch();
    const invoiceNo = uid();

    const handleReceivedChange = (e: any) => {
        const receivedValue = e.target.value;
        setReceived(receivedValue);
        const returnAmountValue = receivedValue - total;
        setReturnAmount(returnAmountValue);
    };

    const [selectedProid, setSelectedProid] = useState("");
    const [selectedQty, setSelectedQty] = useState("");
    const numericProductQty: number = Number(selectedQty);

    const [customerName, setCustomerName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [soldBy, setSoldBy] = useState("");

    const [selectedAdditional, setSelectedAdditional] = useState("");
    const [addQty, setAddQty] = useState("");
    const numericAddQty: number = Number(addQty);

    const handleAdditionalSale = async (e: any) => {
        e.preventDefault();
        if (!selectedAdditional || !addQty) {
            toast.error("Field is empty!")
            return;
        }

        try {
            const response = await fetch(`${apiBaseUrl}/additionalStock/getAdditionalByIdAndUsername?id=${selectedAdditional}&username=${username}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            const addSaleData = {
                id: uid(),
                date: maxDate,
                category: data.category,
                productName: data.productName,
                costPrice: data.costPrice,
                saleRate: data.salePrice,
                productQty: numericAddQty,
                status: 'sold',
                username: username
            };
            dispatch(aaddProducts(addSaleData));
            setAddQty("");
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };
    const addproductInfo = addsaleProducts.map(product => ({
        ...product,
        soldInvoice: invoiceNo
    }));
    const finalAdditionalSale = async (e: any) => {
        e.preventDefault();
        if(addproductInfo.length===0){
            toast.error("Your product list is empty!");
            return;
        }
        setPending(true);
        const addsalesRequest = {
            customer: {
                customerName:"customer",
                phoneNumber:"00",
                soldBy:"shop",
                soldInvoice: invoiceNo
            },
            salesItems: addproductInfo,
        };
        try {
            const response = await fetch(`${apiBaseUrl}/sales/outletSale`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(addsalesRequest),
            });

            if (!response.ok) {
                toast.error("Product sale not submitted !");
                return;
            }
          
            dispatch(adeleteAllProducts());
            router.push(`/sales-invoice?soldInvoice=${invoiceNo}`);

        } catch (error: any) {
            toast.error("An error occurred: " + error.message);
        } finally {
            setPending(false);
        }
    }
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
        calculateTotal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saleProducts]);

    useEffect(() => {
        calculateAddTotal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addsaleProducts]);

    useEffect(() => {
        calculateQtyTotal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saleProducts]);

    useEffect(() => {
        calculateAddQtyTotal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addsaleProducts]);

    const calculateTotal = () => {
        const total = saleProducts.reduce((sum, p) => {
            return sum + (p.saleRate * p.productQty);
        }, 0);
        setTotal(total);
    };

    const calculateAddTotal = () => {
        const total = addsaleProducts.reduce((sum, p) => {
            return sum + (p.saleRate * p.productQty);
        }, 0);
        setAddTotal(total);
    };

    const calculateQtyTotal = () => {
        const qtytotal = saleProducts.reduce((sum, p) => {
            return sum + (p.productQty);
        }, 0);
        setQtyTotal(qtytotal);
    };

    const calculateAddQtyTotal = () => {
        const qtytotal = addsaleProducts.reduce((sum, p) => {
            return sum + (p.productQty);
        }, 0);
        setAddQtyTotal(qtytotal);
    };

    const handleDeleteProduct = (id: any) => {
        dispatch(deleteProduct(id));
    };

    const handleadDeleteProduct = (id: any) => {
        dispatch(adeleteProduct(id));
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
                remainingQty: (productData.remainingQty - numericProductQty),
                saleRate: productData.saleRate,
                productQty: numericProductQty,
                status: 'sold',
                username: username
            };
            dispatch(addProducts(saleData));
            setSelectedQty("");
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };
    const productInfo = saleProducts.map(product => ({
        ...product,
        soldInvoice: invoiceNo
    }));

    const handleFinalSubmit = async (e: any) => {
        e.preventDefault();
        if (!customerName) {
            toast.error("Customer field is empty!");
            return;
        }
        if (productInfo.length === 0) {
            toast.error("Your product list is empty!");
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
            dispatch(deleteAllProducts());
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
                    label: item.productName + ", " + item.remainingQty
                }));
                setProductOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    const [additionalOption, setAdditionalOption] = useState([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/additionalStock/getAdditionalProducts?username=${username}`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    value: item.id,
                    label: item.productName + ", " + item.salePrice
                }));
                setAdditionalOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    return (
        <div className='container-2xl min-h-screen'>
            <div className="flex flex-col">
                <div className="flex justify-between font-bold pt-5 px-10 pb-0">
                    <p>DATE : <DatePicker calendarIcon={FcCalendar} className="rounded-md max-w-xs z-20" clearIcon={null} maxDate={new Date()} minDate={new Date()} format='y-MM-dd' onChange={setDate} value={date} /></p>
                    <a href="#my_modal_additional_sale" className="btn btn-circle btn-ghost"><FcPlus size={35} /></a>
                </div>
                <div>
                    <div className="modal sm:modal-middle" role="dialog" id="my_modal_additional_sale">
                        <div className="modal-box">
                            <h4 className="font-bold text-sm pl-4">ADDITIONAL SALE</h4>
                            <div className="flex gap-2 w-full items-center justify-center p-2">
                                <Select className="text-black h-[38px] w-64 z-50" autoFocus={true} onChange={(selectedOption: any) => setSelectedAdditional(selectedOption.value)} options={additionalOption} />
                                <input type="number" value={addQty} onChange={(e: any) => setAddQty(e.target.value)} placeholder="Qty" className="border rounded-md p-2 w-[100px] h-[38px] bg-white text-black" />
                                <button onClick={handleAdditionalSale} disabled={pending} className="btn btn-sm btn-outline btn-success">{pending ? "Adding..." : "ADD"}</button>
                            </div>
                            <div className="overflow-x-auto max-h-96">
                                <table className="table table-pin-rows">
                                    <thead>
                                        <tr>
                                            <th>SN</th>
                                            <th>PRODUCT</th>
                                            <th>UNIT</th>
                                            <th>QTY</th>
                                            <th>TOTAL</th>
                                            <th>ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {addsaleProducts?.map((p, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{p.productName} </td>
                                                <td>{Number(p.saleRate.toFixed(2)).toLocaleString('en-IN')}</td>
                                                <td>{p.productQty}</td>
                                                <td>{Number((p.saleRate * p.productQty).toFixed(2)).toLocaleString('en-IN')}</td>
                                                <td className="flex justify-between gap-3">
                                                    <button onClick={() => {
                                                        handleadDeleteProduct(p.id);
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
                                            <td className="font-semibold">TOTAL</td>
                                            <td className="font-semibold">{addqtyTotal} PS</td>
                                            <td className="font-semibold">{Number(addtotal.toFixed(2)).toLocaleString('en-IN')} TK</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div className="flex items-center justify-center">
                            <label className="form-control w-full max-w-xs">
                                <button onClick={finalAdditionalSale} disabled={pending} className="btn btn-sm btn-success btn-outline  font-bold">{pending ? <span className="loading loading-ring loading-md text-accent"></span> : "SUBMIT"}</button>
                            </label>
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
                <div className="flex flex-col w-full">
                    <div className="divider divider-accent tracking-widest font-bold p-5">SALES AREA</div>
                </div>
                <div className="flex items-center justify-center gap-2 z-10">
                    <Select className="text-black h-[38px] w-64 md:w-96" autoFocus={true} onChange={(selectedOption: any) => setSelectedProid(selectedOption.value)} options={productOption} />
                    <input type="number" className="w-[100px] h-[38px] p-2 bg-white text-black border rounded-md" placeholder="Qty" value={selectedQty} onChange={(e) => setSelectedQty(e.target.value)} />
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
                                {saleProducts?.map((p, index) => (
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
                                    <FcViewDetails size={20} />
                                    <input type="text" className="grow" value={soldBy} onChange={(e: any) => setSoldBy(e.target.value)} placeholder="Sold By" />
                                </label>

                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
                                    <MdAttachMoney size={20} />
                                    <input type="text" className="grow" value={Number(total.toFixed(2)).toLocaleString('en-IN')} placeholder="Total Amount" readOnly />
                                </label>
                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
                                    <FaHandHoldingUsd size={20} />
                                    <input type="text" className="grow" value={received} onChange={handleReceivedChange} placeholder="Received Amount" />
                                </label>
                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
                                    <RiHandCoinLine size={20} />
                                    <input type="text" className="grow" value={returnAmount.toFixed(2)} placeholder="Return Amount" readOnly />
                                </label>

                            </div>

                        </div>
                        <div className="flex">
                            <label className="form-control w-full max-w-xs">
                                <button onClick={handleFinalSubmit} disabled={pending} className="btn btn-success btn-outline  font-bold">{pending ? <span className="loading loading-ring loading-md text-accent"></span> : "SUBMIT"}</button>
                            </label>
                        </div>

                    </div>
                </div>
            </div>
            <ToastContainer autoClose={1000} theme="dark" />
        </div>
    )
}

export default Page