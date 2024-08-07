"use client"
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Select from "react-select";
import { uid } from "uid";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addMaterials, deleteAllMaterials, deleteMaterials } from "@/app/store/materialSlice";
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FcPlus } from 'react-icons/fc';

const Materials = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [pending, setPending] = useState(false);
    const [materialDate, setMaterialDate] = useState("");
    const [ingredientsName, setIngredientsName] = useState("");
    const [mSupplierName, setMSupplierName] = useState("");
    const [mSupplierInvoice, setMSupplierInvoice] = useState("");
    const [materialsName, setMaterialsName] = useState("");
    const [materialsRate, setMaterialsRate] = useState("");
    const [materialsQty, setMaterialsQty] = useState("");

    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const dispatch = useAppDispatch();
    const addedMaterials = useAppSelector((state) => state.materialProducts.products);

    const [maxDate, setMaxDate] = useState('');
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setMaxDate(formattedDate);
    }, []);

    const handleAddMaterials = (e: any) => {
        e.preventDefault();
        if (!mSupplierName || !mSupplierInvoice || !materialsName || !materialsRate || !materialsQty) {
            toast.warning("Item is empty !");
            return;
        }
        const materialsItem = { id: uid(), date: maxDate, supplierName: mSupplierName, supplierInvoice: mSupplierInvoice, materialsName, materialsRate, materialsQty, username, status: 'stored' };
        dispatch(addMaterials(materialsItem))
        setMaterialsRate('');
        setMaterialsQty('');
    };

    const handleDeleteMaterials = (id: any) => {
        dispatch(deleteMaterials(id));
    };

    const handleFinalMaterialsSubmit = async (e: any) => {
        e.preventDefault();
        if (addedMaterials.length === 0) {
            toast.warning("Sorry, Your item list is empty!");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/addAllMaterials`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(addedMaterials),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            } else {
                dispatch(deleteAllMaterials());
                toast.success("Materials added successfully !");
            }

        } catch (error) {
            toast.error("Invalid product item !")
        } finally {
            setPending(false)
        }
    };

    const [supplierName, setSupplierName] = useState("");
    const handleSupplierItemSubmit = async (e: any) => {
        e.preventDefault();
        if (!supplierName) {
            toast.warning("Item is empty !");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/addSupplierName`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ supplierName, username }),
            });

            if (response.ok) {
                toast.success("Supplier added successfully !");
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Invalid supplier name !")
        } finally {
            setPending(false);
            setSupplierName("");
        }
    };
    const handleIngredientSubmit = async (e: any) => {
        e.preventDefault();
        if (!ingredientsName) {
            toast.warning("Item is empty !");
            return;
        }
        setPending(true)
        try {
            const response = await fetch(`${apiBaseUrl}/api/addMaterialsName`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ materialsName: ingredientsName, username }),
            });
    
            if (response.ok) {
                toast.success("Item added successfully !");
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error: any) {
            toast.error("Sorrry, invalid item name!")
        } finally {
            setPending(false);
            setIngredientsName("");
        }
    };
    const [materialsOption, setMaterialsOption] = useState([]);
    useEffect(() => {

        fetch(`${apiBaseUrl}/api/getMaterialsName?username=${username}`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    value: item.materialsName,
                    label: item.materialsName
                }));
                setMaterialsOption(transformedData);

            })
            .catch(error => console.error('Error fetching products:', error));

    }, [ingredientsName, apiBaseUrl, username]);

    const [supplierOption, setSupplierOption] = useState([]);
    useEffect(() => {

        fetch(`${apiBaseUrl}/api/getSuppliersName?username=${username}`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    value: item.supplierName,
                    label: item.supplierName
                }));
                setSupplierOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));

    }, [supplierName, apiBaseUrl, username]);
    return (

        <div className="flex w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">STOCK DATE</span>
                        </div>
                        <input type="date" name="date" onChange={(e: any) => setMaterialDate(e.target.value)} max={maxDate} value={maxDate} className="border rounded-md p-2 mt-1.5 bg-white text-black  w-full max-w-xs h-[40px]" readOnly />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">SUPPLIER NAME</span>
                            <a href="#my_modal_supplier" className="btn btn-xs btn-circle btn-ghost"><FcPlus size={20} /></a>
                        </div>
                        <Select className="text-black" name="psupplier" onChange={(selectedOption: any) => setMSupplierName(selectedOption.value)} options={supplierOption} required />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">SUPPLIER INVOICE NO</span>
                        </div>
                        <input type="text" name="sinvoice" onChange={(e: any) => setMSupplierInvoice(e.target.value)} placeholder="Type here" className="border rounded-md p-2 mt-1.5  w-full max-w-xs h-[40px] bg-white text-black" required />
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">MATERIALS NAME</span>
                            <a href="#my_modal_materials" className="btn btn-xs btn-circle btn-ghost"><FcPlus size={20} /></a>
                        </div>
                        <Select className="text-black" name="materialsname" onChange={(selectedOption: any) => setMaterialsName(selectedOption.value)} options={materialsOption} />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">RATE (PER KG / PS)</span>
                        </div>
                        <input type="number" name="item" value={materialsRate} onChange={(e: any) => setMaterialsRate(e.target.value)} placeholder="Type here" className="border rounded-md p-2 w-full max-w-xs h-[40px] bg-white text-black" required />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">QTY (KG / PS)</span>
                        </div>
                        <input type="number" name="item" value={materialsQty} onChange={(e: any) => setMaterialsQty(e.target.value)} placeholder="Type here" className="border rounded-md p-2 w-full max-w-xs h-[40px] bg-white text-black" required />
                    </label>

                    <label className="form-control w-full max-w-xs pt-7">
                        <button onClick={handleAddMaterials} className="btn btn-accent btn-sm h-[40px] w-full max-w-xs" >Add Material</button>
                    </label>

                </div>
                <div className="flex w-full">
                    <div className="overflow-x-auto max-h-64">
                        <table className="table table-pin-rows">
                            <thead>
                                <tr className="font-bold">
                                    <th>Date</th>
                                    <th>Supplier</th>
                                    <th>Invoice</th>
                                    <th>Materials</th>
                                    <th>Rate</th>
                                    <th>Qty</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {addedMaterials?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.date}</td>
                                        <td>{item.supplierName}</td>
                                        <td>{item.supplierInvoice}</td>
                                        <td>{item.materialsName}</td>
                                        <td>{item.materialsRate}</td>
                                        <td>{item.materialsQty}</td>
                                        <td>
                                            <button onClick={() => {
                                                handleDeleteMaterials(item.id);
                                            }} className="btn-xs rounded-md btn-outline btn-error"><RiDeleteBin6Line size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex items-center justify-center pt-10">
                            <button onClick={handleFinalMaterialsSubmit} className="btn btn-success btn-outline btn-sm max-w-xs" disabled={pending} >{pending ? "Submitting..." : "Add All Items"}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal sm:modal-middle" role="dialog" id="my_modal_supplier">
                <div className="modal-box">
                    <div className="flex w-full items-center justify-center p-2">
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text-alt">ADD SUPPLIER</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <input type="text" value={supplierName} name="supplierItem" onChange={(e: any) => setSupplierName(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" required />
                                <button onClick={handleSupplierItemSubmit} disabled={pending} className="btn btn-square btn-success">{pending ? "Adding..." : "ADD"}</button>
                            </div>
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
            <div className="modal sm:modal-middle" role="dialog" id="my_modal_materials">
                <div className="modal-box">
                    <div className="flex w-full items-center justify-center p-2">
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text-alt">ADD MATERIALS</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <input type="text" value={ingredientsName} name="productItem" onChange={(e: any) => setIngredientsName(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" required />
                                <button onClick={handleIngredientSubmit} disabled={pending} className="btn btn-square btn-success">{pending ? "Adding..." : "ADD"}</button>
                            </div>
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
    )
}

export default Materials