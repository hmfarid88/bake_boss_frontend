"use client"
import { IoLocationOutline } from 'react-icons/io5';
import { FaPhoneVolume } from 'react-icons/fa';
import { AiOutlineMail } from 'react-icons/ai';

export default function Home() {

  const dashboardData = [

    {
      id: 1,
      title: "Distribution Today"
    },

    {
      id: 2,
      title: "Monthly Total"
    },

    {
      id: 3,
      title: "Payment Today"
    },
    {
      id: 4,
      title: "Cash Balance"
    },

  ]
  return (
    <main>
      <div className="container min-h-[calc(100vh-228px)]">
        <div className="flex flex-col md:flex-row  gap-5 p-4 items-center justify-center">
          {dashboardData?.map((item) =>
            <div key={item.id} className="card shadow-md shadow-slate-700 border border-accent text-center font-bold h-32 w-60 p-2">
              {item.title}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-5 pt-20">
          <h1 className="text-xl font-bold text-accent rounded shadow-lg shadow-slate-700 tracking-widest">AURORA FOOD & BEVERAGE LTD</h1>
          <div className="flex flex-col gap-2 items-center justify-center">
            <p className='flex gap-2'><IoLocationOutline className='mt-0.5' size={16} /> Jalkuri, Siddhirganj, Narayanganj, Dhaka</p>
            <p className='flex gap-2'><AiOutlineMail className='mt-0.5' size={16} /> info.bakeboss@gmail.com</p>
            <p className='flex gap-2'><FaPhoneVolume className='mt-0.5' size={16} /> 01947-832222</p>
          </div>
        </div>
      </div>
    </main>
  );
}
