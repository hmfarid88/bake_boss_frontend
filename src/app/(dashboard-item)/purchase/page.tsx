'use client'
import React, { useState, useEffect } from "react";
import { FcPlus } from "react-icons/fc";
import { RiDeleteBin6Line } from "react-icons/ri";
import Select from "react-select";
import { uid } from "uid";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, addProductMaterials, deleteProduct, deleteAllProducts } from "@/app/store/productSlice";
import { addItems, deleteItem, deleteAllItems } from "@/app/store/makeItemSlice";
import { addMaterials, deleteAllMaterials, deleteMaterials } from "@/app/store/materialSlice";
import { ToastContainer, toast } from 'react-toastify';


const Page: React.FC = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [pending, setPending] = useState(false);

  const dispatch = useAppDispatch();
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';

  const products = useAppSelector((state) => state.products.products);
  const addedItems = useAppSelector((state) => state.makeProducts.products);
  const addedMaterials = useAppSelector((state) => state.materialProducts.products);
  const addedProductMaterials = useAppSelector((state) => state.products.materials);
  const viewdispatch = useAppDispatch();
  const itemno = uid();
  const itemMaterials = addedItems.map(product => ({
    ...product,
    itemNo: itemno
  }));
  // Item add
  const [itemName, setItemName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [qty, setQty] = useState('');

  const handleAddItem = (e: any) => {
    e.preventDefault();
    if (!itemName || !ingredients || !qty) {
      toast.warning("Item is empty !");
      return;
    }
    const productItems = { id: uid(), itemName, materialsName: ingredients, qty, username }
    dispatch(addItems(productItems))
    setQty('');
  };

  const handleDeleteItem = (id: any) => {
    viewdispatch(deleteItem(id));
  };

  const handleFinalItemsSubmit = async (e: any) => {
    e.preventDefault();
    if (addedItems.length === 0) {
      toast.warning("Sorry, Your item list is empty!");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/itemMake`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemMaterials),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message);
      } else {
        viewdispatch(deleteAllItems());
        setShouldFetch(true);
        toast.success("Items added successfully !");
      }

    } catch (error: any) {
      toast.warning("This item is exist")
    } finally {
      setPending(false);
    }
  };

  // materials add
  const [materialDate, setMaterialDate] = useState("");
  const [mSupplierName, setMSupplierName] = useState("");
  const [mSupplierInvoice, setMSupplierInvoice] = useState("");
  const [materialsName, setMaterialsName] = useState("");
  const [materialsRate, setMaterialsRate] = useState("");
  const [materialsQty, setMaterialsQty] = useState("");

  const handleAddMaterials = (e: any) => {
    e.preventDefault();
    if (!mSupplierName || !mSupplierInvoice || !materialsName || !materialsRate || !materialsQty) {
      toast.warning("Item is empty !");
      return;
    }
    const materialsItem = { id: uid(), date: maxDate, supplierName: mSupplierName, supplierInvoice: mSupplierInvoice, materialsName, materialsRate, materialsQty, username, status: 'stored' };
    dispatch(addMaterials(materialsItem))
    setMaterialsRate('');
    setMaterialsQty('');
  };

  const handleDeleteMaterials = (id: any) => {
    viewdispatch(deleteMaterials(id));
  };

  const handleFinalMaterialsSubmit = async (e: any) => {
    e.preventDefault();
    if (addedMaterials.length === 0) {
      toast.warning("Sorry, Your item list is empty!");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/addAllMaterials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addedMaterials),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message);
      } else {
        viewdispatch(deleteAllMaterials());
        toast.success("Materials added successfully !");
      }

    } catch (error) {
      toast.error("Invalid product item !")
    } finally {
      setPending(false)
    }
  };

  // stock add
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



  const calculateCost = () => {
    return items.reduce((cost, item) => cost + (item.averageRate * item.qty), 0);
  };
  const calculateDp = () => {
    return items.reduce((dp, item) => dp + ((item.averageRate * item.qty)+((item.averageRate * item.qty * 5) / 100)), 0);

  };
  const calculateRp = () => {
    return items.reduce((rp, item) => rp + ((item.averageRate * item.qty)+((item.averageRate * item.qty * 7) / 100)), 0);
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
    }
    const product = { id: pid, date: maxDate, category, productName, costPrice: calculateCost().toFixed(2), dpRate: calculateDp().toFixed(2), rpRate: calculateRp().toFixed(2), productQty, username, status: 'stored' }
    dispatch(addProducts(product));
    handleMaterialsSubmit();
    setProductQty("");

  }
  const handleDeleteProduct = (id: any) => {
    viewdispatch(deleteProduct(id));
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
        viewdispatch(deleteAllProducts());
        toast.success("Product added successfully !");
      }

    } catch (error) {
      toast.error("Invalid product item !")
    } finally {
      setPending(false);
    }
  };


  const [maxDate, setMaxDate] = useState('');
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setMaxDate(formattedDate);
  }, []);

  const [categoryName, setCategoryName] = useState("");
  const handleCategorySubmit = async (e: any) => {
    e.preventDefault();

    if (!categoryName) {
      toast.warning("Category name is empty !")
      return;
    }
    setPending(true)
    try {
      const response = await fetch(`${apiBaseUrl}/api/addCategoryName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryName, username }),
      });

      if (response.ok) {
        toast.success("Item added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid product name !")
    } finally {
      setPending(false);
      setCategoryName("");
    }

  };

  const [ingredientsName, setIngredientsName] = useState("");
  const handleIngredientSubmit = async (e: any) => {
    e.preventDefault();
    if (!ingredientsName) {
      toast.warning("Item is empty !");
      return;
    }
    setPending(true)
    try {
      const response = await fetch(`${apiBaseUrl}/api/addMaterialsName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ materialsName: ingredientsName, username }),
      });

      if (response.ok) {
        toast.success("Item added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error("Sorrry, invalid item name!")
    } finally {
      setPending(false);
      setIngredientsName("");
    }
  };

  const [supplierName, setSupplierName] = useState("");
  const handleSupplierItemSubmit = async (e: any) => {
    e.preventDefault();
    if (!supplierName) {
      toast.warning("Item is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/addSupplierName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ supplierName, username }),
      });

      if (response.ok) {
        toast.success("Supplier added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid supplier name !")
    } finally {
      setPending(false);
      setSupplierName("");
    }
  };
  const [categoryOption, setCategoryOption] = useState([]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getCategoryName?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map((item: any) => ({
          id: item.id,
          value: item.categoryName,
          label: item.categoryName
        }));
        setCategoryOption(transformedData);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, categoryName, username]);

  const [materialsOption, setMaterialsOption] = useState([]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getMaterialsName?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map((item: any) => ({
          id: item.id,
          value: item.materialsName,
          label: item.materialsName
        }));
        setMaterialsOption(transformedData);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, ingredientsName, username]);

  const [supplierOption, setSupplierOption] = useState([]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getSuppliersName?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map((item: any) => ({
          id: item.id,
          value: item.supplierName,
          label: item.supplierName
        }));
        setSupplierOption(transformedData);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, supplierName, username]);

  const [shouldFetch, setShouldFetch] = useState(true);
  const [itemOption, setItemOption] = useState([]);
  useEffect(() => {
    if (shouldFetch) {
      fetch(`${apiBaseUrl}/api/getMadeProducts?username=${username}`)
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
  }, [shouldFetch, apiBaseUrl, username]);

  return (
    <div className="container-2xl min-h-screen">
      <div className="flex w-full justify-end">
        <div>
          <a href="#my_modal_1" className="btn btn-circle btn-ghost"><FcPlus size={35} /></a>
          <div className="modal sm:modal-middle" role="dialog" id="my_modal_1">
            <div className="modal-box">
              <h3 className="font-bold text-lg">ADD ITEM</h3>

              <div className="flex w-full items-center justify-center p-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text-alt">ADD CATEGORY</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <input type="text" value={categoryName} name="colorItem" onChange={(e: any) => setCategoryName(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" required />
                    <button onClick={handleCategorySubmit} disabled={pending} className="btn btn-square btn-success">{pending ? "Adding..." : "ADD"}</button>
                  </div>
                </label>
              </div>

              <div className="flex w-full items-center justify-center p-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text-alt">ADD MATERIALS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <input type="text" value={ingredientsName} name="productItem" onChange={(e: any) => setIngredientsName(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" required />
                    <button onClick={handleIngredientSubmit} disabled={pending} className="btn btn-square btn-success">{pending ? "Adding..." : "ADD"}</button>
                  </div>
                </label>
              </div>

              <div className="flex w-full items-center justify-center p-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text-alt">ADD SUPPLIER</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <input type="text" value={supplierName} name="supplierItem" onChange={(e: any) => setSupplierName(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" required />
                    <button onClick={handleSupplierItemSubmit} disabled={pending} className="btn btn-square btn-success">{pending ? "Adding..." : "ADD"}</button>
                  </div>
                </label>
              </div>
              <div className="modal-action">
                <a href="#" className="btn btn-square btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-10 h-10">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full">
        <div role="tablist" className="tabs tabs-bordered p-3">
          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="ITEM MAKING" defaultChecked />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full items-center">
              <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text-alt">ITEM NAME</span>
                  </div>
                  <input type="text" name="item" onChange={(e: any) => setItemName(e.target.value)} placeholder="Type here" className="border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" required />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text-alt">MATERIALS NAME</span>
                  </div>
                  <Select className="text-black" name="ingredient" onChange={(selectedOption: any) => setIngredients(selectedOption.value)} options={materialsOption} required />

                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text-alt">QTY (GRAM / PS)</span>
                  </div>
                  <input type="number" name="qty" value={qty} onChange={(e: any) => setQty(e.target.value)} placeholder="Type here" className="border rounded-md p-2 w-full max-w-xs h-[40px] bg-white text-black" required />
                </label>

                <label className="form-control w-full max-w-xs pt-8">
                  <button onClick={handleAddItem} className="btn btn-accent btn-sm h-[40px] w-full max-w-xs" >Add Item</button>
                </label>
              </div>
              <div className="flex w-full">
                <div className="overflow-x-auto max-h-64">
                  <table className="table table-pin-rows">
                    <thead>
                      <tr className="font-bold">
                        <th>SN</th>
                        <th>PRODUCT NAME</th>
                        <th>MATERIALS NAME</th>
                        <th>QTY</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addedItems.map((item: any, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item?.itemName}</td>
                          <td>{item?.materialsName}</td>
                          <td>{item?.qty}</td>
                          <td><button className="btn-xs rounded-md btn-outline btn-error" onClick={() => handleDeleteItem(item.id)}><RiDeleteBin6Line size={16} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex items-center justify-center pt-10">
                    <button onClick={handleFinalItemsSubmit} className="btn btn-success btn-outline btn-sm max-w-xs" disabled={pending} >{pending ? "Submitting..." : "Add All Items"}</button>
                  </div>

                </div>

              </div>
            </div>
          </div>
          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="MATERIALS STOCK" />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <div className="flex w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">

                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text-alt">STOCK DATE</span>
                    </div>
                    <input type="date" name="date" onChange={(e: any) => setMaterialDate(e.target.value)} max={maxDate} value={maxDate} className="border rounded-md p-2 bg-white text-black  w-full max-w-xs h-[40px]" readOnly />
                  </label>
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text-alt">SUPPLIER NAME</span>
                    </div>
                    <Select className="text-black" name="psupplier" onChange={(selectedOption: any) => setMSupplierName(selectedOption.value)} options={supplierOption} required />
                  </label>
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text-alt">SUPPLIER INVOICE NO</span>
                    </div>
                    <input type="text" name="sinvoice" onChange={(e: any) => setMSupplierInvoice(e.target.value)} placeholder="Type here" className="border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" required />
                  </label>


                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text-alt">MATERIALS NAME</span>
                    </div>
                    <Select className="text-black" name="materialsname" onChange={(selectedOption: any) => setMaterialsName(selectedOption.value)} options={materialsOption} required />
                  </label>
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text-alt">RATE (PER GRAM / PS)</span>
                    </div>
                    <input type="number" name="item" value={materialsRate} onChange={(e: any) => setMaterialsRate(e.target.value)} placeholder="Type here" className="border rounded-md p-2 w-full max-w-xs h-[40px] bg-white text-black" required />
                  </label>
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text-alt">QTY (GRAM / PS)</span>
                    </div>
                    <input type="number" name="item" value={materialsQty} onChange={(e: any) => setMaterialsQty(e.target.value)} placeholder="Type here" className="border rounded-md p-2 w-full max-w-xs h-[40px] bg-white text-black" required />
                  </label>

                  <label className="form-control w-full max-w-xs pt-7">
                    <button onClick={handleAddMaterials} className="btn btn-accent btn-sm h-[40px] w-full max-w-xs" >Add Material</button>
                  </label>

                </div>
                <div className="flex w-full">
                  <div className="overflow-x-auto max-h-64">
                    <table className="table table-pin-rows">
                      <thead>
                        <tr className="font-bold">
                          <th>Date</th>
                          <th>Supplier</th>
                          <th>Invoice</th>
                          <th>Materials</th>
                          <th>Rate</th>
                          <th>Qty</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {addedMaterials?.map((item, index) => (
                          <tr key={index}>
                            <td>{item.date}</td>
                            <td>{item.supplierName}</td>
                            <td>{item.supplierInvoice}</td>
                            <td>{item.materialsName}</td>
                            <td>{item.materialsRate}</td>
                            <td>{item.materialsQty}</td>
                            <td>
                              <button onClick={() => {
                                handleDeleteMaterials(item.id);
                              }} className="btn-xs rounded-md btn-outline btn-error"><RiDeleteBin6Line size={16} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex items-center justify-center pt-10">
                      <button onClick={handleFinalMaterialsSubmit} className="btn btn-success btn-outline btn-sm max-w-xs" disabled={pending} >{pending ? "Submitting..." : "Add All Items"}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="PRODUCT STOCK" />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
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
          </div>
        </div>
      </div>
      <ToastContainer autoClose={2000} theme="dark" />
    </div>
  )
}

export default Page