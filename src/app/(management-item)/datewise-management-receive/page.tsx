'use client'
import React, { useState, useEffect, useRef } from "react";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useSearchParams } from "next/navigation";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";

type Receive = {
    id: number;
    date: string;
    time: string;
    receiveName: string;
    receiveNote: string;
    amount: number;

};


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const searchParams = useSearchParams();
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const outlet = searchParams.get('outlet');

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Receive[]>([]);
    const [allProducts, setAllProducts] = useState<Receive[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Receive | null>(null);
    const [updatedReceive, setUpdatedReceive] = useState({
        date: "",
        receiveName: "",
        receiveNote: "",
        amount: 0,
    });

    const [updating, setUpdating] = useState(false);
    const handleEditClick = (receive: Receive) => {
        setSelectedProduct(receive);

        setUpdatedReceive({
            date: receive.date,
            receiveName: receive.receiveName,
            receiveNote: receive.receiveNote,
            amount: receive.amount,
        });
    };

    const handleReceiveChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setUpdatedReceive((prev) => ({
            ...prev,
            [name]: name === "amount" ? value : value,
        }));
    };

    const handleReceiveUpdate = async () => {
        if (!selectedProduct) return;

        if (
            !updatedReceive.receiveName.trim() ||
            !Number.isFinite(Number(updatedReceive.amount)) ||
            Number(updatedReceive.amount) < 0
        ) {
            toast.warning("Please enter a valid receive name and amount.");
            return;
        }

        try {
            setUpdating(true);

            const response = await fetch(
                `${apiBaseUrl}/paymentApi/updateReceive/${selectedProduct.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...updatedReceive,
                        amount: Number(updatedReceive.amount),
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update receive.");
            }

            const updated: Receive = {
                ...selectedProduct,
                ...updatedReceive,
                amount: Number(updatedReceive.amount),
            };

            setAllProducts((prev) =>
                prev.map((receive) =>
                    receive.id === selectedProduct.id ? updated : receive
                )
            );

            setSelectedProduct(null);
            toast.success("Receive updated successfully.");
        } catch (error) {
            console.error("Error updating receive:", error);
            toast.error("Failed to update receive. Please try again.");
        } finally {
            setUpdating(false);
        }
    };
    const handleReceiveDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this receive?")) {
            return;
        }

        try {
            const response = await fetch(
                `${apiBaseUrl}/paymentApi/deleteReceive/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete receive");
            }

            setAllProducts((prev) =>
                prev.filter((payment) => payment.id !== id)
            );

            setSelectedProduct(null);

            toast.success("Receive deleted successfully.");
        } catch (error) {
            console.error("Error deleting receive:", error);
            toast.error("Failed to delete receive. Please try again.");
        }
    };
    useEffect(() => {
        fetch(`${apiBaseUrl}/paymentApi/getDatewiseOfficeReceive?username=${outlet}&startDate=${startDate}&endDate=${endDate}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, outlet, startDate, endDate]);


    useEffect(() => {
        const filtered = allProducts.filter(product =>
            (product.receiveName.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.receiveNote.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };
    const totalValue = filteredProducts.reduce((total, product) => {
        return total + product.amount;
    }, 0);


    return (
        <div className="container-2xl">
            <div className="flex flex-col w-full min-h-[calc(100vh-228px)] p-4 items-center justify-center">

                <div className="flex w-full justify-between pl-5 pr-5 pt-1">
                    <label className="input input-bordered flex max-w-xs  items-center gap-2">
                        <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>
                    </label>
                    <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                </div>
                <div className="overflow-x-auto">
                    <div ref={contentToPrint} className="flex-1 p-5">
                        <div className="flex flex-col items-center pb-5">
                            <h4 className="font-bold uppercase">{outlet}</h4>
                            <h4 className="font-bold">OFFICE RECEIVE REPORT</h4>
                            <h4>FROM {startDate} TO {endDate}</h4>
                        </div>
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>DATE</th>
                                    <th>TIME</th>
                                    <th>RECEIVE NAME</th>
                                    <th>RECEIVE NOTE</th>
                                    <th>AMOUNT</th>
                                    <th>ACTION</th>

                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts?.map((product, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{product.date}</td>
                                        <td>{product.time}</td>
                                        <td>{product.receiveName}</td>
                                        <td>{product.receiveNote}</td>
                                        <td>{Number(product.amount.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td>
                                            <a href="#edit_receive" className="btn btn-xs btn-ghost"> <FiEdit size={16} onClick={() => handleEditClick(product)} /> </a>
                                            <button
                                                type="button"
                                                className="btn btn-xs btn-ghost text-error"
                                                title="Delete receive"
                                                onClick={() => handleReceiveDelete(product.id)}
                                            >
                                                <RiDeleteBin6Line
                                                    size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="font-semibold text-lg">
                                    <td colSpan={4}></td>
                                    <td>TOTAL</td>
                                    <td>{Number(totalValue.toFixed(2)).toLocaleString('en-IN')}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                {selectedProduct && (
                    <div className="modal modal-open sm:modal-middle" role="dialog">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg mb-4">
                                Edit Receive
                            </h3>

                            <div className="flex flex-col gap-3">
                                <label className="form-control w-full">
                                    <span className="label-text mb-1">Date</span>
                                    <input
                                        type="date"
                                        name="date"
                                        className="input input-bordered w-full"
                                        value={updatedReceive.date}
                                        onChange={handleReceiveChange}
                                        required
                                    />
                                </label>

                                <label className="form-control w-full">
                                    <span className="label-text mb-1">
                                        Receive Name
                                    </span>
                                    <input
                                        type="text"
                                        name="receiveName"
                                        className="input input-bordered w-full"
                                        value={updatedReceive.receiveName}
                                        onChange={handleReceiveChange}
                                        required
                                    />
                                </label>

                                <label className="form-control w-full">
                                    <span className="label-text mb-1">
                                        Receive Note
                                    </span>
                                    <textarea
                                        name="receiveNote"
                                        className="textarea textarea-bordered w-full"
                                        value={updatedReceive.receiveNote}
                                        onChange={(e) =>
                                            setUpdatedReceive   ((prev) => ({
                                                ...prev,
                                                receiveNote: e.target.value,
                                            }))
                                        }
                                    />
                                </label>

                                <label className="form-control w-full">
                                    <span className="label-text mb-1">Amount</span>
                                    <input
                                        type="number"
                                        name="amount"
                                        min="0"
                                        step="0.01"
                                        className="input input-bordered w-full"
                                        value={updatedReceive.amount}
                                        onChange={handleReceiveChange}
                                        required
                                    />
                                </label>
                            </div>

                            <div className="modal-action flex justify-between">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => setSelectedProduct(null)}
                                    disabled={updating}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleReceiveUpdate}
                                    disabled={updating}
                                >
                                    {updating ? "Updating..." : "Update Receive"}
                                </button>

                            </div>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer autoClose={1000} theme="dark" />
        </div>
    )
}

export default Page