"use client"
import Link from 'next/link'
import React from 'react'
import { useAppDispatch } from "@/app/store";
import { deleteUser } from "@/app/store/usernameSlice"
import { deleteSession } from '@/app/lib/auth';
import { RiLogoutCircleRLine } from "react-icons/ri";

const Navbar = () => {
    const dispatch = useAppDispatch();
    const handleLogout = () => {
        dispatch(deleteUser());
        deleteSession();
      };
  return (
    <div className='container-2xl'>
            <div className="navbar bg-base-100">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li><Link href="/adduser">ADD USER</Link></li>
                            <li>
                                <a>ITEM 2</a>
                                <ul className="p-2">
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </li>
                            <li><a>ITEM 3</a></li>
                        </ul>
                    </div>
                    <a className="btn btn-ghost text-lg font-bold"><Link href="/admin-dashboard">BILLING CRAFT</Link></a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                    <li><Link href="/admin-dashboard">HOME</Link></li>
                    <li><Link href="/adduser">ADD USER</Link></li>
                        <li>
                            <details>
                                <summary>ITEM 2</summary>
                                <ul className="p-2">
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </details>
                        </li>
                        <li><a>ITEM 3</a></li>
                    </ul>
                </div>
                <div className="navbar-end">
                    <a onClick={handleLogout} className="btn"><RiLogoutCircleRLine/> LOGOUT</a>
                </div>
            </div>
        </div>
  )
}

export default Navbar