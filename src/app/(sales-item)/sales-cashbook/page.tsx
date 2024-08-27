"use client"
import { useAppSelector } from '@/app/store';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { FcPrint } from 'react-icons/fc';
import { useReactToPrint } from 'react-to-print';
interface Payment {
  date: string;
  name: string;
  note: string;
  amount: number;
}
interface Receive {
  date: string;
  name: string;
  note: string;
  amount: number;
}
interface Sale {
  date: String;
  soldInvoice: string;
  productQty: number;
  saleRate: number;
}

const CashBook = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';

  const searchParams = useSearchParams();
  const date = searchParams.get('date');
  const [netSumAmount, setNetSumAmount] = useState(0);

  useEffect(() => {
    fetch(`${apiBaseUrl}/paymentApi/net-sum-before-today?username=${username}&date=${date}`)
      .then(response => response.json())
      .then(data => setNetSumAmount(data.netSumAmount))
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, date, username]);

  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
  });

  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/paymentApi/payments/today?username=${username}&date=${date}`)
      .then(response => response.json())
      .then(data => setPayments(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, date, username]);

  const totalCredit = () => {
    return payments.reduce((debit, payment) => debit + (payment.amount), 0);
  };

  const [receives, setReceives] = useState<Receive[]>([]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/paymentApi/receives/today?username=${username}&date=${date}`)
      .then(response => response.json())
      .then(data => setReceives(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, date, username]);

  const [saleTotal, setSaleTotal] = useState('');
  useEffect(() => {
    fetch(`${apiBaseUrl}/sales/cashbook/salesTotal?username=${username}&date=${date}`)
      .then(response => response.json())
      .then(data => {
        setSaleTotal(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, username, date]);

  const [saledata, setSaleData] = useState([]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/sales/cashbook/dateWiseSale?username=${username}&date=${date}&status=sold`)
      .then(response => response.json())
      .then(data => {
        setSaleData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, username, date]);

  const totalDebit = () => {
    return receives.reduce((credit, receive) => credit + (receive.amount), 0);
  };
  const totalAdsale = () => {
    return saledata.reduce((credit, sale) => credit + (sale[2]), 0);
  };

  return (
    <div className='container min-h-screen'>
      <div className="flex justify-between pl-5 pr-5">
        <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
      </div>
      <div className="w-full card pb-5">
        <div ref={contentToPrint} className="flex w-full items-center justify-center pt-5">
          <div className="overflow-x-auto">
            <div className="flex w-full items-center justify-between p-5">
              <h4>DEBIT</h4>
              <h4>CASH BOOK ({date})</h4>
              <h4>CREDIT</h4>
            </div>
            <div className="flex w-full gap-10">
              <div className="flex">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>DATE</th>
                      <th>DESCRIPTION</th>
                      <th>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{date}</td>
                      <td>BALANCE B/D</td>
                      <td>{Number((netSumAmount+saleTotal) ?? 0).toLocaleString('en-IN')}</td>
                    </tr>
                    {saledata?.map((sold: any, index) => (
                      <tr key={index}>
                        <td>{sold[0]}</td>
                        <td className='uppercase'>{sold[1]}</td>
                        <td>{(sold[2]).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                    {receives?.map((receive, index) => (
                      <tr key={index}>
                        <td>{receive.date}</td>
                        <td className='uppercase'>{receive.name}, {receive.note}</td>
                        <td>{(receive.amount ?? 0).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}

                    <tr className='font-bold'>
                      <td colSpan={1}></td>
                      <td>TOTAL</td>
                      <td>{Number(totalDebit() + totalAdsale() + netSumAmount + saleTotal).toLocaleString('en-IN')}</td>
                    </tr>

                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td>BALANCE B/D</td>
                      <td>{(Number(totalDebit() + totalAdsale() + netSumAmount + saleTotal) - (totalCredit())).toLocaleString('en-IN')}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div>
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>DATE</th>
                      <th>DESCRIPTION</th>
                      <th>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, index) => (
                      <tr key={index}>
                        <td>{payment.date}</td>
                        <td className='uppercase'>{payment.name}, {payment.note}</td>
                        <td>{(payment.amount ?? 0).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                    <tr>
                      <td>{date}</td>
                      <td>BALANCE C/D</td>
                      <td>{(Number(totalDebit() + totalAdsale() + netSumAmount + saleTotal) - (totalCredit())).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className='font-bold'>
                      <td colSpan={1}></td>
                      <td>TOTAL</td>
                      <td>{(totalCredit() + (Number(totalDebit() + totalAdsale() + netSumAmount + saleTotal) - (totalCredit()))).toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CashBook