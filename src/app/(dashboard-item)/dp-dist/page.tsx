'use client'
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, deleteAllProducts, deleteProduct } from "@/app/store/productSaleSlice";
import { addProductMaterials, deleteAllMaterials, deleteMaterial } from "@/app/store/materialUseSlice";
import Select from "react-select";
import { uid } from 'uid';
import { toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";


const Page: React.FC = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const [pending, setPending] = useState(false);
  const [total, setTotal] = useState(0);
  const [qtyTotal, setQtyTotal] = useState(0);

  const [productOption, setProductOption] = useState([]);
  const [selectedProid, setSelectedProid] = useState("");
  const [selectedQty, setSelectedQty] = useState("");
  const [selectedProidOption, setSelectedProidOption] = useState(null);

  const [retailer, setRetailer] = useState("");
  const [date, setDate] = useState("");

  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const saleProducts = useAppSelector((state) => state.productTosale.products);
  const addedProductMaterials = useAppSelector((state) => state.materialUse.materials);
  const dispatch = useAppDispatch();

  const selectRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleProductSelect = (selectedOption: any) => {
      setSelectedProid(selectedOption.value);
      setSelectedProidOption(selectedOption);
      if (inputRef.current) {
          inputRef.current.focus();
      }
  };
  const invoiceNo = uid();
  const pid = uid();
  const [maxDate, setMaxDate] = useState('');
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setMaxDate(formattedDate);
    setDate(formattedDate);
  }, []);

  useEffect(() => {
    calculateTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saleProducts]);

  useEffect(() => {
    calculateQtyTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saleProducts]);

  const calculateTotal = () => {
    const total = saleProducts.reduce((sum, p) => {
      return sum + (p.dpRate * p.productQty);
    }, 0);
    setTotal(total);
  };

  const calculateQtyTotal = () => {
    const qtytotal = saleProducts.reduce((sum, p) => {
      return sum + (p.productQty);
    }, 0);
    setQtyTotal(qtytotal);
  };

  const handleDeleteProduct = (id: any) => {
    dispatch(deleteProduct(id));
    dispatch(deleteMaterial(id));
  };


  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProid || !selectedQty) {
      toast.error("Field is empty!");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/getSingleProduct?productId=${selectedProid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const numericProductQty = Number(selectedQty);

      const productToSale = {
        id: pid,
        category: data.category,
        productName: data.productName,
        costPrice: data.costPrice,
        dpRate: data.dpRate,
        rpRate: data.rpRate,
        customerPrice: data.customerPrice,
        productQty: numericProductQty,
        remainingQty: data.remainingQty,
        status: 'sold',
        username: username,
      };

      const response2 = await fetch(`${apiBaseUrl}/api/getItemList?username=${username}&itemName=${data.productName}`);
      if (!response2.ok) {
        throw new Error(`HTTP error! status: ${response2.status}`);
      }
      const data2 = await response2.json();

      const updatedItems = data2.map((item: any) => ({
        ...item,
        remainingQty: item.remainingQty - (item.qty * numericProductQty),
        madeItem: item.itemName,
        status: 'used',
        date: maxDate,
        materialsRate: item.averageRate,
        username: username,
        materialsName: item.materialsName,
        averageRate: item.averageRate,
        materialsQty: item.qty * numericProductQty,
        id: pid,
      }));

      dispatch(addProductMaterials(updatedItems));
      dispatch(addProducts(productToSale));
      setSelectedQty("");
      setSelectedProid("");
      setSelectedProidOption(null);
      if (selectRef.current) {
          selectRef.current.focus();
      }

    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error("An error occurred while processing the request.");
    }
  };

  const productInfo = saleProducts.map(product => ({
    ...product,
    date: maxDate,
    customer: retailer,
    invoiceNo: invoiceNo
  }));

  const handleFinalSubmit = async (e: any) => {
    e.preventDefault();
    if (!retailer) {
      toast.error("Please, select any retailer!");
      return;
    }
    if (productInfo.length === 0) {
      toast.error("Your product list is empty!");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/productDistribution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productInfo),
      });

      if (!response.ok) {
        toast.error("Product sale not submitted!");
        return;
      }

      const materialsResponse = await fetch(`${apiBaseUrl}/api/updateMaterialsStock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addedProductMaterials),
      });

      if (!materialsResponse.ok) {
        toast.error("Materials stock update failed!");
        return;
      }

      dispatch(deleteAllProducts());
      dispatch(deleteAllMaterials());
      router.push(`/invoice?invoiceNo=${invoiceNo}`);
    } catch (error: any) {
      toast.error("An error occurred: " + error.message);
    } finally {
      setRetailer("");
      setPending(false);
    }
  };


  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getProductStock?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map((item: any) => ({
          value: item.productId,
          label: item.productName
        }));
        setProductOption(transformedData);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);

  const [salesuser, setSalesuser] = useState([]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/auth/user/getSalesUser`)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map((item: any) => ({
          value: item.username,
          label: item.username
        }));
        setSalesuser(transformedData);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl]);

  return (
    <div className='container-2xl min-h-screen'>
      <div className="flex flex-col">
        <div className="flex pt-5 px-10 pb-0">
          <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)} max={maxDate} value={date} className="input input-ghost" />
        </div>
        <div className="flex flex-col w-full">
          <div className="divider divider-accent tracking-widest font-bold p-5">DISTRIBUTION</div>
        </div>
        <div className="flex items-center justify-center gap-2 z-10">
          <Select className="text-black h-[38px] w-64 md:w-96" ref={selectRef}  value={selectedProidOption} autoFocus={true} onChange={handleProductSelect} options={productOption} />
          <input type="number" className="w-[100px] h-[38px] p-2 bg-white text-black border rounded-md" placeholder="Qty" ref={inputRef} value={selectedQty} onChange={(e) => setSelectedQty(e.target.value)} />
          <button onClick={handleProductSubmit} className='btn btn-outline btn-success btn-sm h-[38px]'>ADD</button>
        </div>
        <div className="flex items-center justify-center w-full p-5">
          <div className="overflow-x-auto max-h-96">
            <table className="table table-pin-rows">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>DESCRIPTION</th>
                  <th>DP RATE</th>
                  <th>QTY</th>
                  <th>SUB TOTAL</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {saleProducts?.map((p, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{p.productName} </td>
                    <td>{Number(p.dpRate?.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{p.productQty}</td>
                    <td>{Number((p.dpRate * p.productQty).toFixed(2)).toLocaleString('en-IN')}</td>
                    <td className="flex justify-between gap-3">
                      <button onClick={() => {
                        handleDeleteProduct(p.id);
                      }} className="btn-xs rounded-md btn-outline btn-error"> <RiDeleteBin6Line size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td></td>
                  <td></td>
                  <td className="text-lg font-semibold">TOTAL</td>
                  <td className="text-lg font-semibold">{qtyTotal} PS</td>
                  <td className="text-lg font-semibold">{Number(total.toFixed(2)).toLocaleString('en-IN')} TK</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex w-full justify-center p-5">
          <div className="card shadow shadow-slate-500 max-w-lg gap-3 p-5">
            <div className="card-title text-sm">SELECT OUTLET</div>
            <Select className="text-black h-[38px] w-64" onChange={(selectedOption: any) => setRetailer(selectedOption.value)} options={salesuser} />
            <button onClick={handleFinalSubmit} disabled={pending} className="btn w-xs h-[38px] btn-success btn-outline font-bold">{pending ? <span className="loading loading-ring loading-md text-accent"></span> : "SUBMIT"}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page