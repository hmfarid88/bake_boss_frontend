"use client"
import { AiOutlineMail } from 'react-icons/ai';
import { FaPhoneVolume } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';

const Page = () => {
    

    return (
        <div className="container-2xl min-h-screen">
            <div className="flex flex-col items-center justify-center p-5">
                <h1 className='text-xl'>Welcome to Management Area</h1>
                <div className="flex flex-col items-center justify-center gap-5 pt-20">
                    <h1 className="text-xl font-bold text-accent rounded shadow-lg shadow-slate-700 tracking-widest">AURORA FOOD & BEVERAGE LTD</h1>
                    <div className="flex flex-col gap-2 items-center justify-center">
                        <p className='flex gap-2'><IoLocationOutline className='mt-0.5' size={16} /> Jalkuri, Siddhirganj, Narayanganj, Dhaka</p>
                        <p className='flex gap-2'><AiOutlineMail className='mt-0.5' size={16} /> info.bakeboss@gmail.com</p>
                        <p className='flex gap-2'><FaPhoneVolume className='mt-0.5' size={16} /> 01947-832222</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page