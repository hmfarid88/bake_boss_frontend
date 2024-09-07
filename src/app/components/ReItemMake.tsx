"use client"
import React, { useEffect, useState } from 'react'
import { addProductMaterials, deleteMaterial, deleteAllMaterials } from "@/app/store/reItemMakingSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import Select from "react-select";
import { uid } from "uid";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { toast } from 'react-toastify';

const ReItemMake = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [pending, setPending] = useState(false);


    const addedItems = useAppSelector((state) => state.reItemMaterialUse.materials);
    const dispatch = useAppDispatch();
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [ingredientsName, setIngredientsName] = useState("");

    const [productName, setProductName] = useState("");
    const [itemName, setItemName] = useState('');

    const [qty, setQty] = useState('');
    const numericProductQty = Number(qty);
    const itemno = uid();
    const itemMaterials = addedItems.map(product => ({
        ...product,
        itemNo: itemno
    }));

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
    const handleAddItem = async (e: any) => {
        e.preventDefault();
        if (!itemName || !productName || !qty) {
            toast.warning("Item is empty !");
            return;
        }
        const response = await fetch(`${apiBaseUrl}/api/getItemList?username=${username}&itemName=${productName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const updatedItems = data.map((item: any) => ({
            ...item,
            id: uid(),
            itemName: itemName,
            materialsName: item.materialsName,
            qty: item.qty * numericProductQty,
            username: username,
        }));
      
        dispatch(addProductMaterials(updatedItems))
        setQty('');
    };

    const handleDeleteItem = (id: any) => {
        dispatch(deleteMaterial(id));
    };

    const handleFinalItemsSubmit = async (e: any) => {
        e.preventDefault();
        if (addedItems.length === 0) {
            toast.warning("Sorry, Your item list is empty!");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/itemMake`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemMaterials),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            } else {
                dispatch(deleteAllMaterials());
                toast.success("Items added successfully !");
            }

        } catch (error: any) {
            toast.warning("This item is exist")
        } finally {
            setPending(false);
        }
    };

    const [itemOption, setItemOption] = useState([]);
    useEffect(() => {

        fetch(`${apiBaseUrl}/api/getMadeProducts`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((madeItem: any) => ({
                    value: madeItem,
                    label: madeItem
                }));
                setItemOption(transformedData);

            })
            .catch(error => console.error('Error fetching products:', error));

    }, [apiBaseUrl,]);
    
    return (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            <div className="grid grid-cols-1 w-full h-72">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">ITEM NAME</span>
                    </div>
                    <input type="text" name="item" onChange={(e: any) => setItemName(e.target.value)} placeholder="Type here" className="border rounded-md p-2 mt-1.5  w-full max-w-xs h-[40px] bg-white text-black" required />
                </label>
                <label className="form-control w-full pt-2 max-w-xs">
                    <div className="label justify-between">
                        <span className="label-text-alt">PRODUCT NAME</span>
                    </div>
                    <Select className="text-black" name="pname" onChange={(selectedOption: any) => setProductName(selectedOption.value)} options={itemOption} />
                </label>
                <label className="form-control w-full pt-2 max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">QTY (KG / PS)</span>
                    </div>
                    <input type="number" name="qty" value={qty} onChange={(e: any) => setQty(e.target.value)} placeholder="Type here" className="border rounded-md p-2 w-full max-w-xs h-[40px] bg-white text-black" required />
                </label>

                <label className="form-control w-full max-w-xs pt-6">
                    <button onClick={handleAddItem} className="btn btn-accent btn-sm h-[40px] w-full max-w-xs" >Add Item</button>
                </label>
            </div>

            <div className="flex w-full">
                <div className="overflow-x-auto h-auto">
                    <table className="table table-pin-rows">
                        <thead>
                            <tr className="font-bold">
                                <th>SN</th>
                                <th>PRODUCT NAME</th>
                                <th>MATERIALS NAME</th>
                                <th>QTY</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {addedItems.map((item: any, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item?.itemName}</td>
                                    <td>{item?.materialsName}</td>
                                    <td>{item?.qty}</td>
                                    <td><button className="btn-xs rounded-md btn-outline btn-error" onClick={() => handleDeleteItem(item.id)}><RiDeleteBin6Line size={16} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex items-center justify-center pt-10">
                        <button onClick={handleFinalItemsSubmit} className="btn btn-success btn-outline btn-sm max-w-xs" disabled={pending} >{pending ? "Submitting..." : "Add All Items"}</button>
                    </div>

                </div>

            </div>
            {/* modal */}
            <div className="modal sm:modal-middle" role="dialog" id="my_modal_itemMake">
                <div className="modal-box">
                    <div className="flex w-full items-center justify-center p-2">
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text-alt">ADD PRODUCTS</span>
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

export default ReItemMake