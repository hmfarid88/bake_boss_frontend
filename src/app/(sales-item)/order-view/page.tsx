
"use client";

import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useRouter, useSearchParams } from "next/navigation";
import { uid } from "uid";
import { toast, ToastContainer } from "react-toastify";

import {
    useAppDispatch,
    useAppSelector
} from "@/app/store";

import {
    addItemToOrder,
    increaseItemQty,
    decreaseItemQty,
    updateItemQty,
    deleteItemFromOrder,
    updateTableNo
} from "@/app/store/orderSlice";
import { RiDeleteBin6Line } from "react-icons/ri";


const Page: React.FC = () => {
    const router = useRouter();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const dispatch = useAppDispatch();

    const searchParams = useSearchParams();

    // Get existing order ID from URL
    const orderId = searchParams.get("orderId");
    const [isEditingTable, setIsEditingTable] = useState(false);
    const [editedTableNo, setEditedTableNo] = useState("");

    const handleEditTable = () => {
        setEditedTableNo(currentOrder?.tableNo || "");
        setIsEditingTable(true);
    };

    const handleSaveTableNo = () => {

        if (!editedTableNo.trim()) {
            toast.error("Please enter table number!");
            return;
        }

        if (!currentOrder) return;

        dispatch(
            updateTableNo({
                orderId: currentOrder.orderId,
                tableNo: editedTableNo.trim()
            })
        );

        setIsEditingTable(false);

    };
    const uname = useAppSelector(
        state => state.username.username
    );

    const username = uname ? uname.username : "Guest";

    const orders =
        useAppSelector(
            state => state.orders.orders
        );

    // Find the specific order
    const currentOrder =
        orders.find(
            order =>
                order.orderId === orderId
        );


    const selectRef =
        useRef<any>(null);

    const inputRef =
        useRef<HTMLInputElement>(null);


    const [productOptions, setProductOptions] =
        useState<any[]>([]);

    const [selectedProduct, setSelectedProduct] =
        useState<any>(null);

    const [selectedQty, setSelectedQty] =
        useState<number | "">("");


    /*
     * FETCH PRODUCTS
     */

    useEffect(() => {

        if (!apiBaseUrl) return;

        fetch(
            `${apiBaseUrl}/sales/getSalesStock?username=${username}`
        )
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

                            value: item.productId,

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
     * SELECT PRODUCT
     * Then focus quantity input
     */

    const handleProductSelect = (
        selectedOption: any
    ) => {

        setSelectedProduct(
            selectedOption
        );

        setTimeout(() => {

            inputRef.current?.focus();

        }, 0);

    };


    /*
     * GET SINGLE PRODUCT
     */

    const fetchProductData = async (
        productId: string
    ) => {

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

            console.error(
                "Error fetching product:",
                error
            );

            return null;

        }

    };


    /*
     * ADD PRODUCT TO EXISTING ORDER
     */

    const handleAddProduct = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();


        if (!currentOrder) {

            toast.error(
                "Order not found!"
            );

            return;

        }


        if (!selectedProduct) {

            toast.error(
                "Select a product!"
            );

            return;

        }


        if (
            selectedQty === "" ||
            Number(selectedQty) <= 0
        ) {

            toast.error(
                "Enter valid quantity!"
            );

            return;

        }


        /*
         * GET PRODUCT DATA
         */

        const data =
            await fetchProductData(
                selectedProduct.value
            );


        if (!data || data.length === 0) {

            toast.error(
                "Product not found!"
            );

            return;

        }


        const productData =
            data[0];


        /*
         * CHECK EXISTING QUANTITY
         * IN THIS SPECIFIC ORDER
         */

        const existingItem =
            currentOrder.items.find(
                item =>
                    item.productId ===
                    (
                        productData.productId ??
                        selectedProduct.value
                    )
            );


        const existingQty =
            existingItem
                ? Number(
                    existingItem.productQty
                )
                : 0;


        /*
         * CHECK STOCK
         */

        if (
            Number(productData.remainingQty) <
            existingQty +
            Number(selectedQty)
        ) {

            toast.error(
                "Sorry, insufficient quantity!"
            );

            return;

        }


        /*
         * CREATE ITEM
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
         * ADD TO THIS EXISTING ORDER
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
         * FOCUS PRODUCT SELECT AGAIN
         */

        setTimeout(() => {

            selectRef.current?.focus();

        }, 100);

    };
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
     * TOTALS
     */

    const total =
        currentOrder?.items.reduce(

            (sum, item) =>

                sum +
                (
                    Number(item.saleRate) *
                    Number(item.productQty)
                )
                -
                Number(item.discount || 0),

            0

        ) ?? 0;


    const qtyTotal =
        currentOrder?.items.reduce(

            (sum, item) =>
                sum +
                Number(item.productQty),

            0

        ) ?? 0;


    /*
     * ORDER NOT FOUND
     */

    if (!currentOrder) {

        return (

            <div className="container p-10 text-center">

                <h2 className="text-xl font-bold">

                    Order not found

                </h2>

            </div>

        );

    }


    return (

        <div className="container-2xl min-h-screen p-5">


            <div className="divider divider-accent font-bold tracking-widest">

                ORDER DETAILS

            </div>

            {/* ORDER INFO */}

            {currentOrder && (
                <div className="flex justify-between mt-5 mb-5">
                    <div className="card bg-base-200 shadow-md w-full">
                        <div className="card-body py-4">
                            <div className="flex flex-col md:flex-row justify-between gap-3 text-center">
                                <div>
                                    <div className="text-xs opacity-60"> ORDER NO </div>
                                    <div className="font-bold uppercase">
                                        {currentOrder.orderId}
                                    </div>
                                </div>
                                {/* <div>
                                    <div className="text-xs opacity-60">
                                        TABLE NO
                                    </div>
                                    <div className="text-xl font-bold text-primary ">
                                        {currentOrder.tableNo}
                                    </div>
                                </div> */}
                                <div>

                                    <div className="text-xs opacity-60 mb-1">
                                        TABLE NO
                                    </div>


                                    {!isEditingTable ? (

                                        <div className="flex items-center justify-center gap-2">

                                            <div className="text-xl font-bold text-primary">

                                                {currentOrder.tableNo || "Not Assigned"}

                                            </div>


                                            <button
                                                type="button"
                                                onClick={handleEditTable}
                                                className="btn btn-xs btn-outline btn-info"
                                            >
                                                EDIT
                                            </button>

                                        </div>

                                    ) : (

                                        <div className="flex items-center justify-center gap-2">

                                            <input
                                                type="text"
                                                value={editedTableNo}
                                                onChange={(e) =>
                                                    setEditedTableNo(e.target.value)
                                                }
                                                className="input input-bordered input-sm w-24 text-center"
                                                autoFocus
                                            />


                                            <button
                                                type="button"
                                                onClick={handleSaveTableNo}
                                                className="btn btn-xs btn-success"
                                            >
                                                SAVE
                                            </button>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsEditingTable(false)
                                                }
                                                className="btn btn-xs btn-ghost"
                                            >
                                                ✕
                                            </button>

                                        </div>

                                    )}

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


            {/* ADD PRODUCT FORM */}

            <form
                onSubmit={handleAddProduct}
                className="flex flex-wrap justify-center items-center gap-2"
            >


                {/* PRODUCT SELECT */}
                <div className="flex flex-col gap-2">
                    <label>ADD MORE PRODUCTS</label>
                    <div className="flex gap-2">
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
                                    e.target.value;

                                if (value === "") {

                                    setSelectedQty("");

                                } else {

                                    setSelectedQty(
                                        Number(value)
                                    );

                                }

                            }}

                        />


                        {/* ADD BUTTON */}

                        <button
                            type="submit"
                            className="btn btn-outline btn-success btn-sm h-[38px]"
                        >

                            ADD

                        </button>
                        {/* UNIT */}

                        <button
                            type="button"
                            onClick={handleAddUnitProduct}
                            className="btn btn-outline btn-info btn-sm h-[38px]"
                        >
                            UNIT
                        </button>
                    </div>
                </div>

            </form>


            {/* PRODUCT TABLE */}

            <div className="flex flex-col justify-center w-full p-5">
                <div className="flex items-center justify-center overflow-x-auto">
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


                            {currentOrder.items.length === 0 && (

                                <tr>

                                    <td
                                        colSpan={5}
                                        className="text-center py-5"
                                    >

                                        No products added

                                    </td>

                                </tr>

                            )}


                            {currentOrder.items.map(
                                (item, index) => (

                                    <tr key={item.id}>


                                        <td>
                                            {index + 1}
                                        </td>


                                        <td className="capitalize">
                                            {item.productName}
                                        </td>


                                        <td>
                                            {Number(
                                                item.saleRate
                                            ).toFixed(2)}
                                        </td>


                                        <td>

                                            <div className="flex items-center gap-2">


                                                {/* DECREASE */}

                                                <button

                                                    className="btn btn-xs"

                                                    onClick={() =>
                                                        dispatch(
                                                            decreaseItemQty({
                                                                orderId:
                                                                    currentOrder.orderId,

                                                                itemId:
                                                                    item.id
                                                            })
                                                        )
                                                    }
                                                >

                                                    -

                                                </button>


                                                {/* QTY */}

                                                <input

                                                    type="number"

                                                    className="input input-bordered input-sm w-20 text-center"

                                                    value={
                                                        item.productQty
                                                    }

                                                    onChange={e => {

                                                        const qty =
                                                            Number(
                                                                e.target.value
                                                            );

                                                        if (qty >= 0) {

                                                            dispatch(
                                                                updateItemQty({
                                                                    orderId:
                                                                        currentOrder.orderId,

                                                                    itemId:
                                                                        item.id,

                                                                    qty
                                                                })
                                                            );

                                                        }

                                                    }}

                                                />


                                                {/* INCREASE */}

                                                <button

                                                    className="btn btn-xs"

                                                    onClick={() =>
                                                        dispatch(
                                                            increaseItemQty({
                                                                orderId:
                                                                    currentOrder.orderId,

                                                                itemId:
                                                                    item.id
                                                            })
                                                        )
                                                    }
                                                >

                                                    +

                                                </button>


                                            </div>

                                        </td>


                                        <td>

                                            {(
                                                Number(item.saleRate) *
                                                Number(item.productQty)
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
                <div className="flex justify-center gap-5 mt-5">
                    <button
                        disabled={
                            currentOrder.items.length === 0
                        }

                        className="btn btn-info"

                        onClick={() =>
                            router.push(
                                `/orders`
                            )
                        }
                    >
                        BACK TO ORDER
                    </button>

                    <button
                        disabled={
                            currentOrder.items.length === 0
                        }

                        className="btn btn-success"

                        onClick={() =>
                            router.push(
                                `/order-sales?orderId=${currentOrder.orderId}`
                            )
                        }
                    >
                        SUBMIT TO SALE
                    </button>

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