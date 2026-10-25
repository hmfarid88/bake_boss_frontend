'use client'
import React, { useState, useEffect, useRef } from "react";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useSearchParams } from "next/navigation";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";

type Expense = {
    id: number;
    date: string;
    time: string;
    expenseName: string;
    expenseNote: string;
    amount: number;

};


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const searchParams = useSearchParams();
    const outlet = searchParams.get('outlet');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Expense[]>([]);
    const [allProducts, setAllProducts] = useState<Expense[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Expense | null>(null);
    const [updatedExpense, setUpdatedExpense] = useState({
        date: "",
        expenseName: "",
        expenseNote: "",
        amount: 0,
    });

    const [updating, setUpdating] = useState(false);
    const handleEditClick = (expense: Expense) => {
        setSelectedProduct(expense);

        setUpdatedExpense({
            date: expense.date,
            expenseName: expense.expenseName,
            expenseNote: expense.expenseNote,
            amount: expense.amount,
        });
    };

    const handleExpenseChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setUpdatedExpense((prev) => ({
            ...prev,
            [name]: name === "amount" ? value : value,
        }));
    };

    const handleExpenseUpdate = async () => {
        if (!selectedProduct) return;

        if (
            !updatedExpense.expenseName.trim() ||
            !Number.isFinite(Number(updatedExpense.amount)) ||
            Number(updatedExpense.amount) < 0
        ) {
            toast.warning("Please enter a valid expense name and amount.");
            return;
        }

        try {
            setUpdating(true);

            const response = await fetch(
                `${apiBaseUrl}/paymentApi/updateExpense/${selectedProduct.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...updatedExpense,
                        amount: Number(updatedExpense.amount),
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update expense.");
            }

            const updated: Expense = {
                ...selectedProduct,
                ...updatedExpense,
                amount: Number(updatedExpense.amount),
            };

            setAllProducts((prev) =>
                prev.map((expense) =>
                    expense.id === selectedProduct.id ? updated : expense
                )
            );

            setSelectedProduct(null);
            toast.success("Expense updated successfully.");
        } catch (error) {
            console.error("Error updating expense:", error);
            toast.error("Failed to update expense. Please try again.");
        } finally {
            setUpdating(false);
        }
    };
    const handleExpenseDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) {
            return;
        }

        try {
            const response = await fetch(
                `${apiBaseUrl}/paymentApi/deleteExpense/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete expense");
            }

            setAllProducts((prev) =>
                prev.filter((expense) => expense.id !== id)
            );

            setSelectedProduct(null);

            toast.success("Expense deleted successfully.");
        } catch (error) {
            console.error("Error deleting expense:", error);
            toast.error("Failed to delete expense. Please try again.");
        }
    };
    useEffect(() => {
        fetch(`${apiBaseUrl}/paymentApi/getDatewiseExpense?username=${outlet}&startDate=${startDate}&endDate=${endDate}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, outlet, startDate, endDate]);


    useEffect(() => {
        const filtered = allProducts.filter(expense =>
            (expense.expenseName.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (expense.expenseNote.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };
    const totalValue = filteredProducts.reduce((total, expense) => {
        return total + expense.amount;
    }, 0);


    return (
        <div className="container-2xl">
            <div className="flex flex-col w-full min-h-[calc(100vh-228px)] p-4 items-center justify-center">

                <div className="flex w-full justify-between p-5">
                    <label className="input input-bordered flex max-w-xs  items-center gap-2">
                        <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>
                    </label>

                    <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                </div>
                <div ref={contentToPrint} className="flex-1 p-5">
                    <div className="flex flex-col items-center pb-5">
                        <h4 className="font-bold uppercase">{outlet}</h4>
                        <h4 className="font-bold">EXPENSE REPORT</h4>
                        FROM {startDate} TO {endDate}</div>
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th>SN</th>
                                <th>DATE</th>
                                <th>TIME</th>
                                <th>EXPENSE NAME</th>
                                <th>EXPENSE NOTE</th>
                                <th>AMOUNT</th>
                                <th>ACTION</th>

                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts?.map((expense, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{expense.date}</td>
                                    <td>{expense.time}</td>
                                    <td>{expense.expenseName}</td>
                                    <td>{expense.expenseNote}</td>
                                    <td>{Number(expense.amount.toFixed(2)).toLocaleString('en-IN')}</td>
                                    <td>
                                        <a href="#edit_expense" className="btn btn-xs btn-ghost"> <FiEdit size={16} onClick={() => handleEditClick(expense)} /> </a>
                                        <button
                                            type="button"
                                            className="btn btn-xs btn-ghost text-error"
                                            title="Delete expense"
                                            onClick={() => handleExpenseDelete(expense.id)}
                                        >
                                            <RiDeleteBin6Line size={18} />
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

                {selectedProduct && (
                    <div className="modal modal-open sm:modal-middle" role="dialog">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg mb-4">
                                Edit Expense
                            </h3>

                            <div className="flex flex-col gap-3">
                                <label className="form-control w-full">
                                    <span className="label-text mb-1">Date</span>
                                    <input
                                        type="date"
                                        name="date"
                                        className="input input-bordered w-full"
                                        value={updatedExpense.date}
                                        onChange={handleExpenseChange}
                                        required
                                    />
                                </label>

                                <label className="form-control w-full">
                                    <span className="label-text mb-1">
                                        Expense Name
                                    </span>
                                    <input
                                        type="text"
                                        name="expenseName"
                                        className="input input-bordered w-full"
                                        value={updatedExpense.expenseName}
                                        onChange={handleExpenseChange}
                                        required
                                    />
                                </label>

                                <label className="form-control w-full">
                                    <span className="label-text mb-1">
                                        Expense Note
                                    </span>
                                    <textarea
                                        name="expenseNote"
                                        className="textarea textarea-bordered w-full"
                                        value={updatedExpense.expenseNote}
                                        onChange={(e) =>
                                            setUpdatedExpense((prev) => ({
                                                ...prev,
                                                expenseNote: e.target.value,
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
                                        value={updatedExpense.amount}
                                        onChange={handleExpenseChange}
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
                                    onClick={handleExpenseUpdate}
                                    disabled={updating}
                                >
                                    {updating ? "Updating..." : "Update Expense"}
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