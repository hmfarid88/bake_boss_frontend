"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from "@/app/store";
import Select from "react-select";
import { ToastContainer, toast } from 'react-toastify';
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useReactToPrint } from 'react-to-print';
import { FcPrint } from 'react-icons/fc';

type Product = {
    itemName: string;
    materialsName: string;
    qty: number;
    averageRate: number;
};
const Page: React.FC = () => {
    
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

  
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getMaterials/grouped?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    useEffect(() => {
        const terms = filterCriteria.split(',').map(term => term.trim().toLowerCase());
        const filtered = allProducts.filter(product =>
            terms.some(term => product.itemName.toLowerCase().includes(term)) ||
            terms.some(term => product.materialsName.toLowerCase().includes(term))
        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);


    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };
    const totalValue = filteredProducts.reduce((total, product) => {
        return total + (product.qty * product.averageRate);
    }, 0);

    const totalQty = filteredProducts.reduce((total, product) => {
        return total + product.qty;
    }, 0);


    interface items {
        itemId: number,
        itemNo: string,
        itemName: string,
        materialsName: string,
        qty: number,
        averageRate: number
    }

    const [productName, setProductName] = useState("");
    const [itemOption, setItemOption] = useState([]);
    const [items, setItems] = useState<items[]>([]);

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

    const setMaterialChange = (index: number, value: string) => {
        const updatedItems = [...items];
        updatedItems[index].materialsName = value;
        setItems(updatedItems);
    };

    const handleQtyChange = (index: number, value: string) => {
        const updatedItems = [...items];
        updatedItems[index].qty = parseFloat(value) || 0;
        setItems(updatedItems);
    };

    const handleInfoUpdate = async (itemId: number, materialsName: string, qty: number) => {
        if (!materialsName || !qty) {
            toast.warning("Materials name and qty is needed !")
            return;
        }
        try {
            const response = await fetch(`${apiBaseUrl}/api/updateItemMaterials/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ materialsName, qty }),
            });
            if (response.ok) {
                toast.success("Update Successful!");
            } else {
                const data = await response.json();
                toast.warning(data.message)
            }

        } catch (error: any) {
            toast.error(error)
        }

    }
    const handleDeleteItem = async (itemId: number) => {

        try {
            const response = await fetch(`${apiBaseUrl}/api/deleteMaterial/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                toast.success("Delete Successfull !")
                setQty("");
            } else {
                const data = await response.json();
                toast.warning(data.message)
            }

        } catch (error: any) {
            toast.error("Sorry, this item is exist !")
        }
    }
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

    const [materialsName, setMaterialsName] = useState("");
    const [qty, setQty] = useState("");

    const handleItemAdd = async (e: any) => {
        e.preventDefault();
        if (!materialsName || !qty) {
            toast.warning("Item is empty !");
            return;
        }
        const newItem = {
            itemName: items[0].itemName,
            itemNo: items[0].itemNo,
            materialsName: materialsName,
            qty: qty,
            username: username
        }

        try {
            const response = await fetch(`${apiBaseUrl}/api/itemMakeNewAdd`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([newItem]),
            });
            if (response.ok) {
                toast.success("Successfully added !")
                setQty("");
            } else {
                const data = await response.json();
                toast.warning(data.message)
            }

        } catch (error: any) {
            toast.error("Sorry, this item is exist !")
        }
    }
    return (
        <div className='container min-h-screen'>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="flex flex-col w-full items-center justify-center pt-5">
                    <div className="overflow-x-auto">
                        <div className="flex justify-between pl-7 pr-5 pt-1">
                            <label className="input input-bordered flex max-w-xs  items-center gap-2">
                                <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                                    <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                                </svg>
                            </label>
                            <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                        </div>

                        <div ref={contentToPrint} className="flex-1 p-5">
                        <div className="flex flex-col items-center pb-5"><h4 className="font-bold">ITEMS LIST</h4></div>
                            <table className="table table-sm text-center">
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>ITEM NAME</th>
                                        <th>MATERIALS</th>
                                        <th>RATE</th>
                                        <th>QTY</th>
                                        <th>VALUE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts?.map((product, index) => (
                                        <tr key={index} className='capitalize'>
                                            <td>{index + 1}</td>
                                            <td>{product.itemName}</td>
                                            <td>{product.materialsName}</td>
                                            <td>{product.averageRate.toFixed(2)}</td>
                                            <td>{product.qty.toFixed(2)}</td>
                                            <td>{Number((product.qty * product.averageRate).toFixed(2)).toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="font-semibold text-lg">
                                        <td colSpan={3}></td>
                                        <td>TOTAL</td>
                                        <td>{totalQty.toLocaleString('en-IN')}</td>
                                        <td>{Number(totalValue).toLocaleString('en-IN')}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
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
                            <div className="card-title items-center justify-between"><h1 className='uppercase'>{items[0]?.itemName}</h1><a href="#my_modal_itemlist" className="btn btn-circle btn-ghost"><FiEdit size={20} /></a></div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>SN</th>
                                            <th>MATERIALS</th>
                                            <th>KG / PS</th>
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
                        <div className="modal sm:modal-middle" role="dialog" id="my_modal_itemlist">
                            <div className="modal-box">
                                <h3 className="font-bold text-md uppercase">EDIT ITEM : {items[0]?.itemName}</h3>

                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>SN</th>
                                            <th>MATERIALS</th>
                                            <th>QTY (KG / PS)</th>
                                            <th>ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.materialsName} </td>
                                                <td><input type='number' onChange={(e) => handleQtyChange(index, e.target.value)} value={item.qty} className='input-sm form-control border w-24' /></td>
                                                <td className="flex justify-between gap-3">
                                                    <button onClick={() => {
                                                        if (window.confirm("Are you sure you want to update this item?")) {
                                                            handleInfoUpdate(item.itemId, item.materialsName, item.qty);
                                                        }
                                                    }}
                                                        className="btn-xs rounded-md btn-outline btn-success"> <FiEdit size={18} />
                                                    </button>
                                                    <button onClick={() => {
                                                        if (window.confirm("Are you sure you want to delete this item?")) {
                                                            handleDeleteItem(item.itemId);
                                                        }
                                                    }}
                                                        className="btn-xs rounded-md btn-outline btn-error"> <RiDeleteBin6Line size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex flex-col gap-2 pt-10 items-center justify-center">
                                    <label><span>ADD NEW ITEM</span> </label>
                                    <Select className="text-black h-[32px] w-[200px]" name="materialsname" onChange={(selectedOption: any) => setMaterialsName(selectedOption.value)} options={materialsOption} />
                                    <input type='number' value={qty} onChange={(e: any) => setQty(e.target.value)} className='input-sm  w-[200px] mt-2 rounded-md bg-white text-black' placeholder='QTY' />
                                    <button onClick={handleItemAdd} className='btn btn-success btn-sm w-[200px]'>ADD</button>
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
            </div>
            <ToastContainer autoClose={1000} theme='dark' />
        </div>
    );
};

export default Page;
