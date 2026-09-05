
"use client";

import React, { forwardRef } from "react";


interface OrderPrintProps {
    order: any;
}


const OrderPrint = forwardRef<
    HTMLDivElement,
    OrderPrintProps
>(
    ({ order }, ref) => {

        const total = order.items.reduce(
            (sum: number, item: any) =>
                sum +
                (item.saleRate * item.productQty) -
                item.discount,
            0
        );


        return (

            <div
                ref={ref}
                className="p-5 bg-white text-black"
            >

                {/* HEADER */}

                <div className="text-center mb-5">

                    <h1 className="text-2xl font-bold">
                        ORDER DETAILS
                    </h1>

                    <p>
                        Order No: {order.orderId}
                    </p>

                </div>


                {/* ORDER INFORMATION */}

                <div className="flex justify-between mb-5">

                    <div>

                        <p>
                            <strong>Date:</strong>{" "}
                            {order.createdAt}
                        </p>

                        <p>
                            <strong>Table No:</strong>{" "}
                            {order.tableNo || "N/A"}
                        </p>

                    </div>


                    <div>

                        <p>
                            <strong>Total Items:</strong>{" "}
                            {order.items.length}
                        </p>

                    </div>

                </div>


                {/* PRODUCT TABLE */}

                <table className="w-full border-collapse">

                    <thead>

                        <tr>

                            <th className="border p-2">
                                #
                            </th>

                            <th className="border p-2 text-left">
                                Product
                            </th>

                            <th className="border p-2">
                                Rate
                            </th>

                            <th className="border p-2">
                                Qty
                            </th>

                            <th className="border p-2">
                                Total
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {
                            order.items.map(
                                (
                                    item: any,
                                    index: number
                                ) => (

                                    <tr key={item.id}>

                                        <td className="border p-2 text-center">

                                            {index + 1}

                                        </td>


                                        <td className="border p-2">

                                            {item.productName}

                                        </td>


                                        <td className="border p-2 text-right">

                                            {Number(
                                                item.saleRate
                                            ).toFixed(2)}

                                        </td>


                                        <td className="border p-2 text-center">

                                            {Number(
                                                item.productQty
                                            ).toFixed(2)}

                                        </td>


                                        <td className="border p-2 text-right">

                                            {(
                                                (
                                                    item.saleRate *
                                                    item.productQty
                                                )

                                                -

                                                item.discount

                                            ).toFixed(2)}

                                        </td>


                                    </tr>

                                )

                            )
                        }

                    </tbody>


                    <tfoot>

                        <tr>

                            <td
                                colSpan={4}
                                className="border p-3 text-right font-bold"
                            >

                                GRAND TOTAL

                            </td>


                            <td className="border p-3 text-right font-bold">

                                {total.toFixed(2)} Tk

                            </td>

                        </tr>

                    </tfoot>

                </table>


                {/* FOOTER */}

                <div className="mt-10 text-center text-sm">

                    <p>
                        Thank you!
                    </p>

                </div>

            </div>

        );

    }

);


OrderPrint.displayName = "OrderPrint";


export default OrderPrint;