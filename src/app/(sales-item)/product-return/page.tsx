'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, deleteAllProducts, deleteProduct } from "@/app/store/productSaleSlice";
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

    const [productOption, setProductOption] = useState([]);
    const [selectedProid, setSelectedProid] = useState("");
    const [selectedQty, setSelectedQty] = useState("");
    const numericProductQty: number = Number(selectedQty);

    const [cname, setCname] = useState("");
    const [phoneNumber, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const saleProducts = useAppSelector((state) => state.productTosale.products);
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
            return sum + (p.dpRate * p.productQty);
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
            const response = await fetch(`${apiBaseUrl}/api/getSingleProduct?productId=${selectedProid}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const productToSale = {
                id: uid(),
                date: data.date,
                category: data.category,
                productName: data.productName,
                costPrice: data.costPrice,
                dpRate: data.dpRate,
                rpRate: data.rpRate,
                customerPrice: data.customerPrice,
                productQty: numericProductQty,
                remainingQty: data.remainingQty,
                status: 'sold',
                username: username
            };
            if (data.remainingQty < numericProductQty) {
                toast.error("Sorry, not enough qty!");
                return;
            }
            dispatch(addProducts(productToSale));
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

    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getProductStock?username=${username}`)
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
                    <div className="divider divider-accent tracking-widest font-bold p-5">PRODUCT RETURN</div>
                </div>
                <div className="flex flex-col items-center justify-center gap-3">
                    <Select className="text-black h-[38px] w-full max-w-xs" autoFocus={true} onChange={(selectedOption: any) => setSelectedProid(selectedOption.value)} options={productOption} />
                    <input type="number" className="w-full max-w-xs h-[38px] p-2 bg-white text-black border rounded-md" placeholder="Qty" value={selectedQty} onChange={(e) => setSelectedQty(e.target.value)} />
                    <input type="text" className="w-full max-w-xs h-[38px] p-2 bg-white text-black border rounded-md" placeholder="Note" />
                    <button onClick={handleProductSubmit} className='btn btn-outline btn-success  h-[38px]'>RETURN</button>
                </div>
            </div>
        </div>
    )
}

export default Page