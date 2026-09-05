// "use client";

// import React from "react";

// import {
//     useAppDispatch,
//     useAppSelector
// } from "@/app/store";

// import {
//     deleteOrder
// } from "@/app/store/orderSlice";

// import { useRouter } from "next/navigation";

// import {
//     RiDeleteBin6Line,
//     RiEyeLine
// } from "react-icons/ri";


// const Page: React.FC = () => {

//     const router = useRouter();

//     const dispatch = useAppDispatch();

//     const uname = useAppSelector(
//         state => state.username.username
//     );

//     const username = uname
//         ? uname.username
//         : "Guest";


//     const orders = useAppSelector(
//         state => state.orders.orders
//     );


//     const myOrders =
//         orders.filter(
//             order =>
//                 order.username === username
//         );


//     const handleDelete = (
//         orderId: string
//     ) => {

//         if (
//             !confirm(
//                 "Delete this order?"
//             )
//         ) {
//             return;
//         }

//         dispatch(
//             deleteOrder(orderId)
//         );
//     };


//     return (

//         <div className="container-2xl min-h-screen p-5">

//             <div className="flex justify-between items-center">

//                 <h1 className="text-2xl font-bold">
//                     ORDERS
//                 </h1>
//                 <button
//                     className="btn btn-success"
//                     onClick={() =>
//                         router.push(
//                             "/new-order"
//                         )
//                     }
//                 >
//                     + NEW ORDER
//                 </button>

//             </div>

//             <div className="overflow-x-auto items-center justify-center mt-5">
//                 <table className="table">
//                     <thead>
//                         <tr>
//                             <th>SN</th>
//                             <th>ORDER ID</th>
//                             <th>DATE</th>
//                             <th>ITEMS</th>
//                             <th>TOTAL</th>
//                             <th>ACTION</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {myOrders.map(
//                             (order, index) => {
//                                 const total =
//                                     order.items.reduce(
//                                         ( sum, item ) => sum +
//                                             ( item.saleRate * item.productQty ) - item.discount, 0 );
//                                 return (
//                                     <tr key={order.orderId}>
//                                         <td> {index + 1}</td>
//                                         <td className="uppercase"> {order.orderId} </td>
//                                         <td> {order.createdAt}</td>
//                                         <td> {order.items.length}</td>
//                                         <td> {total.toFixed(2)} Tk </td>
//                                         <td>
//                                            <div className="flex gap-2">
//                                                 <button
//                                                     className="btn btn-sm btn-info"
//                                                     onClick={() =>
//                                                         router.push(`/order-view?orderId=${order.orderId}` )
//                                                     } >
//                                                     <RiEyeLine size={18} />
//                                                 </button>
//                                                 <button
//                                                     className="btn btn-sm btn-error"
//                                                     onClick={() =>
//                                                         handleDelete( order.orderId )} >
//                                                     <RiDeleteBin6Line size={ 18 } />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>

//                                 );
//                             }
//                         )}

//                     </tbody>

//                 </table>

//             </div>

//         </div>
//     );
// };


// export default Page;

"use client";

import React, { useRef } from "react";

import {
    useAppDispatch,
    useAppSelector
} from "@/app/store";

import {
    deleteOrder
} from "@/app/store/orderSlice";

import { useRouter } from "next/navigation";

import {
    RiDeleteBin6Line,
    RiEyeLine,
    RiFileList3Line,
    RiCalendarLine,
    RiRestaurantLine,
    RiPrinterLine
} from "react-icons/ri";
import { useReactToPrint } from "react-to-print";
import { FcPrint } from "react-icons/fc";
import OrderPrint from "@/app/components/OrderPrint";


