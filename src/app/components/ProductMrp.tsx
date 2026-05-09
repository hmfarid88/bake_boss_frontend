"use client"
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useAppSelector } from '../store';
import Select from "react-select";

const ProductMrp = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [pending, setPending] = useState(false);
    const [productName, setProductName] = useState("");
    const [productValue, setProductValue] = useState("");
    const [unitValue, setUnitValue] = useState<number>(0);
    const [qtyPerKg, setQtyPerKg] = useState("");

    const handleProductRateSubmit = async (e: any) => {
        e.preventDefault();
        if (!productName || !productValue) {
            toast.warning("Field is empty !");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/productRateSetup`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productName, saleRate: productValue, unitRate: unitValue, qty: qtyPerKg, username }),
            });

            if (response.ok) {
                toast.success("Rate added successfully !");
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setPending(false);
            setProductValue("");
            setUnitValue(0);
            setQtyPerKg("");
        }
    };


    // const [itemOption, setItemOption] = useState([]);
    //   useEffect(() => {
    //     const fetchMadeProducts = () => {
    //       fetch(`${apiBaseUrl}/api/getAdditionalName`)
    //         .then(response => response.json())
    //         .then(data => {
    //           const transformedData = data.map((item: any) => ({
    //             value: item.additionalName,
    //             label: item.additionalName
    //           }));
    //           setItemOption(transformedData);
    //         })
    //         .catch(error => console.error('Error fetching products:', error));
    //     };
    
    //     // Fetch data initially
    //     fetchMadeProducts();
    //   }, [apiBaseUrl]);

    //  const [itemOption, setItemOption] = useState([]);
    //     useEffect(() => {
    
    //         const fetchMadeProducts = () => {
    //             fetch(`${apiBaseUrl}/api/getMadeProducts`)
    //                 .then(response => response.json())
    //                 .then(data => {
    //                     const transformedData = data.map((madeItem: any) => ({
    //                         value: madeItem,
    //                         label: madeItem
    //                     }));
    //                     setItemOption(transformedData);
    //                 })
    //                 .catch(error => console.error('Error fetching products:', error));
    //         };
    
    //         // Fetch data initially
    //         fetchMadeProducts();
    //     }, [apiBaseUrl, itemOption]);

type OptionType = {
  value: string;
  label: string;
};

const [itemOption, setItemOption] = useState<OptionType[]>([]);
useEffect(() => {
  const fetchData = async () => {
    try {
      // fetch both APIs together
      const [additionalRes, madeProductsRes] = await Promise.all([
        fetch(`${apiBaseUrl}/api/getAdditionalName`),
        fetch(`${apiBaseUrl}/api/getMadeProducts`)
      ]);

      const additionalData = await additionalRes.json();
      const madeProductsData = await madeProductsRes.json();

      // transform first API
      const additionalOptions = additionalData.map((item: any) => ({
        value: item.additionalName,
        label: item.additionalName
      }));

      // transform second API
      const madeProductOptions = madeProductsData.map((madeItem: any) => ({
        value: madeItem,
        label: madeItem
      }));

      // merge both arrays
      setItemOption([
        ...additionalOptions,
        ...madeProductOptions
      ]);

    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  fetchData();
}, [apiBaseUrl]);

    return (
        <div className="flex flex-col gap-3 w-full items-center justify-center p-2">
            <label className="form-control w-full max-w-xs pt-5">
                <div className="label">
                    <span className="label-text-alt">SELECT PRODUCT</span>
                </div>
                <Select className="text-black" name="psupplier" onChange={(selectedOption: any) => setProductName(selectedOption.value)} options={itemOption} />
            </label>
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text-alt">SALE RATE</span>
                </div>
                <input type="number" value={productValue} onChange={(e: any) => setProductValue(e.target.value)} placeholder="Type here" className="input-bordered border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" />
            </label>
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text-alt">UNIT RATE</span>
                </div>
                <input type="number" value={unitValue} onChange={(e: any) => setUnitValue(e.target.value)} placeholder="Type here" className="input-bordered border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" />
            </label>
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text-alt">QTY PER KG</span>
                </div>
                <input type="number" value={qtyPerKg} onChange={(e: any) => setQtyPerKg(e.target.value)} placeholder="Type here" className="input-bordered border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" />
            </label>
            <label className="form-control w-full max-w-xs">
                <button onClick={handleProductRateSubmit} disabled={pending} className="btn btn-outline btn-success">{pending ? "Adding..." : "SUBMIT"}</button>
            </label>
        </div>
    )
}

export default ProductMrp