// "use client"
// import React, { useEffect, useState } from 'react'
// import { toast } from 'react-toastify';
// import { useAppSelector } from '../store';
// import Select from "react-select";

// const ProductMrp = () => {
//     const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
//     const uname = useAppSelector((state) => state.username.username);
//     const username = uname ? uname.username : 'Guest';
//     const [pending, setPending] = useState(false);
//     const [productName, setProductName] = useState("");
//     const [productValue, setProductValue] = useState("");
//     const [unitValue, setUnitValue] = useState<number>(0);
//     const [qtyPerKg, setQtyPerKg] = useState("");

//     const handleProductRateSubmit = async (e: any) => {
//         e.preventDefault();
//         if (!productName || !productValue) {
//             toast.warning("Field is empty !");
//             return;
//         }
//         setPending(true);
//         try {
//             const response = await fetch(`${apiBaseUrl}/api/productRateSetup`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ productName, saleRate: productValue, unitRate: unitValue, qty: qtyPerKg, username }),
//             });

//             if (response.ok) {
//                 toast.success("Rate added successfully !");
//             } else {
//                 const data = await response.json();
//                 toast.error(data.message);
//             }
//         } catch (error: any) {
//             toast.error(error.message)
//         } finally {
//             setPending(false);
//             setProductValue("");
//             setUnitValue(0);
//             setQtyPerKg("");
//         }
//     };


// type OptionType = {
//   value: string;
//   label: string;
// };

// const [itemOption, setItemOption] = useState<OptionType[]>([]);
// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       // fetch both APIs together
//       const [additionalRes, madeProductsRes] = await Promise.all([
//         fetch(`${apiBaseUrl}/api/getAdditionalName`),
//         fetch(`${apiBaseUrl}/api/getMadeProducts?username=${username}`)
//       ]);

//       const additionalData = await additionalRes.json();
//       const madeProductsData = await madeProductsRes.json();

//       // transform first API
//       const additionalOptions = additionalData.map((item: any) => ({
//         value: item.additionalName,
//         label: item.additionalName
//       }));

//       // transform second API
//       const madeProductOptions = madeProductsData.map((madeItem: any) => ({
//         value: madeItem,
//         label: madeItem
//       }));

//       // merge both arrays
//       setItemOption([
//         ...additionalOptions,
//         ...madeProductOptions
//       ]);

//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   fetchData();
// }, [apiBaseUrl]);

//     return (
//         <div className="flex flex-col gap-3 w-full items-center justify-center p-2">
//             <label className="form-control w-full max-w-xs pt-5">
//                 <div className="label">
//                     <span className="label-text-alt">SELECT PRODUCT</span>
//                 </div>
//                 <Select className="text-black" name="psupplier" onChange={(selectedOption: any) => setProductName(selectedOption.value)} options={itemOption} />
//             </label>
//             <label className="form-control w-full max-w-xs">
//                 <div className="label">
//                     <span className="label-text-alt">SALE RATE</span>
//                 </div>
//                 <input type="number" value={productValue} onChange={(e: any) => setProductValue(e.target.value)} placeholder="Type here" className="input-bordered border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" />
//             </label>
//             <label className="form-control w-full max-w-xs">
//                 <div className="label">
//                     <span className="label-text-alt">UNIT RATE</span>
//                 </div>
//                 <input type="number" value={unitValue} onChange={(e: any) => setUnitValue(e.target.value)} placeholder="Type here" className="input-bordered border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" />
//             </label>
//             <label className="form-control w-full max-w-xs">
//                 <div className="label">
//                     <span className="label-text-alt">QTY PER KG</span>
//                 </div>
//                 <input type="number" value={qtyPerKg} onChange={(e: any) => setQtyPerKg(e.target.value)} placeholder="Type here" className="input-bordered border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" />
//             </label>
//             <label className="form-control w-full max-w-xs">
//                 <button onClick={handleProductRateSubmit} disabled={pending} className="btn btn-outline btn-success">{pending ? "Adding..." : "SUBMIT"}</button>
//             </label>
//         </div>
//     )
// }

// export default ProductMrp

"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../store";
import Select from "react-select";

type OptionType = {
    value: string;
    label: string;
};

type ProductRate = {
    productName: string;
    saleRate: number | string;
    unitRate: number | string;
    qty: number | string;
};

