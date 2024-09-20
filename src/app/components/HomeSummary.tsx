import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../store';
import { HiCurrencyBangladeshi } from "react-icons/hi";

const HomeSummary = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';

  const [date, setDate] = useState('');

  useEffect(() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setDate(formattedDate)
  }, []);

  const [stockValue, setProductStock] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [monthlyTotalValue, setMonthlyTotalValue] = useState<number>(0);
  const [payValue, setPayValue] = useState<number>(0);
  const [recvValue, setRecvValue] = useState<number>(0);
 
  const dashboardData = [
    { id: 1, title: "Product Stock" },
    { id: 2, title: "Sales Today" },
    { id: 3, title: "Monthly Total" },
    { id: 4, title: "Payment Today" },
    { id: 5, title: "Cash Balance" }
  ];

  useEffect(() => {
    fetch(`${apiBaseUrl}/sales/getSalesStock?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const totalStock = data.reduce((total: number, product: { costPrice: number; remainingQty: number; }) => {
          return total + (product.costPrice*product.remainingQty);
        }, 0);
        setProductStock(totalStock);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/sales/sales/today?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const total = data.reduce((total: number, product: { saleRate: number; productQty: number; discount:number}) => {
          return total + (product.saleRate * product.productQty)-(product.discount*product.productQty);
        }, 0);
        setTotalValue(total);
      })
      .catch(error => console.error('Error fetching sales:', error));
  }, [apiBaseUrl, username]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/sales/getOutletSale?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const monthlyTotal = data.reduce((total: number, product: { saleRate: number; productQty: number; discount:number}) => {
          return total + (product.saleRate * product.productQty)-(product.discount*product.productQty);
        }, 0);
        setMonthlyTotalValue(monthlyTotal);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/paymentApi/payments/today?username=${username}&date=${date}`)
      .then(response => response.json())
      .then(data => {
        const payTotal = data.reduce((total: number, payment: { amount: number }) => {
          return total + payment.amount;
        }, 0);
        setPayValue(payTotal);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, date, username]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/paymentApi/receives/today?username=${username}&date=${date}`)
      .then(response => response.json())
      .then(data => {
        const recevTotal = data.reduce((total: number, payment: { amount: number }) => {
          return total + payment.amount;
        }, 0);
        setRecvValue(recevTotal);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, date, username]);

  const [previousSaleTotal, setSaleTotal] = useState<number>(0);
  useEffect(() => {
    fetch(`${apiBaseUrl}/sales/cashbook/previousSalesTotal?username=${username}&date=${date}`)
      .then(response => response.json())
      .then(data => {
        setSaleTotal(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, username, date]);

  const [netSumAmount, setNetSumAmount] = useState(0);
  useEffect(() => {
    fetch(`${apiBaseUrl}/paymentApi/net-sum-before-today?username=${username}&date=${date}`)
      .then(response => response.json())
      .then(data => setNetSumAmount(data.netSumAmount))
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, date, username]);

  return (
    <div className='flex flex-col md:flex-row gap-5 p-4 items-center justify-center w-full'>
    {dashboardData?.map((item) =>
      <div key={item.id} className="card shadow-md shadow-slate-700 border border-accent text-center font-bold h-32 w-60 p-2">
        {item.title === "Product Stock" ? (
          <div className='flex flex-col items-center justify-center gap-5'>
            <p>{item.title}</p>
            <p className='flex text-lg font-bold gap-2'><HiCurrencyBangladeshi size={26}/> {Number(stockValue.toFixed(2)).toLocaleString('en-IN')}</p>
          </div>
        ) : item.title === "Sales Today" ? (
            <div className='flex flex-col items-center justify-center gap-5'>
              <p>{item.title}</p>
              <p className='flex text-lg font-bold gap-2'><HiCurrencyBangladeshi size={26}/> {Number(totalValue.toFixed(2)).toLocaleString('en-IN')}</p>
            </div>
          ) : item.title === "Monthly Total" ? (
            <div className='flex flex-col items-center justify-center gap-5'>
              <p>{item.title}</p>
              <p className='flex text-lg font-bold gap-2'><HiCurrencyBangladeshi size={26}/> {Number(monthlyTotalValue.toFixed(2)).toLocaleString('en-IN')}</p>
            </div>
          ) : item.title === "Payment Today" ? (
            <div className='flex flex-col items-center justify-center gap-5'>
              <p>{item.title}</p>
              <p className='flex text-lg font-bold gap-2'><HiCurrencyBangladeshi size={26}/> {Number(payValue.toFixed(2)).toLocaleString('en-IN')}</p>
            </div>
          ) : item.title === "Cash Balance" ? (
            <div className='flex flex-col items-center justify-center gap-5'>
              <p>{item.title}</p>
              <p className='flex text-lg font-bold gap-2'><HiCurrencyBangladeshi size={26}/> {Number((((netSumAmount+previousSaleTotal+totalValue+recvValue)-payValue)).toFixed(2)).toLocaleString('en-IN')}</p>
            </div>
          ): (
            <p>{item.title}</p>
          )}
      </div>
    )}
  </div>
  )
}

export default HomeSummary