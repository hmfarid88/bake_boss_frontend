"use client"
import React, { useEffect, useState } from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import Select from "react-select";
import { uid } from "uid";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, addProductMaterials, deleteProduct, deleteAllProducts } from "@/app/store/productSlice";
import { toast } from 'react-toastify';

const ProductStock = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [pending, setPending] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(true);

    const dispatch = useAppDispatch();
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    const products = useAppSelector((state) => state.products.products);
    const addedProductMaterials = useAppSelector((state) => state.products.materials);

    const [maxDate, setMaxDate] = useState('');
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setMaxDate(formattedDate);
    }, []);

    const [stockDate, setStockDate] = useState("");
    const [category, setCategory] = useState("");
    const [productName, setProductName] = useState("");
    const [productQty, setProductQty] = useState("");
    const numericProductQty: number = Number(productQty);

    interface items {
        itemName: string,
        qty: number,
        averageRate: number,
        remainingQty: number,
        materialsName: string
    }
    interface MarginSetup {
        dpMargin: number;
        rpMargin: number;
    }
    const [items, setItems] = useState<items[]>([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getItemList?username=${username}&itemName=${productName}`)
            .then(response => response.json())
            .then(data => {
                setItems(data);
            })
            .catch(error => {
                // toast.error("Failed to fetch items.");
            });
    }, [apiBaseUrl, productName, username]);
    const [marginSetup, setMarginSetup] = useState<MarginSetup | null>(null);
    useEffect(() => {
        const fetchMarginSetup = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/paymentApi/getMargin?username=${username}&productName=${productName}`);
                if (response.ok) {
                    const data = await response.json();
                    setMarginSetup(data);
                }
            } catch (error) {
                toast.error("Error fetching margin setup.");
            }
        };

        if (username !== 'Guest') {
            fetchMarginSetup();
        }
    }, [apiBaseUrl, username, productName]);

    const calculateCost = () => {
        return items.reduce((cost, item) => cost + (item.averageRate * item.qty), 0);
    };

    const calculateDp = () => {
        if (!marginSetup) {
            return 0;
        }

        return items.reduce((dp, item) =>
            dp + ((item.averageRate * item.qty) + ((item.averageRate * item.qty * marginSetup.dpMargin) / 100)), 0
        );
    };

    const calculateRp = () => {
        if (!marginSetup) {
            return 0;
        }
        return items.reduce((rp, item) =>
            rp + ((item.averageRate * item.qty) + ((item.averageRate * item.qty * marginSetup.rpMargin) / 100)), 0);
    };
    const pid = uid();
  const handleMaterialsSubmit = async () => {
    try {
      const updatedItems = items.map(item => ({
        ...item,
        remainingQty: (item.remainingQty - (item.qty * numericProductQty)),
        madeItem: item.itemName,
        status: 'used',
        date: maxDate,
        materialsRate: item.averageRate,
        username: username,
        materialsName: item.materialsName,
        averageRate: item.averageRate,
        materialsQty: item.qty * numericProductQty,
        id: pid
      }));
      updatedItems.forEach(item => {
        dispatch(addProductMaterials(item));
      });
    } catch (error) {
      toast.error('Failed to update items.');
    }
  };
    const handleProductStock = (e: any) => {
        e.preventDefault();
        if (!category || !productName || !productQty) {
            toast.warning("Item is empty !");
            return;
        } else if (calculateCost() <= 0) {
            toast.warning('Not enough materials for this item !');
            return;
        } else if (calculateDp() <= 0 || calculateRp() <= 0) {
            toast.warning('DP Rate & RP Rate not added !');
            return;
        }
        const product = { id: pid, date: maxDate, category, productName, costPrice: calculateCost().toFixed(2), dpRate: calculateDp().toFixed(2), rpRate: calculateRp().toFixed(2), productQty, username, status: 'stored' }
        dispatch(addProducts(product));
        handleMaterialsSubmit();
        setProductQty("");

    }
    const handleDeleteProduct = (id: any) => {
        dispatch(deleteProduct(id));
    };

    const handleFinalStockSubmit = async (e: any) => {
        e.preventDefault();
        if (products.length === 0) {
            toast.warning("Sorry, your product list is empty!");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/addAllProducts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(products),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            } else {
                const response = await fetch(`${apiBaseUrl}/api/updateMaterialsStock`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(addedProductMaterials),
                });
                dispatch(deleteAllProducts());
                toast.success("Product added successfully !");
            }

        } catch (error) {
            toast.error("Invalid product item !")
        } finally {
            setPending(false);
        }
    };
    const [categoryOption, setCategoryOption] = useState([]);
  useEffect(() => {
    if (shouldFetch) {
    fetch(`${apiBaseUrl}/api/getCategoryName?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map((item: any) => ({
          id: item.id,
          value: item.categoryName,
          label: item.categoryName
        }));
        setCategoryOption(transformedData);
        setShouldFetch(false);
      })
      .catch(error => console.error('Error fetching products:', error));
    }
  }, [apiBaseUrl, shouldFetch, username]);

  
  const [itemOption, setItemOption] = useState([]);
  useEffect(() => {
    if (shouldFetch) {
      fetch(`${apiBaseUrl}/api/getMadeProducts`)
        .then(response => response.json())
        .then(data => {
          const transformedData = data.map((madeItem: any) => ({
            value: madeItem,
            label: madeItem
          }));
          setItemOption(transformedData);
          setShouldFetch(false);
        })
        .catch(error => console.error('Error fetching products:', error));
    }
  }, [shouldFetch, apiBaseUrl]);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-center">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">STOCK DATE</span>
                    </div>
                    <input type="date" name="date" onChange={(e: any) => setStockDate(e.target.value)} max={maxDate} value={maxDate} className="border rounded-md p-2 bg-white text-black  w-full max-w-xs h-[40px]" readOnly />
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">CATEGORY</span>
                    </div>
                    <Select className="text-black" name="catagory" onChange={(selectedOption: any) => setCategory(selectedOption.value)} options={categoryOption} required />
                </label>

                <label className="form-control w-full max-w-xs pt-5">
                    <div className="label">
                        <span className="label-text-alt">PRODUCT NAME</span>
                    </div>
                    <Select className="text-black" name="pname" onChange={(selectedOption: any) => setProductName(selectedOption.value)} options={itemOption} required />
                    <p className="text-xs pt-2">Cost: {calculateCost().toFixed(2)} | Dp: {calculateDp().toFixed(2)} | Rp: {calculateRp().toFixed(2)}</p>
                </label>

                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">PRODUCT QTY</span>
                    </div>
                    <input type="number" maxLength={5} name="pqty" value={productQty} placeholder="Type here" onChange={(e: any) => setProductQty(e.target.value.replace(/\D/g, ""))} className="border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" required />
                </label>
                <label className="form-control w-full max-w-xs pt-7">
                    <button onClick={handleProductStock} className="btn btn-accent btn-sm h-[40px] w-full max-w-xs" >Add Product</button>
                </label>
            </div>


            <div className="flex flex-col w-full">
                <div className="overflow-x-auto max-h-64">
                    <table className="table table-pin-rows">
                        <thead>
                            <tr className="font-bold">
                                <th>SN</th>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Products</th>
                                <th>Cost</th>
                                <th>DP</th>
                                <th>RP</th>
                                <th>Qty</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products?.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.date}</td>
                                    <td>{item.category}</td>
                                    <td>{item.productName}</td>
                                    <td>{item.costPrice}</td>
                                    <td>{item.dpRate}</td>
                                    <td>{item.rpRate}</td>
                                    <td>{item.productQty}</td>
                                    <td>
                                        <button onClick={() => {
                                            handleDeleteProduct(item.id);
                                        }} className="btn-xs rounded-md btn-outline btn-error"><RiDeleteBin6Line size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
                <div className="flex items-center justify-center pt-10">
                    <button onClick={handleFinalStockSubmit} className="btn btn-success btn-outline btn-sm max-w-xs" disabled={pending} >{pending ? "Submitting..." : "Add All Products"}</button>
                </div>
            </div>
        </div>
    )
}

export default ProductStock