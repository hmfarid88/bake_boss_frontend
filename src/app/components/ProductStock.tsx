"use client"
import React, { useEffect, useState } from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import Select from "react-select";
import { uid } from "uid";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, deleteProduct, deleteAllProducts } from "@/app/store/productSlice";
import { toast } from 'react-toastify';
import { FcPlus } from 'react-icons/fc';

const ProductStock = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [pending, setPending] = useState(false);

    const dispatch = useAppDispatch();
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    const products = useAppSelector((state) => state.products.products);

    const [maxDate, setMaxDate] = useState('');
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setMaxDate(formattedDate);
    }, []);

    const [stockDate, setStockDate] = useState("");
    const [category, setCategory] = useState("");
    const [productName, setProductName] = useState("");

    interface items {
        itemName: string,
        qty: number,
        averageRate: number,
        remainingQty: number,
        materialsName: string
    }
    interface MarginSetup {
        dpMargin: number;
        rpMargin: number;
    }
    const [items, setItems] = useState<items[]>([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getItemList?username=${username}&itemName=${productName}`)
            .then(response => response.json())
            .then(data => {
                setItems(data);
            })
            .catch(error => {
                // toast.error("Failed to fetch items.");
            });
    }, [apiBaseUrl, productName, username]);
    const [marginSetup, setMarginSetup] = useState<MarginSetup | null>(null);
    useEffect(() => {
        const fetchMarginSetup = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/paymentApi/getMargin?username=${username}&productName=${productName}`);
                if (response.ok) {
                    const data = await response.json();
                    setMarginSetup(data);
                }
            } catch (error) {
                // toast.error("Error fetching margin setup.");
            }
        };

        if (username !== 'Guest') {
            fetchMarginSetup();
        }
    }, [apiBaseUrl, username, productName]);

    const calculateCost = () => {
        return items.reduce((cost, item) => cost + (item.averageRate * item.qty), 0);
    };

    const calculateDp = () => {
        if (!marginSetup) {
            return 0;
        }

        return items.reduce((dp, item) =>
            dp + ((item.averageRate * item.qty) + ((item.averageRate * item.qty * marginSetup.dpMargin) / 100)), 0

        );
    };

    const calculateRp = () => {
        if (!marginSetup) {
            return 0;
        }
        return items.reduce((rp, item) =>
            rp + ((item.averageRate * item.qty) + ((item.averageRate * item.qty * marginSetup.rpMargin) / 100)), 0);

    };
    const [newItemName, setNewItemName] = useState("");
    const [oldItemName, setOldItemName] = useState("");
    const handleItemNameUpdate = async (e: any) => {
        e.preventDefault();
        if (!newItemName || !oldItemName) {
            toast.warning("Name is empty !");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/updateItemName?username=${encodeURIComponent(username)}&oldItemName=${encodeURIComponent(oldItemName)}&newItemName=${encodeURIComponent(newItemName)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                toast.success("Item updated successfully!");
                setNewItemName("");
            } else {
                const data = await response.json();
                toast.error(data.message || "Failed to update item.");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again!");
        } finally {
            setPending(false);
        }
    };
    const handleItemNameDelete = async (e: any) => {
        e.preventDefault();
        if (!oldItemName) {
            toast.warning("Name is empty !");
            return;
        }

        try {
            const response = await fetch(`${apiBaseUrl}/api/deleteItemName?username=${encodeURIComponent(username)}&itemName=${encodeURIComponent(oldItemName)}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                toast.success("Item deleted successfully!");
          
            } else {
                const data = await response.json();
                toast.error(data.message || "Failed to delete item.");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again!");
        }
    };

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
    const pid = uid();

    const handleProductStock = (e: any) => {
        e.preventDefault();
        if (!stockDate || !category || !productName) {
            toast.warning("Item is empty !");
            return;
        } else if (calculateCost() <= 0) {
            toast.warning('Not enough materials for this item !');
            return;
        } else if (calculateDp() <= 0 || calculateRp() <= 0) {
            toast.warning('DP Rate & RP Rate not added !');
            return;
        }
        const product = { id: pid, date: stockDate, category, productName, costPrice: calculateCost().toFixed(2), dpRate: calculateDp().toFixed(2), rpRate: calculateRp().toFixed(2), productQty: '0', username, status: 'stored' }
        dispatch(addProducts(product));

    }
    const handleDeleteProduct = (id: any) => {
        dispatch(deleteProduct(id));
    };

    const handleFinalStockSubmit = async (e: any) => {
        e.preventDefault();
        if (products.length === 0) {
            toast.warning("Sorry, your product list is empty!");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/addAllProducts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(products),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            } else {
                dispatch(deleteAllProducts());
                toast.success("Product added successfully !");
            }

        } catch (error) {
            toast.error("Invalid product item !")
        } finally {
            setPending(false);
        }
    };
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

    }, [categoryName, apiBaseUrl, username]);


    const [itemOption, setItemOption] = useState([]);
    useEffect(() => {

        const fetchMadeProducts = () => {
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
        };

        // Fetch data initially
        fetchMadeProducts();
    }, [apiBaseUrl, newItemName]);

    return (
        <div className="flex w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                <div className="grid grid-cols-1 h-80">
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">STOCK DATE</span>
                        </div>
                        <input type="date" name="date" onChange={(e: any) => setStockDate(e.target.value)} max={maxDate} value={stockDate} className="border rounded-md p-2 mt-1.5 bg-white text-black  w-full max-w-xs h-[40px]" />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">CATEGORY</span>
                            <a href="#my_modal_category" className="btn btn-xs btn-circle btn-ghost"><FcPlus size={20} /></a>
                        </div>
                        <Select className="text-black" name="catagory" onChange={(selectedOption: any) => setCategory(selectedOption.value)} options={categoryOption} />
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">PRODUCT NAME</span>
                            <a href="#my_modal_itemEdit" className="btn btn-xs btn-circle btn-ghost"><FcPlus size={20} /></a>
                        </div>
                        <Select className="text-black" name="pname" onChange={(selectedOption: any) => setProductName(selectedOption.value)} options={itemOption} />
                        <p className="text-xs pt-2">Cost: {calculateCost().toFixed(2)} | Dp: {calculateDp().toFixed(2)} | Rp: {calculateRp().toFixed(2)}</p>
                    </label>

                    <label className="form-control w-full max-w-xs pt-5">
                        <button onClick={handleProductStock} className="btn btn-accent btn-sm h-[40px] w-full max-w-xs" >Add Product</button>
                    </label>
                </div>

                <div className="flex flex-col w-full">
                    <div className="overflow-x-auto h-auto">
                        <table className="table table-pin-rows">
                            <thead>
                                <tr className="font-bold">
                                    <th>SN</th>
                                    <th>Date</th>
                                    <th>Category</th>
                                    <th>Products</th>
                                    <th>Cost</th>
                                    <th>DP</th>
                                    <th>RP</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.date}</td>
                                        <td>{item.category}</td>
                                        <td>{item.productName}</td>
                                        <td>{item.costPrice}</td>
                                        <td>{item.dpRate}</td>
                                        <td>{item.rpRate}</td>
                                        <td>
                                            <button onClick={() => {
                                                handleDeleteProduct(item.id);
                                            }} className="btn-xs rounded-md btn-outline btn-error"><RiDeleteBin6Line size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                    <div className="flex items-center justify-center pt-10">
                        <button onClick={handleFinalStockSubmit} className="btn btn-success btn-outline btn-sm max-w-xs" disabled={pending} >{pending ? "Submitting..." : "Add All Products"}</button>
                    </div>
                </div>
                <div className="modal sm:modal-middle" role="dialog" id="my_modal_category">
                    <div className="modal-box">
                        <div className="flex w-full items-center justify-center p-2">
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text-alt">ADD CATEGORY</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <input type="text" value={categoryName} name="colorItem" onChange={(e: any) => setCategoryName(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" />
                                    <button onClick={handleCategorySubmit} disabled={pending} className="btn btn-square btn-success">{pending ? "Adding..." : "ADD"}</button>
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
                <div className="modal sm:modal-middle" role="dialog" id="my_modal_itemEdit">
                    <div className="modal-box">
                        <div className="flex w-full items-center justify-center p-2">
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text-alt">EDIT PRODUCT NAME</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Select className="text-black" name="pname" onChange={(selectedOption: any) => setOldItemName(selectedOption.value)} options={itemOption} />
                                    <input type="text" value={newItemName} name="colorItem" onChange={(e: any) => setNewItemName(e.target.value)} placeholder="Type here" className="input input-bordered max-w-xs" />
                                    <button onClick={handleItemNameUpdate} disabled={pending} className="btn btn-success">{pending ? "Adding..." : "ADD"}</button>
                                    <button onClick={handleItemNameDelete} className="btn btn-error">DELETE</button>
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
        </div>
    )
}

export default ProductStock