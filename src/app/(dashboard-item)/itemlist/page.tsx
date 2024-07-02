"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from "@/app/store";
import Select from "react-select";
import { ToastContainer, toast } from 'react-toastify';
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

const Page: React.FC = () => {

    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    interface items {
        itemNo: string,
        itemName: string,
        materialsName: string,
        qty: number,
        averageRate: number
    }

    const [productName, setProductName] = useState("");
    const [itemOption, setItemOption] = useState([]);
    const [items, setItems] = useState<items[]>([]);
    const [allItems, setAllItems] = useState([]);
    const HandleItemMake = (e: any) => {
        e.preventDefault();
        if (!productName) {
            toast.error("Select any item first !")
            return;
        }
        fetch(`${apiBaseUrl}/api/getItemList?username=${username}&itemName=${productName}`)
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    toast.error("No materials found for this product !")
                    return;
                } else {
                    setItems(data);
                }
            })
            .catch(error => console.error('Error fetching item list:', error));
    };
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getMadeProducts?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setAllItems(data);
                const transformedData = data.map((madeItem: any) => ({
                    value: madeItem,
                    label: madeItem
                }));
                setItemOption(transformedData);

            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    const calculateTotal = () => {
        return items.reduce((total, item) => total + (item.averageRate * item.qty), 0);
    };

    const handleQtyChange = (index: number, value: string) => {
        const updatedItems = [...items];
        updatedItems[index].qty = parseFloat(value) || 0;
        setItems(updatedItems);
    };

    const handleInfoUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiBaseUrl}/api/updateItemMaterials/${items[0]?.itemNo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(items),
            });
            if (response.ok) {
                toast.success("Update Successfull !")
            } else {
                const data = await response.json();
                toast.warning(data.message)
            }

        } catch (error: any) {
            toast.error(error)
        }

    }
    return (
        <div className='container min-h-screen'>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="flex flex-col w-full items-center justify-center pt-5">
                    <h1 className='text-center items-center justify-center'>ALL ITEMS LIST</h1>
                    <div className="overflow-x-auto pt-5">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th><label><input type="checkbox" className="checkbox" /></label></th>
                                    <th>SN</th>
                                    <th>ITEM NAME</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allItems.map((item: any, index) => (
                                    <tr key={index}>
                                        <th><label> <input type="checkbox" className="checkbox" /></label></th>
                                        <td>{index + 1}</td>
                                        <td>{item}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col w-full items-center pt-5">
                    <h1>ITEM COST</h1>
                    <div className="flex w-full p-5 gap-3 items-center justify-center">
                        <label className="form-control w-full max-w-xs">
                            <Select className="text-black" name="pname" onChange={(selectedOption: any) => setProductName(selectedOption.value)} options={itemOption} />
                        </label>
                        <div className="flex">
                            <button onClick={HandleItemMake} className='btn btn-sm btn-success btn-outline'>GO</button>
                        </div>
                    </div>
                    <div className="flex p-5">
                        <div className="card shadow-slate-700 border shadow-lg p-5">
                            <div className="card-title items-center justify-between"><h1 className='uppercase'>{items[0]?.itemName}</h1><a href="#my_modal_1" className="btn btn-circle btn-ghost"><FiEdit size={20} /></a></div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>SN</th>
                                            <th>MATERIALS</th>
                                            <th>GRAM / PS</th>
                                            <th>RATE</th>
                                            <th>SUB TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.materialsName}</td>
                                                <td>{item.qty.toFixed(2)}</td>
                                                <td>{item.averageRate.toFixed(2)}</td>
                                                <td>{(item.averageRate * item.qty).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan={3}></td>
                                            <td className='font-bold text-lg'>TOTAL</td>
                                            <td className='font-bold text-lg'>{calculateTotal().toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                        {/* modal area */}
                        <div className="modal sm:modal-middle" role="dialog" id="my_modal_1">
                            <div className="modal-box">
                                <h3 className="font-bold text-md uppercase">EDIT ITEM : {items[0]?.itemName}</h3>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>SN</th>
                                            <th>MATERIALS</th>
                                            <th>QTY (GRAM / PS)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.materialsName}</td>
                                                <td><input type='number' onChange={(e) => handleQtyChange(index, e.target.value)} value={item.qty} className='input-sm form-control border w-24' /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex pt-10 items-center justify-center"><button onClick={handleInfoUpdate} className='btn btn-success btn-outline btn-sm'>Update</button></div>
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
                </div>
            </div>
            <ToastContainer theme='dark' />
        </div>
    );
};

export default Page;
