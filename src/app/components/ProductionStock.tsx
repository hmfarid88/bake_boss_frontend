"use client"
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Select from "react-select";
import { uid } from "uid";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addMaterials, deleteAllMaterials, deleteMaterials } from "@/app/store/productionStockSlice";
import { RiDeleteBin6Line } from 'react-icons/ri';


const ProductionStock = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [pending, setPending] = useState(false);
    const [materialDate, setMaterialDate] = useState("");
    const [category, setCategory] = useState("");
    const [materialsName, setMaterialsName] = useState("");
    const [materialsQty, setMaterialsQty] = useState("");

    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const dispatch = useAppDispatch();
    const addedMaterials = useAppSelector((state) => state.productionStock.products);

    const [maxDate, setMaxDate] = useState('');
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setMaxDate(formattedDate);
        setMaterialDate(formattedDate);
    }, []);

    const invoiceNo = uid();

    const handleAddMaterials = (e: any) => {
        e.preventDefault();
        if (!materialDate ||!category ||!materialsName ||!materialsQty) {
            toast.warning("Item is empty !");
            return;
        }
        const materialsItem = { id: uid(), date: materialDate, category, materialsName, materialsQty, username, status: 'stored' };
        dispatch(addMaterials(materialsItem))
        setMaterialsQty('');
    };

    const handleDeleteMaterials = (id: any) => {
        dispatch(deleteMaterials(id));
    };
    const productInfo = addedMaterials.map(product => ({
        ...product,
        invoiceNo: invoiceNo
    }));
    const handleFinalMaterialsSubmit = async (e: any) => {
        e.preventDefault();
        if (addedMaterials.length === 0) {
            toast.warning("Sorry, Your item list is empty!");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/production/addProductionMaterials`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productInfo),
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

    }, [apiBaseUrl, username]);
    const [categoryOption, setCategoryOption] = useState([]);
    useEffect(() => {

        fetch(`${apiBaseUrl}/api/getCategoryName?username=${username}`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    value: item.categoryName,
                    label: item.categoryName
                }));
                setCategoryOption(transformedData);

            })
            .catch(error => console.error('Error fetching products:', error));

    }, [apiBaseUrl, username]);

    return (

        <div className="flex w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3">
                <div className="grid grid-cols-1 w-full gap-2 h-96">
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">STOCK DATE</span>
                        </div>
                        <input type="date" name="date" onChange={(e: any) => setMaterialDate(e.target.value)} max={maxDate} value={materialDate} className="border rounded-md p-2 mt-1.5 bg-white text-black  w-full max-w-xs h-[40px]" />
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">CATEGORY</span>
                        </div>
                        <Select className="text-black" name="catagory" onChange={(selectedOption: any) => setCategory(selectedOption.value)} options={categoryOption} />
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">MATERIALS NAME</span>
                        </div>
                        <Select className="text-black" name="materialsname" onChange={(selectedOption: any) => setMaterialsName(selectedOption.value)} options={materialsOption} />
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">QTY (KG / PS)</span>
                        </div>
                        <input type="number" name="item" value={materialsQty} onChange={(e: any) => setMaterialsQty(e.target.value)} placeholder="Type here" className="border rounded-md p-2 w-full max-w-xs h-[40px] bg-white text-black" required />
                    </label>

                    <label className="form-control w-full max-w-xs pt-3">
                        <button onClick={handleAddMaterials} className="btn btn-accent btn-sm h-[40px] w-full max-w-xs" >Add Material</button>
                    </label>
                </div>

                <div className="flex w-full">
                    <div className="overflow-x-auto h-auto">
                        <table className="table table-pin-rows">
                            <thead>
                                <tr className="font-bold">
                                    <th>SN</th>
                                    <th>DATE</th>
                                    <th>CATEGORY</th>
                                    <th>MATERIALS</th>
                                    <th>QTY</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {addedMaterials?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.date}</td>
                                        <td>{item.category}</td>
                                        <td>{item.materialsName}</td>
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
                        <div className="flex items-center justify-center pt-7">
                            <button onClick={handleFinalMaterialsSubmit} className="btn btn-success btn-outline btn-sm max-w-xs" disabled={pending} >{pending ? "Submitting..." : "Add All Items"}</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ProductionStock