const Page: React.FC = () => {

    const router = useRouter();

    const dispatch = useAppDispatch();

    const uname = useAppSelector(
        state => state.username.username
    );

    const username = uname
        ? uname.username
        : "Guest";


    const OrderPrintButton = ({ order }: { order: any }) => {

        const printRef =
            useRef<HTMLDivElement>(null);

        const handlePrint = useReactToPrint({
            content: () => printRef.current,
            documentTitle: `Order-${order.orderId}`
        });


        return (

            <>

                {/* HIDDEN PRINT AREA */}

                <div className="hidden">

                    <OrderPrint
                        ref={printRef}
                        order={order}
                    />

                </div>


                {/* PRINT BUTTON */}

                <button

                    className="
                    btn
                    btn-sm
                    btn-outline
                    btn-primary
                "

                    title="Print Order"

                    onClick={() => handlePrint()}

                >

                    <RiPrinterLine size={20} />

                </button>

            </>

        );

    };


    const orders = useAppSelector(
        state => state.orders.orders
    );


    const myOrders =
        orders.filter(
            order =>
                order.username === username
        );


    const handleDelete = (
        orderId: string
    ) => {

        if (
            !confirm(
                "Delete this order?"
            )
        ) {
            return;
        }

        dispatch(
            deleteOrder(orderId)
        );
    };


    return (

        <div className="container-2xl min-h-screen p-4 md:p-8">


            {/* HEADER */}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

                <div>

                    <h1 className="text-2xl md:text-3xl font-bold tracking-wide">

                        ORDERS

                    </h1>

                    <p className="text-sm opacity-60 mt-1">

                        Manage customer orders

                    </p>

                </div>


                <button
                    className="btn btn-success shadow-lg"
                    onClick={() =>
                        router.push("/new-order")
                    }
                >

                    + NEW ORDER

                </button>

            </div>



            {/* NO ORDER */}

            {
                myOrders.length === 0 && (

                    <div className="flex justify-center items-center min-h-[400px]">

                        <div className="text-center opacity-60">

                            <RiFileList3Line
                                size={70}
                                className="mx-auto mb-4"
                            />

                            <h2 className="text-xl font-semibold">

                                No Orders Found

                            </h2>

                            <p className="mt-2">

                                Create a new order to get started.

                            </p>

                        </div>

                    </div>

                )
            }



            {/* ORDER CARDS */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">


                {
                    myOrders.map(
                        (order, index) => {


                            const total =
                                order.items.reduce(

                                    (sum, item) =>

                                        sum +

                                        (
                                            item.saleRate *
                                            item.productQty
                                        )

                                        -

                                        item.discount,

                                    0
                                );


                            return (

                                <div
                                    key={order.orderId}

                                    className="
                                        card
                                        bg-base-100
                                        border
                                        border-base-300
                                        shadow-md
                                        hover:shadow-xl
                                        transition-all
                                        duration-300
                                    "
                                >


                                    <div className="card-body p-0">


                                        {/* CARD HEADER */}

                                        <div className="
                                            flex
                                            justify-between
                                            items-center
                                            p-5
                                            border-b
                                            border-base-300
                                        ">


                                            <div className="flex items-center gap-3">


                                                {/* ORDER NUMBER */}

                                                <div className="
                                                    w-12
                                                    h-12
                                                    rounded-full
                                                    bg-primary
                                                    text-primary-content
                                                    flex
                                                    items-center
                                                    justify-center
                                                    font-bold
                                                ">

                                                    {index + 1}

                                                </div>


                                                <div>

                                                    <div className="
                                                        text-xs
                                                        uppercase
                                                        opacity-60
                                                    ">

                                                        Order No

                                                    </div>


                                                    <div className="
                                                        font-bold
                                                        text-lg
                                                        uppercase
                                                    ">

                                                        {order.orderId}

                                                    </div>

                                                </div>


                                            </div>



                                            {/* ACTION BUTTONS */}

                                            <div className="flex gap-2">
                                                <OrderPrintButton
                                                    order={order}
                                                />
                                                {/* <button onClick={handlePrint} className='btn btn-sm btn-success btn-outline'><FcPrint size={24} /></button> */}

                                                <button

                                                    className="
                                                        btn
                                                        btn-sm
                                                        btn-outline
                                                        btn-info
                                                    "

                                                    title="View Order"

                                                    onClick={() =>

                                                        router.push(

                                                            `/order-view?orderId=${order.orderId}`

                                                        )

                                                    }

                                                >

                                                    <RiEyeLine size={20} />

                                                </button>



                                                <button

                                                    className="
                                                        btn
                                                        btn-sm
                                                        btn-outline
                                                        btn-error
                                                    "

                                                    title="Delete Order"

                                                    onClick={() =>

                                                        handleDelete(

                                                            order.orderId

                                                        )

                                                    }

                                                >

                                                    <RiDeleteBin6Line
                                                        size={20}
                                                    />

                                                </button>


                                            </div>


                                        </div>



                                        {/* ORDER INFO */}

                                        <div className="
                                            grid
                                            grid-cols-1
                                            sm:grid-cols-2
                                            gap-3
                                            p-5
                                            bg-base-200
                                        ">


                                            {/* DATE */}

                                            <div className="
                                                flex
                                                items-center
                                                gap-3
                                            ">

                                                <div className="
                                                    w-10
                                                    h-10
                                                    rounded-lg
                                                    bg-base-100
                                                    flex
                                                    items-center
                                                    justify-center
                                                ">

                                                    <RiCalendarLine size={22} />

                                                </div>


                                                <div>

                                                    <div className="
                                                        text-xs
                                                        opacity-60
                                                    ">

                                                        ORDER DATE

                                                    </div>


                                                    <div className="font-semibold">

                                                        {order.createdAt}

                                                    </div>

                                                </div>


                                            </div>



                                            {/* TABLE NUMBER */}

                                            <div className="
                                                flex
                                                items-center
                                                gap-3
                                            ">

                                                <div className="
                                                    w-10
                                                    h-10
                                                    rounded-lg
                                                    bg-base-100
                                                    flex
                                                    items-center
                                                    justify-center
                                                ">

                                                    <RiRestaurantLine size={22} />

                                                </div>


                                                <div>

                                                    <div className="
                                                        text-xs
                                                        opacity-60
                                                    ">

                                                        TABLE NO

                                                    </div>


                                                    <div className="font-semibold">

                                                        {
                                                            (order as any).tableNo
                                                            || "Not Assigned"
                                                        }

                                                    </div>

                                                </div>


                                            </div>


                                        </div>



                                        {/* PRODUCT LIST TITLE */}

                                        <div className="
                                            px-5
                                            pt-5
                                            flex
                                            justify-between
                                            items-center
                                        ">

                                            <h3 className="font-bold">

                                                PRODUCT LIST

                                            </h3>


                                            <div className="
                                                badge
                                                badge-primary
                                                badge-outline
                                            ">

                                                {order.items.length} Items

                                            </div>


                                        </div>



                                        {/* PRODUCT LIST */}

                                        <div className="
                                            p-5
                                            space-y-3
                                            max-h-[300px]
                                            overflow-y-auto
                                        ">


                                            {
                                                order.items.map(

                                                    (item, itemIndex) => (

                                                        <div

                                                            key={item.id}

                                                            className="
                                                                flex
                                                                justify-between
                                                                items-center
                                                                gap-3
                                                                p-3
                                                                rounded-xl
                                                                bg-base-200
                                                                hover:bg-base-300
                                                                transition
                                                            "

                                                        >


                                                            {/* PRODUCT */}

                                                            <div className="
                                                                flex
                                                                items-center
                                                                gap-3
                                                                min-w-0
                                                            ">


                                                                <div className="
                                                                    badge
                                                                    badge-neutral
                                                                    badge-sm
                                                                ">

                                                                    {itemIndex + 1}

                                                                </div>


                                                                <div className="min-w-0">


                                                                    <div className="
                                                                      capitalize  font-semibold
                                                                        truncate
                                                                    ">

                                                                        {item.productName}

                                                                    </div>


                                                                    <div className="
                                                                        text-xs
                                                                        opacity-60
                                                                    ">

                                                                        Rate: {Number(
                                                                            item.saleRate
                                                                        ).toFixed(2)} Tk

                                                                    </div>


                                                                </div>


                                                            </div>



                                                            {/* QTY + TOTAL */}

                                                            <div className="
                                                                text-right
                                                                whitespace-nowrap
                                                            ">


                                                                <div className="
                                                                    text-sm
                                                                    font-semibold
                                                                ">

                                                                    Qty: {
                                                                        Number(
                                                                            item.productQty
                                                                        ).toFixed(2)
                                                                    }

                                                                </div>


                                                                <div className="
                                                                    text-sm
                                                                    font-bold
                                                                    text-success
                                                                ">

                                                                    {(
                                                                        (
                                                                            item.saleRate *
                                                                            item.productQty
                                                                        )

                                                                        -

                                                                        item.discount

                                                                    ).toFixed(2)} Tk

                                                                </div>


                                                            </div>


                                                        </div>

                                                    )

                                                )

                                            }


                                        </div>



                                        {/* FOOTER */}

                                        <div className="
                                            flex
                                            justify-between
                                            items-center
                                            p-5
                                            border-t
                                            border-base-300
                                            bg-base-200
                                        ">


                                            <div>

                                                <div className="
                                                    text-xs
                                                    uppercase
                                                    opacity-60
                                                ">

                                                    Total Amount

                                                </div>


                                                <div className="
                                                    text-2xl
                                                    font-bold
                                                    text-success
                                                ">

                                                    {total.toFixed(2)} Tk

                                                </div>


                                            </div>



                                            <button className="btn btn-primary btn-sm" onClick={() =>  router.push( `/order-view?orderId=${order.orderId}` ) }>
                                                MODIFY ORDER
                                            </button>
                                            <button className="btn btn-success btn-sm" onClick={() =>  router.push( `/order-sales?orderId=${order.orderId}` ) }>
                                                SUBMIT ORDER
                                            </button>


                                        </div>


                                    </div>


                                </div>

                            );

                        }

                    )

                }


            </div>


        </div>

    );

};


export default Page;
