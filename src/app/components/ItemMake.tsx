"use client"
import React, { useEffect, useState } from 'react'
import { addItems, deleteItem, deleteAllItems } from "@/app/store/makeItemSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import Select from "react-select";
import { uid } from "uid";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { toast } from 'react-toastify';
const ItemMake = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [pending, setPending] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(true);

    const addedItems = useAppSelector((state) => state.makeProducts.products);
    const dispatch = useAppDispatch();
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [itemName, setItemName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [qty, setQty] = useState('');
   const itemno = uid();
  const itemMaterials = addedItems.map(product => ({
    ...product,
    itemNo: itemno
  }));
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
      dispatch(deleteItem(id));
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
          dispatch(deleteAllItems());
          setShouldFetch(true);
          toast.success("Items added successfully !");
        }
  
      } catch (error: any) {
        toast.warning("This item is exist")
      } finally {
        setPending(false);
      }
    };

    const [materialsOption, setMaterialsOption] = useState([]);
  useEffect(() => {
    if (shouldFetch) {
    fetch(`${apiBaseUrl}/api/getMaterialsName?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map((item: any) => ({
          id: item.id,
          value: item.materialsName,
          label: item.materialsName
        }));
        setMaterialsOption(transformedData);
        setShouldFetch(false);
      })
      .catch(error => console.error('Error fetching products:', error));
    }
  }, [shouldFetch, apiBaseUrl, username]);
  return (
  
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
                    <span className="label-text-alt">QTY (KG / PS)</span>
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
         
  )
}

export default ItemMake