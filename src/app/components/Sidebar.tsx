import React from 'react'
import Link from 'next/link'
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { RiSecurePaymentLine } from "react-icons/ri";
import { GoDatabase } from "react-icons/go";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlinePayments } from "react-icons/md";
import { PiNotebook } from "react-icons/pi";
import { VscRepo } from "react-icons/vsc";
import { MdOutlineInterests } from "react-icons/md";
import { GrUserAdmin } from "react-icons/gr";

export const Sidebar = () => {
    return (
        <div className="drawer lg:drawer-open z-50">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">

                <div className="flex-none lg:hidden">
                    <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </label>
                </div>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-60 min-h-full bg-base-200 text-base-content">
                    <li><Link href="/dashboard"><IoHomeOutline size={20} /> HOME</Link></li>
                    <li><Link href="/purchase"><MdOutlineShoppingCartCheckout size={20} /> PURCHASE</Link></li>
                    <li><Link href="/sale"><HiOutlineShoppingBag size={20} /> SALES</Link></li>
                    <li>
                        <details>
                            <summary><RiSecurePaymentLine size={20} /> TRANSACTION</summary>
                            <ul>
                                <li><a><Link href="/payment">PAYMENT</Link></a></li>
                                <li><a><Link href="/receive">RECEIVE</Link></a></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary><GoDatabase size={20} /> STOCK REPORT</summary>
                            <ul>
                                <li><a><Link href="/itemlist">ITEMS LIST</Link></a></li>
                                <li><a><Link href="/materials">MATERIALS STOCK</Link></a></li>
                                <li><a><Link href="/stockreport">MADE PRODUCTS</Link></a></li>
                            </ul>
                        </details>
                    </li>
                    <li><Link href="/salereport"><TbReportSearch size={20} /> SALES REPORT</Link></li>
                    <li><Link href="/paymentreport"><MdOutlinePayments size={20} /> PAYMENT REPORT</Link></li>
                    <li><Link href="/ledgerbook"><PiNotebook size={20} /> LEDGER BOOK</Link></li>
                    <li><Link href="/cashbook"><VscRepo size={20} /> CASH BOOK</Link></li>
                    <li><Link href="/profitloss"><MdOutlineInterests size={20} /> PROFIT / LOSS</Link></li>
                    <li><Link href="/adminstration"><GrUserAdmin size={20} /> ADMINSTRATION</Link></li>
                </ul>

            </div>
        </div>
    )
}

export default Sidebar