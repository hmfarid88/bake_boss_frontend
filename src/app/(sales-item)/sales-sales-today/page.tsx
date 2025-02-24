'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import DateToDate from "@/app/components/DateToDate";
import Link from "next/link";
import CurrentDate from "@/app/components/CurrentDate";
import { FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";

type Product = {
  productId: number;
  date: string;
  time: string;
  category: string;
  productName: string;
  soldInvoice: string;
  customerName: string;
  phoneNumber: string;
  saleRate: number;
  discount: number;
  productQty: number;
};


const Page = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';

  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
  });
  const [filterCriteria, setFilterCriteria] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [updatedQty, setUpdatedQty] = useState("");
  const [updatedDiscount, setUpdatedDiscount] = useState('');

  const handleEditClick = (product: any) => {
    setSelectedProduct(product);
  };


  const handleQtyUpdate = async (productId: number) => {

    if (!updatedQty) {
      toast.warning("Quantity is empty !");
      return;
    }
    try {
      const response = await fetch(`${apiBaseUrl}/sales/update-quantity/${productId}?username=${username}&newQty=${updatedQty}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setUpdatedQty("");
        toast.success("Update Successful!");
      } else {
        const data = await response.json();
        toast.warning(data.message || "Something went wrong!");
      }
    } catch (error: any) {
      toast.error("Failed to update quantity: " + error.message);
    }
  };

  const handleDiscountUpdate = async (productId: number) => {
    if (!updatedDiscount) {
      toast.warning("Discount is empty!");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/sales/update-discount/${productId}?newDiscount=${updatedDiscount}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setUpdatedDiscount('');
        toast.success("Discount updated successfully!");
      } else {
        const data = await response.json();
        toast.warning(data.message || "Something went wrong!");
      }
    } catch (error: any) {
      toast.error("Failed to update discount: " + error.message);
    }
  };


  const handleProductDelete = async (productId: number) => {
    try {
      const response = await fetch(`${apiBaseUrl}/sales/delete/${productId}?username=${username}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success("Product deleted successfully !");
      } else {
        const data = await response.json();
        toast.warning(data.message || "Failed to delete product!");
      }
    } catch (error: any) {
      toast.error("Error deleting product: " + error.message);
    }
  };

  useEffect(() => {
    fetch(`${apiBaseUrl}/sales/sales/today?username=${username}`)
      .then(response => response.json())
      .then(data => {
        setAllProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username, updatedQty]);


  useEffect(() => {
    const filtered = allProducts.filter(product =>
      (product.productName.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
      (product.category.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
      (product.date.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
      (product.customerName?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
      (product.phoneNumber?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
      (product.soldInvoice.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
    );
    setFilteredProducts(filtered);
  }, [filterCriteria, allProducts]);

  const handleFilterChange = (e: any) => {
    setFilterCriteria(e.target.value);
  };
  const totalValue = filteredProducts.reduce((total, product) => {
    return total + ((product.saleRate * product.productQty));
  }, 0);
  const totalQty = filteredProducts.reduce((acc, item) => acc + item.productQty, 0);
  const totalDis = filteredProducts.reduce((acc, item) => acc + item.discount, 0);
  return (
    <div className="container-2xl min-h-[calc(100vh-228px)]">
      <div className="flex flex-col w-full p-5">
        <div className="flex justify-between">
          <DateToDate routePath="/datewise-salereport" /><div className="pt-7"><Link className="btn btn-success" href='/sales-salereport'>This Month Sale</Link></div>
        </div>
        <div className="flex w-full justify-between">
          <div className="pt-5">
            <label className="input input-bordered flex max-w-xs  items-center gap-2">
              <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
              </svg>
            </label>
          </div>
          <div className="pt-5"><button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button></div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center">
        <div className="overflow-x-auto">
          <div ref={contentToPrint} className="flex-1 p-5">
            <div className="flex flex-col gap-2 items-center"><h4 className="font-bold">SALES REPORT</h4>
              <h4><CurrentDate /></h4>
            </div>
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>DATE</th>
                  <th>TIME</th>
                  <th>CATEGORY</th>
                  <th>PRODUCT NAME</th>
                  <th>INVOICE NO</th>
                  <th>CUSTOMER INFO</th>
                  <th>SALE RATE</th>
                  <th>QUANTITY</th>
                  <th>DISCOUNT</th>
                  <th>SUB TOTAL</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts?.map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{product.date}</td>
                    <td>{product.time}</td>
                    <td className="capitalize">{product.category}</td>
                    <td className="capitalize">{product.productName}</td>
                    <td className="uppercase">{product.soldInvoice}</td>
                    <td className="capitalize">{product.customerName} {product.phoneNumber}</td>
                    <td>{Number(product.saleRate.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number(product.productQty.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number(product.discount?.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number(((product.saleRate * product.productQty) - (product.discount)).toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>
                      <a href="#my_modal_edit_sale" className="btn btn-xs btn-ghost"> <FiEdit size={16} onClick={() => handleEditClick(product)} /> </a>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold text-lg">
                  <td colSpan={7}></td>
                  <td>TOTAL</td>
                  <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
                  <td>{Number(totalDis.toFixed(2)).toLocaleString('en-IN')}</td>
                  <td>{Number((totalValue - totalDis).toFixed(2)).toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      {selectedProduct && (
        <div className="modal sm:modal-middle" role="dialog" id="my_modal_edit_sale">
          <div className="modal-box gap-5">
            <h3 className="font-bold text-lg">Edit Product: {selectedProduct.productName}</h3>
            <div className="flex flex-col gap-2 p-3">
              <p>Category: {selectedProduct.category}</p>
              <p>Sold Invoice: {selectedProduct.soldInvoice}</p>
              <p>Sale Rate: {selectedProduct.saleRate.toLocaleString('en-IN')}</p>
              <p>Quantity: {selectedProduct.productQty.toFixed(2)}<input className="input input-sm input-bordered ml-2 w-[100px]" type="number" value={updatedQty} name="productQty" onChange={(e: any) => setUpdatedQty(e.target.value)} />
                <button className="btn btn-sm btn-accent ml-3" onClick={() => {
                  if (window.confirm("Are you sure you want to update this item?")) {
                    handleQtyUpdate(selectedProduct.productId);
                  }
                }} >Apply</button></p>
              <p>Discount: {selectedProduct.discount.toFixed(2)}<input className="input input-sm input-bordered ml-2 w-[100px]" type="number" name="discount" value={updatedDiscount} onChange={(e: any) => setUpdatedDiscount(e.target.value)} />
                <button className="btn btn-sm btn-accent ml-3" onClick={() => {
                  if (window.confirm("Are you sure you want to update this item?")) {
                    handleDiscountUpdate(selectedProduct.productId);
                  }
                }} >Apply</button></p>
              <p>Total: {((selectedProduct.saleRate * selectedProduct.productQty) - (selectedProduct.discount)).toLocaleString('en-IN')}</p>
            </div>
            <div className="flex gap-3 p-3">
              <button className="btn btn-sm btn-error ml-3" onClick={() => {
                if (window.confirm("Are you sure you want to delete this item?")) {
                  handleProductDelete(selectedProduct.productId);
                }
              }} >Delete This Item</button>
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
      )}
    </div>
  )
}

export default Page