const ProductMrp = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : "Guest";

    const [pending, setPending] = useState(false);

    const [productName, setProductName] = useState("");
    const [productValue, setProductValue] = useState("");
    const [unitValue, setUnitValue] = useState("");
    const [qtyPerKg, setQtyPerKg] = useState("");

    const [itemOption, setItemOption] = useState<OptionType[]>([]);

    // Whether selected product already has rate information
    const [isEditMode, setIsEditMode] = useState(false);

    /*
     * Fetch product list
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [additionalRes, madeProductsRes, materialProductsRes] = await Promise.all([
                    fetch(`${apiBaseUrl}/api/getAdditionalName`),
                    fetch(`${apiBaseUrl}/api/getMadeProducts?username=${username}`),
                    fetch(`${apiBaseUrl}/sales/getMaterialProducts`),
                ]);

                const additionalData = await additionalRes.json();
                const madeProductsData = await madeProductsRes.json();
                const materialProductsData = await materialProductsRes.json();

                const additionalOptions = additionalData.map((item: any) => ({
                    value: item.additionalName,
                    label: item.additionalName,
                }));

                const madeProductOptions = madeProductsData.map(
                    (madeItem: string) => ({
                        value: madeItem,
                        label: madeItem,
                    })
                );

                const materialProductOptions = materialProductsData.map(
                    (materialItem: string) => ({
                        value: materialItem,
                        label: materialItem
                    })
                );
                // Merge all products
                const allProducts = [
                    ...additionalOptions,
                    ...madeProductOptions,
                    ...materialProductOptions
                ];

                // Remove duplicate product names
                const uniqueProducts = Array.from(
                    new Map(
                        allProducts.map(item => [
                            item.value,
                            item
                        ])
                    ).values()
                );

                setItemOption(uniqueProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        if (username && username !== "Guest") {
            fetchData();
        }
    }, [apiBaseUrl, username]);

    /*
     * Fetch rate information when product is selected
     */
    useEffect(() => {
        if (!productName) {
            setProductValue("");
            setUnitValue("");
            setQtyPerKg("");
            setIsEditMode(false);
            return;
        }

        const fetchProductRate = async () => {
            try {
                const response = await fetch(
                    `${apiBaseUrl}/api/getProductRate?productName=${encodeURIComponent(
                        productName
                    )}&username=${encodeURIComponent(username)}`
                );

                if (response.ok) {
                    const data: ProductRate = await response.json();

                    /*
                     * Product exists
                     */
                    if (data) {
                        setProductValue(String(data.saleRate ?? ""));
                        setUnitValue(String(data.unitRate ?? ""));
                        setQtyPerKg(String(data.qty ?? ""));

                        setIsEditMode(true);
                    }
                } else if (response.status === 404) {
                    /*
                     * Product does not exist
                     */
                    setProductValue("");
                    setUnitValue("");
                    setQtyPerKg("");

                    setIsEditMode(false);
                }
            } catch (error) {
                console.error("Error fetching product rate:", error);

                setProductValue("");
                setUnitValue("");
                setQtyPerKg("");
                setIsEditMode(false);
            }
        };

        fetchProductRate();
    }, [productName, username, apiBaseUrl]);

    /*
     * Submit / Update
     */
    const handleProductRateSubmit = async (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.preventDefault();

        if (!productName || !productValue) {
            toast.warning("Field is empty!");
            return;
        }

        setPending(true);

        try {
            const response = await fetch(
                `${apiBaseUrl}/api/productRateSetup`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        productName,
                        saleRate: Number(productValue),
                        unitRate: Number(unitValue),
                        qty: Number(qtyPerKg),
                        username,
                    }),
                }
            );

            if (response.ok) {
                toast.success(
                    isEditMode
                        ? "Rate updated successfully!"
                        : "Rate added successfully!"
                );

                setIsEditMode(true);
            } else {
                const data = await response.json();
                toast.error(data.message || "Something went wrong!");
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong!");
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="flex flex-col gap-3 w-full items-center justify-center p-2">

            {/* PRODUCT */}
            <label className="form-control w-full max-w-xs pt-5">
                <div className="label">
                    <span className="label-text-alt">
                        SELECT PRODUCT
                    </span>
                </div>

                <Select
                    className="text-black"
                    name="productName"
                    value={
                        productName
                            ? {
                                value: productName,
                                label: productName,
                            }
                            : null
                    }
                    onChange={(selectedOption) => {
                        if (selectedOption) {
                            setProductName(selectedOption.value);
                        } else {
                            setProductName("");
                        }
                    }}
                    options={itemOption}
                    isClearable
                />
            </label>

            {/* SALE RATE */}
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text-alt">
                        SALE RATE
                    </span>
                </div>

                <input
                    type="number"
                    value={productValue}
                    onChange={(e) =>
                        setProductValue(e.target.value)
                    }
                    placeholder="Type here"
                    className="input-bordered border rounded-md p-2 w-full max-w-xs h-[40px] bg-white text-black"
                />
            </label>

            {/* UNIT RATE */}
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text-alt">
                        UNIT RATE
                    </span>
                </div>

                <input
                    type="number"
                    value={unitValue}
                    onChange={(e) =>
                        setUnitValue(e.target.value)
                    }
                    placeholder="Type here"
                    className="input-bordered border rounded-md p-2 w-full max-w-xs h-[40px] bg-white text-black"
                />
            </label>

            {/* QTY PER KG */}
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text-alt">
                        QTY PER KG
                    </span>
                </div>

                <input
                    type="number"
                    value={qtyPerKg}
                    onChange={(e) =>
                        setQtyPerKg(e.target.value)
                    }
                    placeholder="Type here"
                    className="input-bordered border rounded-md p-2 w-full max-w-xs h-[40px] bg-white text-black"
                />
            </label>

            {/* BUTTON */}
            <label className="form-control w-full max-w-xs">
                <button
                    onClick={handleProductRateSubmit}
                    disabled={pending || !productName}
                    className="btn btn-outline btn-success"
                >
                    {pending
                        ? isEditMode
                            ? "Updating..."
                            : "Adding..."
                        : isEditMode
                            ? "UPDATE"
                            : "SUBMIT"}
                </button>
            </label>
        </div>
    );
};

export default ProductMrp;