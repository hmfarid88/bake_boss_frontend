'use client'
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, deleteAllProducts, deleteProduct } from "@/app/store/requisitionSlice";
import Select from "react-select";
import { uid } from 'uid';
import { toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";


const Page: React.FC = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [pending, setPending] = useState(false);
    const [qtyTotal, setQtyTotal] = useState(0);

    const [date, setDate] = useState("");
    const [productName, setProductName] = useState("");
    const [productQty, setProductQty] = useState("");
    const numericProductQty: number = Number(productQty);
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
    const requiProducts = useAppSelector((state) => state.requisitionProduct.products);
    const filteredProducts = requiProducts.filter((p) => p.username === username);
    const dispatch = useAppDispatch();

    useEffect(() => {
        calculateQtyTotal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredProducts]);


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
        if (!productName || !productQty) {
            toast.error("Field is empty!")
            return;
        }

        const productToRequi = {
            id: uid(),
            date: maxDate,
            productName: productName,
            productQty: numericProductQty,
            status: 'pending',
            username: username
        };

        dispatch(addProducts(productToRequi));
        setProductQty("");

    };

    const handleFinalSubmit = async (e: any) => {
        e.preventDefault();
        if (filteredProducts.length === 0) {
            toast.warning("Sorry, Your product list is empty !")
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/addRequisition`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filteredProducts),
            });

            if (!response.ok) {
                toast.error("Requisition not submitted !");
                return;
            }
            toast.success("Requisition submitted successfully")
            dispatch(deleteAllProducts(username));

        } catch (error: any) {
            toast.error("An error occurred: " + error.message);
        } finally {
            setPending(false);
        }
    };


    const [productOption, setProductOption] = useState([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getMadeProducts`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((madeItem: any) => ({
                    value: madeItem,
                    label: madeItem
                }));
                setProductOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);


    return (
        <div className='container-2xl min-h-screen'>
            <div className="flex flex-col">
                <div className="flex justify-start font-bold pt-5 px-10 pb-0">
                    <input type="date" className="input input-bordered" value={maxDate} onChange={(e) => setDate(e.target.value)} max={maxDate} readOnly />
                </div>
                <div className="flex flex-col w-full">
                    <div className="divider divider-accent tracking-widest font-bold p-5">PRODUCT REQUISITION</div>
                </div>
                <div className="flex items-center justify-center gap-2 z-10">
                    <Select className="text-black h-[38px] w-64 md:w-96" autoFocus={true} onChange={(selectedOption: any) => setProductName(selectedOption.value)} options={productOption} />
                    <input type="number" className="w-[100px] h-[38px] p-2 bg-white text-black border rounded-md" placeholder="Qty" value={productQty} onChange={(e) => setProductQty(e.target.value)} />
                    <button onClick={handleProductSubmit} className='btn btn-outline btn-success btn-sm h-[38px]'>ADD</button>
                </div>
                <div className="flex items-center justify-center w-full p-5">
                    <div className="overflow-x-auto max-h-96">
                        <table className="table table-pin-rows">
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>DATE</th>
                                    <th>PRODUCT NAME</th>
                                    <th>QTY</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts?.map((p, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{p.date} </td>
                                        <td>{p.productName} </td>
                                        <td>{p.productQty}</td>
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
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            <div className="flex">
                <div className="flex w-full justify-center p-5">
                    <button onClick={handleFinalSubmit} disabled={pending} className="btn btn-sm w-xs h-[38px] btn-success btn-outline font-bold">{pending ? <span className="loading loading-ring loading-md text-accent"></span> : "SUBMIT"}</button>
                </div>
            </div>
        </div>
    )
}

export default Page