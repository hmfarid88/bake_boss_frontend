"use client";

import React, {
    useEffect,
    useState
} from "react";

import {
    useSearchParams,
    useRouter
} from "next/navigation";

import { uid } from "uid";

import {
    useAppDispatch,
    useAppSelector
} from "@/app/store";

import {
    deleteOrder
} from "@/app/store/orderSlice";

import {
    toast,
    ToastContainer
} from "react-toastify";

import {
    FcManager,
    FcPhone,
    FcCalendar,
    FcViewDetails
} from "react-icons/fc";

import {
    HiCurrencyBangladeshi
} from "react-icons/hi";

import {
    FaHandHoldingMedical
} from "react-icons/fa";

import {
    RiHandCoinLine
} from "react-icons/ri";


const Page: React.FC = () => {

    const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL;

    const router = useRouter();

    const searchParams =
        useSearchParams();

    const orderId =
        searchParams.get("orderId");


    const dispatch =
        useAppDispatch();


    const uname =
        useAppSelector(
            state =>
                state.username.username
        );


    const username =
        uname
            ? uname.username
            : "Guest";


    const order =
        useAppSelector(
            state =>
                state.orders.orders.find(
                    o =>
                        o.orderId ===
                        orderId
                )
        );


    /*
     * Customer information
     * Only exists on SALE page
     */

    const [customerName, setCustomerName] =
        useState("");

    const [phoneNumber, setPhoneNumber] =
        useState("");

    const [dob, setDob] =
        useState("");

    const [soldBy, setSoldBy] =
        useState("");

    const [received, setReceived] =
        useState("");

    const [pending, setPending] =
        useState(false);


    if (!order) {

        return (
            <div className="p-10 text-center">
                Order not found
            </div>
        );
    }


    const total =
        order.items.reduce(
            (sum, item) =>
                sum +
                (
                    item.saleRate *
                    item.productQty
                ) -
                item.discount,

            0
        );


    const receivedAmount =
        Number(received) || 0;


    const returnAmount =
        receivedAmount - total;


    /*
     * Final Sale
     */

    const handleFinalSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();


        if (order.items.length === 0) {

            toast.error(
                "Order is empty!"
            );

            return;
        }


        /*
         * Don't create invoice until
         * user actually submits.
         */

        const invoiceNo = uid();


        /*
         * Convert OrderItem to
         * existing SalesItem format
         */

        const salesItems =
            order.items.map(
                item => ({

                    ...item,

                    id: item.id,

                    date:
                        new Date()
                            .toISOString()
                            .split("T")[0],

                    status: "sold",

                    username,

                    soldInvoice:
                        invoiceNo

                })
            );


        const salesRequest = {

            customer: {

                customerName,

                phoneNumber,

                dob,

                soldBy,

                soldInvoice:
                    invoiceNo

            },

            salesItems

        };


        setPending(true);


        try {

            const response =
                await fetch(
                    `${apiBaseUrl}/sales/outletSale`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                salesRequest
                            )
                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();

                toast.error(
                    errorText ||
                    "Product sale not submitted!"
                );

                return;
            }


            /*
             * Sale successful
             *
             * Now remove order from Redux
             */

            dispatch(
                deleteOrder(
                    order.orderId
                )
            );


            /*
             * Open invoice
             */

            router.push(
                `/sales-invoice?soldInvoice=${invoiceNo}`
            );

        } catch (error: any) {

            toast.error(
                "An error occurred: " +
                error.message
            );

        } finally {

            setPending(false);

        }

    };


    return (

        <div className="container-2xl min-h-screen p-5">

            <div className="divider divider-accent font-bold tracking-widest">
                COMPLETE SALE
            </div>


            {/* Order summary */}

            <div className="card shadow p-5">

                <h2 className="font-bold text-lg uppercase">
                    ORDER #{order.orderId}
                </h2>

                <div className="flex items-center justify-center w-full p-5">
                    <div className="overflow-x-auto">

                        <table className="table table-lg">

                            <thead>

                                <tr>

                                    <th>PRODUCT</th>

                                    <th>RATE</th>

                                    <th>QTY</th>

                                    <th>DISCOUNT</th>

                                    <th>TOTAL</th>

                                </tr>

                            </thead>


                            <tbody>

                                {order.items.map(
                                    item => (

                                        <tr
                                            key={
                                                item.id
                                            }
                                        >

                                            <td className="capitalize">
                                                {
                                                    item.productName
                                                }
                                            </td>

                                            <td>
                                                {
                                                    item.saleRate
                                                }
                                            </td>

                                            <td>
                                                {
                                                    item.productQty
                                                }
                                            </td>

                                            <td>
                                                {
                                                    item.discount
                                                }
                                            </td>

                                            <td>
                                                {(
                                                    item.saleRate *
                                                    item.productQty -
                                                    item.discount
                                                ).toFixed(2)}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                </div>

            </div>


            {/* CUSTOMER INFORMATION */}
            <div className="flex flex-col md:flex-row items-center justify-center">
                <div className="flex w-full items-center justify-center p-5">
                    <div className="card shadow shadow-slate-500 w-full gap-3 mt-5 p-5">

                        <div className="card-title text-sm font-bold tracking-widest">

                            CUSTOMER INFORMATION

                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2  gap-5 mt-5">


                            {/* LEFT */}

                            <div className="flex flex-col gap-3">


                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">

                                    <FcManager size={20} />

                                    <input
                                        type="text"
                                        className="grow"
                                        value={
                                            customerName
                                        }
                                        onChange={e =>
                                            setCustomerName(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Customer Name"
                                    />

                                </label>


                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">

                                    <FcPhone size={20} />

                                    <input
                                        type="text"
                                        maxLength={11}
                                        className="grow"

                                        value={
                                            phoneNumber
                                        }

                                        onChange={e =>
                                            setPhoneNumber(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                )
                                            )
                                        }

                                        placeholder="Mobile Number"
                                    />

                                </label>


                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">

                                    <FcCalendar size={20} />

                                    <input
                                        type="date"
                                        className="grow"

                                        value={dob}

                                        onChange={e =>
                                            setDob(
                                                e.target.value
                                            )
                                        }
                                    />

                                </label>


                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">

                                    <FcViewDetails size={20} />

                                    <input
                                        type="text"
                                        className="grow"

                                        value={
                                            soldBy
                                        }

                                        onChange={e =>
                                            setSoldBy(
                                                e.target.value
                                            )
                                        }

                                        placeholder="Sold By"
                                    />

                                </label>

                            </div>


                            {/* RIGHT */}

                            <div className="flex flex-col gap-3">


                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">

                                    <HiCurrencyBangladeshi
                                        size={20}
                                    />

                                    <input
                                        type="text"
                                        className="grow"
                                        value={
                                            total.toFixed(
                                                2
                                            )
                                        }
                                        readOnly
                                    />

                                </label>


                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">

                                    <FaHandHoldingMedical
                                        size={20}
                                    />

                                    <input
                                        type="number"
                                        className="grow"

                                        value={
                                            received
                                        }

                                        onChange={e =>
                                            setReceived(
                                                e.target.value
                                            )
                                        }

                                        placeholder="Received Amount"
                                    />

                                </label>


                                <label className="input input-bordered flex w-full max-w-xs items-center gap-2">

                                    <RiHandCoinLine
                                        size={20}
                                    />

                                    <input
                                        type="text"
                                        className="grow"

                                        value={
                                            returnAmount.toFixed(
                                                2
                                            )
                                        }

                                        readOnly
                                    />

                                </label>

                                <label className="form-control w-full max-w-xs">
                                    <button
                                        disabled={pending}

                                        onClick={
                                            handleFinalSubmit
                                        }

                                        className="btn btn-success font-bold"
                                    >

                                        {pending
                                            ? "SUBMITTING..."
                                            : "SUBMIT SALE"}

                                    </button>
                                </label>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

            <ToastContainer
                autoClose={1000}
                theme="dark"
            />

        </div>
    );
};


export default Page;