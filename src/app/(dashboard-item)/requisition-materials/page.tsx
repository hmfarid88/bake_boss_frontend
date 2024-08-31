'use client'
import React, { useState, useEffect, useRef } from "react";
import { FcPlus, FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useAppDispatch, useAppSelector } from "@/app/store";
import { selectMaterialsQtyList } from "@/app/store/materialSummarySlice";
import Select from "react-select";
import CurrentDate from "@/app/components/CurrentDate";
import { uid } from "uid";
import { toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import { addMaterials, deleteAllMaterials } from "@/app/store/requisitionMaterials";

type Product = {
    category: string;
    materialsName: string;
    qty: number;
};

const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [productName, setProductName] = useState('');
    const [productQty, setProductQty] = useState('');
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const groupedMaterials = useAppSelector(selectMaterialsQtyList);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const filtered = groupedMaterials.filter(product =>
            (product.category.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.materialsName.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
        );
        setFilteredProducts(filtered);
    }, [filterCriteria, groupedMaterials]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };

    const totalQty = filteredProducts.reduce((total, product) => {
        return total + product.qty;
    }, 0);

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
    }, [apiBaseUrl]);

    const handleAllDelete = async (e: any) => {
        e.preventDefault();
        const isConfirmed = window.confirm("Are you sure to delete all materials ?");
        if (isConfirmed) {
            dispatch(deleteAllMaterials())
        }
        
    }
    const handleProductSubmit = async (e: any) => {
        e.preventDefault();
        if (!productName || !productQty) {
            toast.warning("Product Name and Quantity Needed")
            return;
        }
        try {
            const response = await fetch(`${apiBaseUrl}/api/categoryAndProduct-details?productName=${productName}`);
            if (response.ok) {
                const data = await response.json();
                data.forEach((product: any) => {
                    const numericProductQty = Number(productQty);
                    const requisitionProduct = {
                        id: uid(),
                        category: product.category,
                        productName: product.productName,
                        materialsName: product.materialsName,
                        qty: product.qty * numericProductQty,
                    };
                    dispatch(addMaterials(requisitionProduct));
                });
            }
        } catch (error) {
            toast.error("An error occurred while processing the request.");
        }
    };

    return (
        <div className="container min-h-screen">
            <div className="flex justify-between p-3">
                <label className="input input-bordered flex max-w-xs  items-center gap-2">
                    <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                        <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                    </svg>
                </label>
                <div className="flex gap-5">
                    <button onClick={handleAllDelete} className="btn btn-error btn-ghost btn-square"> <RiDeleteBin6Line size={30} /></button>
                    <a href="#my_modal_requisition" className="btn btn-circle btn-ghost"><FcPlus size={32} /></a>
                    <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <div ref={contentToPrint} className="flex flex-col p-5">
                    <div className="flex flex-col justify-center items-center p-3 gap-2 font-bold">
                        <h2>Materials Summary</h2>
                        <CurrentDate />
                    </div>
                    <div className="flex items-center justify-center">
                        <table className="table table-sm text-center">
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>CATEGORY</th>
                                    <th>MATERIALS NAME</th>
                                    <th>QTY</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts?.map((material, index) => (
                                    <tr key={`${material.category}-${material.materialsName}`} className="capitalize">
                                        <td>{index + 1}</td>
                                        <td>{material.category}</td>
                                        <td>{material.materialsName}</td>
                                        <td>{Number(material.qty.toFixed(2)).toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="font-bold">
                                    <td colSpan={2}></td>
                                    <td>TOTAL</td>
                                    <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            <div className="modal" role="dialog" id="my_modal_requisition">
                <div className="modal-box">
                    <div className="flex flex-col w-full h-96 gap-2 p-2">
                        <h4>Add Product</h4>
                        <div className="flex gap-2">
                            <Select className="text-black w-64 h-[38px]" autoFocus={true} onChange={(selectedOption: any) => setProductName(selectedOption.value)} options={productOption} />
                            <input type="number" className="w-[80px] h-[38px] p-2 bg-white text-black border rounded-md" placeholder="Qty" value={productQty} onChange={(e) => setProductQty(e.target.value)} />
                            <button onClick={handleProductSubmit} className='btn btn-outline btn-success btn-sm h-[38px]'>ADD</button>
                        </div>
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

export default Page