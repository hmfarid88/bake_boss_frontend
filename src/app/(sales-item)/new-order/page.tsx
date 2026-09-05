
"use client";

import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { uid } from "uid";
import { toast, ToastContainer } from "react-toastify";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { createOrder, addItemToOrder, deleteItemFromOrder } from "@/app/store/orderSlice";
import { useRouter } from "next/navigation";
import { RiDeleteBin6Line } from "react-icons/ri";

const Page: React.FC = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const dispatch = useAppDispatch();

    const uname = useAppSelector(state => state.username.username);
    const username = uname ? uname.username : "Guest";
    const router = useRouter();
    const orders = useAppSelector(state => state.orders.orders);
    const [tableNo, setTableNo] = useState("");

    // Product refs
    const selectRef = useRef<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleProductSelect = (selectedOption: any) => {
        setSelectedProduct(selectedOption);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    // IMPORTANT:
    // Prevent duplicate order creation in React Strict Mode
    const orderCreatedRef = useRef(false);

    // Store this page's order ID
    const currentOrderIdRef = useRef<string | null>(null);
    const [productOptions, setProductOptions] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [selectedQty, setSelectedQty] = useState<number | "">("");

    // useEffect(() => {

    //     // Prevent duplicate creation
    //     if (orderCreatedRef.current) {
    //         return;
    //     }
    //     orderCreatedRef.current = true;

    //     const orderId = uid();

    //     // Save this page's order ID
    //     currentOrderIdRef.current = orderId;

    //     const today = new Date().toISOString().split("T")[0];

    //     dispatch(
    //         createOrder({
    //             orderId,
    //             username,
    //             createdAt: today
    //         })
    //     );

    // }, [dispatch, username]);

    const handleCreateOrder = () => {

        if (!tableNo.trim()) {
            toast.error("Please enter Table No!");
            return;
        }

        if (orderCreatedRef.current) {
            return;
        }

        orderCreatedRef.current = true;

        const orderId = uid();

        currentOrderIdRef.current = orderId;

        const today = new Date().toISOString().split("T")[0];

        dispatch(
            createOrder({
                orderId,
                username,
                createdAt: today,
                tableNo: tableNo.trim()
            })
        );

    };

    const currentOrder = orders.find(order => order.orderId === currentOrderIdRef.current);

    useEffect(() => {
        if (!apiBaseUrl) return;
        fetch(
            `${apiBaseUrl}/sales/getSalesStock?username=${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch products"
                    );
                }

                return response.json();
            })

            .then(data => {

                const transformed =
                    data.map(
                        (item: any) => ({
                            value:
                                item.productId,

                            label:
                                `${item.productName}, ${Number(
                                    item.remainingQty
                                ).toFixed(4)}`
                        })
                    );

                setProductOptions(
                    transformed
                );

            })

            .catch(error => {

                console.error(
                    "Error fetching products:",
                    error
                );
            });

    }, [apiBaseUrl, username]);


    /*
     * GET SINGLE PRODUCT
     */

    const fetchProductData = async (productId: string) => {
        try {
            const response =
                await fetch(
                    `${apiBaseUrl}/sales/getSingleProduct?productId=${productId}&username=${username}`
                );

            if (!response.ok) {

                throw new Error(
                    `HTTP error ${response.status}`
                );
            }

            return await response.json();

        } catch (error) {
            console.error("Error fetching product:", error);
            return null;
        }

    };


    /*
     * ADD PRODUCT TO ORDER
     */

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentOrder) {
            toast.error(
                "Order is still loading. Please try again."
            );
            return;
        }

        if (!selectedProduct) {
            toast.error("Select any product!");
            return;
        }

        if (selectedQty === "" || Number(selectedQty) <= 0) {
            toast.error("Need valid quantity!");
            return;
        }

        const data = await fetchProductData(selectedProduct.value);

        if (!data || data.length === 0) {
            toast.error("Product not found!");
            return;
        }
        const productData = data[0];

        const existingQty = currentOrder.items.filter(
            item =>
                item.productId === (
                    productData.productId ?? selectedProduct.value
                )
        )
            .reduce(
                (sum, item) =>
                    sum + item.productQty,

                0
            );


        /*
         * CHECK STOCK
         */

        if (
            Number(productData.remainingQty) <
            existingQty + Number(selectedQty)
        ) {

            toast.error("Sorry, insufficient quantity!");
            return;

        }
        /*
         * CREATE ORDER ITEM
         */

        const item = {
            id: uid(),
            productId: productData.productId ?? selectedProduct.value,
            category: productData.category,
            productName: productData.productName,
            costPrice:
                Number(
                    productData.costPrice
                ),

            saleRate:
                Number(
                    productData.saleRate
                ),

            stockRate:
                Number(
                    productData.saleRate
                ),

            productQty:
                Number(
                    selectedQty
                ),

            discount: 0,

            tempRemain:
                Number(
                    productData.remainingQty
                )

        };


        /*
         * ADD ITEM TO CURRENT ORDER
         */

        dispatch(
            addItemToOrder({

                orderId:
                    currentOrder.orderId,

                item

            })
        );


        /*
         * RESET INPUTS
         */

        setSelectedProduct(null);

        setSelectedQty("");


        /*
         * FOCUS PRODUCT SELECT
         */

        if (selectRef.current) {

            selectRef.current.focus();

        }

    };
    /*
     * ADD UNIT PRODUCT TO ORDER
     */

    const handleAddUnitProduct = async () => {

        if (!currentOrder) {
            toast.error("Order is still loading. Please try again.");
            return;
        }

        if (!selectedProduct) {
            toast.error("Select any product!");
            return;
        }

        const data = await fetchProductData(selectedProduct.value);

        if (!data || data.length === 0) {
            toast.error("Product not found!");
            return;
        }

        const productData = data[0];

        /*
         * CHECK UNIT QTY
         */

        if (!productData.qty || Number(productData.qty) <= 0) {
            toast.warning("Sorry, unit quantity not set!");
            return;
        }

        /*
         * ONE UNIT = FRACTION OF MAIN STOCK
         *
         * Example:
         * qty = 12
         * One unit consumes 1/12 stock
         */

        const unitStockQty = 1 / Number(productData.qty);


        /*
         * CALCULATE ALREADY USED STOCK
         */

        const existingQty = currentOrder.items
            .filter(
                item =>
                    item.productId ===
                    (productData.productId ?? selectedProduct.value)
            )
            .reduce(
                (sum, item) => sum + Number(item.productQty),
                0
            );


        /*
         * CHECK STOCK
         */

        if (
            Number(productData.remainingQty) <
            existingQty + unitStockQty
        ) {
            toast.error("Sorry, insufficient quantity!");
            return;
        }


        /*
         * UNIT SALE RATE
         */

        const mainQty = Number(productData.qty);

        const unitRate = Number(productData.unitRate);

        if (!unitRate || unitRate <= 0) {
            toast.warning("Sorry, unit rate not set!");
            return;
        }


        /*
         * CREATE UNIT ORDER ITEM
         */

        const item = {

            id: uid(),

            productId:
                productData.productId ??
                selectedProduct.value,

            category:
                productData.category,

            productName:
                productData.productName,

            costPrice:
                Number(productData.costPrice),

            /*
             * UNIT PRICE
             */

            saleRate:
                unitRate,

            stockRate:
                Number(productData.saleRate),

            /*
             * Fractional stock quantity
             */

            productQty:
                unitStockQty,

            discount: 0,

            tempRemain:
                Number(productData.remainingQty),

            /*
             * Optional flag
             */

            saleType: "UNIT"

        };


        /*
         * ADD TO CURRENT ORDER
         */

        dispatch(
            addItemToOrder({

                orderId:
                    currentOrder.orderId,

                item

            })
        );


        /*
         * RESET
         */

        setSelectedProduct(null);

        setSelectedQty("");


        /*
         * FOCUS PRODUCT SELECT
         */

        setTimeout(() => {
            selectRef.current?.focus();
        }, 0);

    };

    /*
     * CALCULATE TOTAL
     */

    const total =
        currentOrder?.items.reduce(

            (sum, item) =>

                sum +

                (
                    item.saleRate *
                    item.productQty
                )

                -

                item.discount,

            0

        ) ?? 0;


    /*
     * CALCULATE TOTAL QTY
     */

    const qtyTotal =
        currentOrder?.items.reduce(

            (sum, item) =>
                sum +
                item.productQty,

            0

        ) ?? 0;


    return (

        <div className="container-2xl min-h-screen p-5">


            {/* TITLE */}

            <div className="divider divider-accent font-bold tracking-widest">

                NEW ORDER

            </div>


            {/* TABLE SELECTION */}

            {!currentOrder && (

                <div className="flex flex-col justify-center items-center gap-5 mt-24">

                    <input
                        type="text"
                        placeholder="Enter Table No"
                        value={tableNo}
                        onChange={(e) =>
                            setTableNo(e.target.value)
                        }
                        className="input input-bordered w-36" />

                    <button
                        type="button"
                        onClick={handleCreateOrder}
                        className="btn btn-primary w-36" >
                        START ORDER
                    </button>

                </div>

            )}

           
            {/* PRODUCT SELECTION */}
            {currentOrder && (
                <form
                    onSubmit={handleAddProduct}
                    className="flex flex-wrap justify-center items-center gap-2"
                >

                    {/* PRODUCT */}

                    <Select

                        ref={selectRef}

                        className="text-black w-64 md:w-96"

                        value={selectedProduct}

                        autoFocus

                        onChange={handleProductSelect}

                        options={productOptions}

                        placeholder="Select Product"

                    />


                    {/* QUANTITY */}

                    <input

                        ref={inputRef}

                        type="number"

                        step="any"

                        min="0"

                        className="w-24 h-[38px] p-2 bg-white text-black border rounded-md"

                        placeholder="Qty"

                        value={selectedQty}

                        onChange={e => {

                            const value =
                                Number(
                                    e.target.value
                                );


                            if (value >= 0) {

                                setSelectedQty(
                                    value
                                );

                            }

                        }}

                    />

                    {/* ADD */}

                    <button type="submit" className="btn btn-outline btn-success btn-sm h-[38px]"  >  ADD </button>

                    {/* UNIT */}

                    <button
                        type="button"
                        onClick={handleAddUnitProduct}
                        className="btn btn-outline btn-info btn-sm h-[38px]"
                    >
                        UNIT
                    </button>

                </form>
            )}

             {currentOrder && (
                <div className="flex justify-center mt-5">
                    <div className="card bg-base-200 shadow-md w-full max-w-lg">
                        <div className="card-body py-4">
                            <div className="flex flex-col md:flex-row justify-between gap-3 text-center">
                                <div>
                                    <div className="text-xs opacity-60"> ORDER NO </div>
                                    <div className="font-bold uppercase">
                                        {currentOrder.orderId}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs opacity-60">
                                        TABLE NO
                                    </div>
                                    <div className="text-xl font-bold text-primary ">
                                        {currentOrder.tableNo}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs opacity-60">
                                        DATE
                                    </div>

                                    <div className="font-semibold">
                                        {currentOrder.createdAt}
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            )}

            {currentOrder && (
                <div className="flex flex-col justify-center w-full p-5">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>SN</th>

                                    <th>PRODUCT</th>

                                    <th>RATE</th>

                                    <th>QTY</th>

                                    <th>TOTAL</th>

                                    <th>ACTION</th>

                                </tr>

                            </thead>


                            <tbody>


                                {currentOrder?.items.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan={5}
                                            className="text-center"
                                        >

                                            No products added

                                        </td>

                                    </tr>

                                )}


                                {currentOrder?.items.map(

                                    (item, index) => (

                                        <tr
                                            key={item.id}
                                        >


                                            <td>

                                                {index + 1}

                                            </td>


                                            <td>

                                                {item.productName}

                                            </td>


                                            <td>

                                                {Number(
                                                    item.saleRate
                                                ).toFixed(2)}

                                            </td>


                                            <td>

                                                {Number(item.productQty).toFixed(2)}

                                            </td>


                                            <td>

                                                {(

                                                    item.saleRate *
                                                    item.productQty

                                                ).toFixed(2)}

                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-xs btn-error"

                                                    onClick={() =>
                                                        dispatch(
                                                            deleteItemFromOrder(
                                                                {
                                                                    orderId:
                                                                        currentOrder.orderId,

                                                                    itemId:
                                                                        item.id
                                                                }
                                                            )
                                                        )
                                                    }
                                                >

                                                    <RiDeleteBin6Line
                                                        size={18}
                                                    />

                                                </button>
                                            </td>

                                        </tr>

                                    )

                                )}


                            </tbody>


                            <tfoot>


                                <tr>


                                    <td />


                                    <td className="font-bold">

                                        TOTAL

                                    </td>


                                    <td />


                                    <td className="font-bold">

                                        {qtyTotal.toFixed(2)}

                                    </td>


                                    <td className="font-bold">

                                        {total.toFixed(2)} Tk

                                    </td>


                                </tr>


                            </tfoot>


                        </table>


                    </div>

                    <div className="flex justify-center mt-5">
                        <button disabled={currentOrder?.items.length === 0} className="btn btn-success" onClick={() => router.push(`/orders`)} >
                            SUBMIT
                        </button>

                    </div>
                </div>
            )}
            <ToastContainer autoClose={1000} theme="dark" />

        </div>

    );

};


export default Page;