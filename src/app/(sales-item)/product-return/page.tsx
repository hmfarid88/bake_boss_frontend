'use client'
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, deleteAllProducts, deleteProduct } from "@/app/store/salesDamageProduct";
import Select from "react-select";
import { uid } from 'uid';
import { DatePicker } from 'react-date-picker';
import { toast } from "react-toastify";
import { FcCalendar } from "react-icons/fc";
import { RiDeleteBin6Line } from "react-icons/ri";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const Page: React.FC = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [date, setDate] = useState<Value>(new Date());
    const [pending, setPending] = useState(false);
    const [total, setTotal] = useState(0);
    const [qtyTotal, setQtyTotal] = useState(0);

    const [productOption, setProductOption] = useState([]);
    const [selectedProid, setSelectedProid] = useState("");
    const [selectedQty, setSelectedQty] = useState("");
    const numericProductQty: number = Number(selectedQty);
    const [reason, setReason] = useState("");
    const [maxDate, setMaxDate] = useState('');
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setMaxDate(formattedDate);
    }, []);
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const damageProducts = useAppSelector((state) => state.salesDamageProduct.products);
    const filteredProducts = damageProducts.filter((p) => p.username === username);
    const dispatch = useAppDispatch();

    const invoiceNo = uid();

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
            return sum + (p.costPrice * p.productQty);
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
            const productToDamage = {
                id: uid(),
                date: maxDate,
                category: productData.category,
                productName: productData.productName,
                costPrice: productData.costPrice,
                remainingQty: (productData.remainingQty - numericProductQty),
                saleRate: productData.saleRate,
                productQty: numericProductQty,
                status: 'Returned',
                username: username
            };
            if (data.remainingQty < numericProductQty) {
                toast.error("Sorry, not enough qty!");
                return;
            }
            dispatch(addProducts(productToDamage));
            setSelectedQty("");
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };
    const productInfo = filteredProducts.map(product => ({
        ...product,
        soldInvoice: reason,
        invoiceNo: invoiceNo
    }));

    const handleFinalSubmit = async (e: any) => {
        e.preventDefault();
        if (!reason) {
            toast.error("Cause of damage is empty !");
            return;
        }
        if (productInfo.length === 0) {
            toast.error("Your product list is empty!");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/sales/outletStockReturn`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productInfo),
            });

            if (!response.ok) {
                toast.error("Return product not submitted !");
                return;
            }
            toast.success("Product returned successfully")
            setReason("");
            dispatch(deleteAllProducts(username));

        } catch (error: any) {
            toast.error("An error occurred: " + error.message);
        } finally {
            setPending(false);
        }
    };

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


    return (
        <div className='container-2xl min-h-screen'>
            <div className="flex flex-col">
                <div className="flex justify-start font-bold pt-5 px-10 pb-0">
                    <p>DATE : <DatePicker calendarIcon={FcCalendar} className="rounded-md max-w-xs z-20" clearIcon={null} maxDate={new Date()} format='y-MM-dd' onChange={setDate} value={date} /></p>
                </div>
                <div className="flex flex-col w-full">
                    <div className="divider divider-accent tracking-widest font-bold p-5">PRODUCT RETURN</div>
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
                                    <th>COST PRICE</th>
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
                                        <td>{Number(p.costPrice.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td>{p.productQty}</td>
                                        <td>{Number((p.costPrice * p.productQty).toFixed(2)).toLocaleString('en-IN')}</td>
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
                        <div className="card-title text-sm">Add Reason</div>
                        <input type="text" value={reason} className="input input-sm input-bordered" onChange={(e) => setReason(e.target.value)} />
                        <button onClick={handleFinalSubmit} disabled={pending} className="btn btn-sm w-xs h-[38px] btn-success btn-outline font-bold">{pending ? <span className="loading loading-ring loading-md text-accent"></span> : "SUBMIT"}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page