'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, deleteAllProducts, deleteProduct } from "@/app/store/salesProductSaleSlice";
import Select from "react-select";
import { uid } from 'uid';
import { DatePicker } from 'react-date-picker';
import { toast, ToastContainer } from "react-toastify";
import { FcCalendar, FcManager, FcPhone, FcViewDetails } from "react-icons/fc";
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


    const [selectedProid, setSelectedProid] = useState("");
    const [selectedQty, setSelectedQty] = useState("");
    const numericProductQty: number = Number(selectedQty);

    const [cname, setCname] = useState("");
    const [phoneNumber, setPhone] = useState("");
    const [soldBy, setSoldBy] = useState("");



    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const saleProducts = useAppSelector((state) => state.salesProductTosale.products);
    const dispatch = useAppDispatch();

    const invoiceNo = uid();

    useEffect(() => {
        calculateTotal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saleProducts]);

    useEffect(() => {
        calculateQtyTotal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saleProducts]);

    const calculateTotal = () => {
        const total = saleProducts.reduce((sum, p) => {
            return sum + (p.saleRate * p.productQty);
        }, 0);
        setTotal(total);
    };

    const calculateQtyTotal = () => {
        const qtytotal = saleProducts.reduce((sum, p) => {
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
                      
            const itemsToSaleData = {
                id: uid(),
                date: data.date,
                category: data.category,
                productName: data.productName,
                costPrice: data.costPrice,
                remainingQty: data.remainingQty,
                saleRate: data.saleRate,
                productQty: numericProductQty,
                status: 'sold',
                username: username
            };
            if (data.remainingQty < numericProductQty) {
                toast.error("Sorry, not enough qty!");
                return;
            }       
            dispatch(addProducts(itemsToSaleData));
            setSelectedQty("");
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };
    const productInfo = saleProducts.map(product => ({
        ...product,
        customer: cname,
        invoiceNo: invoiceNo
    }));

    const handleFinalSubmit = async (e: any) => {
        e.preventDefault();
        if (!cname) {
            toast.error("Please, select any retailer!");
            return;
        }
        if (productInfo.length === 0) {
            toast.error("Your product list is empty!");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/productDistribution`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productInfo),
            });

            if (!response.ok) {
                toast.error("Product sale not submitted !");
                return;
            }
            setCname("");
            dispatch(deleteAllProducts());
            router.push(`/invoice?invoiceNo=${invoiceNo}`);

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
                    label: item.productName + ", " + item.remainingQty + ", " + item.productId
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
                <div className="flex justify-start font-bold pt-5 px-10 pb-0">
                    <p>DATE : <DatePicker calendarIcon={FcCalendar} className="rounded-md max-w-xs z-20" clearIcon={null} maxDate={new Date()} minDate={new Date()} format='y-MM-dd' onChange={setDate} value={date} /></p>
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
                                        {/* <td>{Number(p.saleRate.toFixed(2)).toLocaleString('en-IN')}</td> */}
                                        <td>{p.saleRate} </td>
                                        <td>{p.productQty}</td>
                                        {/* <td>{Number((p.saleRate * p.productQty).toFixed(2)).toLocaleString('en-IN')}</td> */}
                                        <td>{p.saleRate*p.productQty} </td>
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
                                    <input type="text" className="grow" onChange={(e: any) => setCname(e.target.value)} placeholder="Customer Name" />
                                </label>
                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
                                    <FcPhone size={20} />
                                    <input type="text" className="grow" maxLength={11} onChange={(e: any) => setPhone(e.target.value.replace(/\D/g, ""))} value={phoneNumber} placeholder="Mobile Number" />
                                </label>
                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
                                    <FcViewDetails size={20} />
                                    <input type="text" className="grow" onChange={(e: any) => setSoldBy(e.target.value)} placeholder="Sold By" />
                                </label>

                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
                                    <MdAttachMoney size={20} />
                                    <input type="text" className="grow" value={850} placeholder="Total Amount" />
                                </label>
                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
                                    <FaHandHoldingUsd size={20} />
                                    <input type="text" className="grow" maxLength={11}  value={1000}  placeholder="Received Amount" />
                                </label>
                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
                                    <RiHandCoinLine size={20} />
                                    <input type="text" className="grow" value={150}   placeholder="Return Amount" readOnly />
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