"use client"
import React, { useState } from 'react'
import { useAppSelector } from "@/app/store";
import { toast } from 'react-toastify';
import { FcPlus } from 'react-icons/fc';

const StockModal = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [pending, setPending] = useState(false);

    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [categoryName, setCategoryName] = useState("");
    const handleCategorySubmit = async (e: any) => {
        e.preventDefault();

        if (!categoryName) {
            toast.warning("Category name is empty !")
            return;
        }
        setPending(true)
        try {
            const response = await fetch(`${apiBaseUrl}/api/addCategoryName`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ categoryName, username }),
            });

            if (response.ok) {
                toast.success("Item added successfully !");
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Invalid product name !")
        } finally {
            setPending(false);
            setCategoryName("");
        }

    };

    const [ingredientsName, setIngredientsName] = useState("");
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
    return (
        <div>
            <h3 className="font-bold text-lg">ADD ITEM</h3>
            <div className="flex w-full items-center justify-center p-2">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">ADD CATEGORY</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <input type="text" value={categoryName} name="colorItem" onChange={(e: any) => setCategoryName(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" required />
                        <button onClick={handleCategorySubmit} disabled={pending} className="btn btn-square btn-success">{pending ? "Adding..." : "ADD"}</button>
                    </div>
                </label>
            </div>

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

        </div>
    )
}

export default StockModal