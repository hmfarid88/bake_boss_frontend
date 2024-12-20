import React from 'react'
import Link from 'next/link'
import { IoHomeOutline } from "react-icons/io5";
import { RiSecurePaymentLine } from "react-icons/ri";
import { BsDatabaseCheck } from "react-icons/bs";
import { MdAddShoppingCart, MdPendingActions, MdReadMore, MdOutlineAssignmentReturn, MdOutlineInterests } from "react-icons/md";
import { CiShop, CiMemoPad  } from "react-icons/ci";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlinePayments } from "react-icons/md";
import { PiNotebook } from "react-icons/pi";
import { VscRepo } from "react-icons/vsc";
import { GrUserAdmin } from "react-icons/gr";
import CashBook from './Sales-Cashbook';
import Invoice from './Sales-Invoice';


export const SalesSidebar = () => {
    return (
        <div>
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
                        <li><Link href="/sales-dashboard"><IoHomeOutline size={20} /> HOME</Link></li>
                        <li><Link href="/pending-product"><MdPendingActions size={20} /> PRODUCT PENDING</Link></li>
                        <li><Link href="/sales-stock"><BsDatabaseCheck size={20} /> PRODUCT STOCK</Link></li>
                        <li><Link href="/sales-additional"><MdReadMore size={20} /> ADDITIONAL STOCK</Link></li>
                        <li><Link href="/product-return"><MdOutlineAssignmentReturn size={20} /> PRODUCT RETURN</Link></li>
                        <li><Link href="/sales-shop" className='text-success'><MdAddShoppingCart size={20} />CUSTOMER SALE</Link></li>
                        <li><Link href="/vendor-sale"><CiShop size={20} />VENDOR SALE</Link></li>
                        {/* <li><Link href="/sales-requisition"><PiNotebook size={20} />REQUISITION</Link></li> */}
                        <li>
                            <details>
                                <summary><RiSecurePaymentLine size={20} /> TRANSACTION</summary>
                                <ul>
                                    <li><Link href="/sales-payment">PAYMENT</Link></li>
                                    <li><Link href="/sales-receive">RECEIVE</Link></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary><TbReportSearch size={20} /> SALES REPORT</summary>
                                <ul>
                                    <li><Link href="/sales-sales-today">CUSTOMER SALE</Link></li>
                                    <li><Link href="/vendor-sale-report">VENDOR SALE</Link></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary><MdOutlinePayments size={20} /> PAYMENT REPORT</summary>
                                <ul>
                                    <li><Link href="/sales-expense-report"> EXPENSE REPORT</Link></li>
                                    <li><Link href="/sales-officepay-report"> OFFICE PAYMENT</Link></li>
                                    <li><Link href="/sales-officerecv-report"> OFFICE RECEIVE</Link></li>
                                    <li><Link href="/sales-supplierpay-report"> SUPPLIER PAYMENT</Link></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary><PiNotebook size={20} /> LEDGER BOOK</summary>
                                <ul>
                                    <li><Link href="/sales-stock-ledger">STOCK LEDGER</Link></li>
                                    <li><Link href="/sales-entry-ledger">ENTRY LEDGER</Link></li>
                                    <li><Link href="/sales-stock-returned">RETURNED PRODUCT</Link></li>
                                    {/* <li><Link href="/sales-requisition-report">REQUISITION REPORT</Link></li> */}
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary><a className='flex gap-2'><VscRepo size={20} /> CASH BOOK </a></summary>
                                <ul>
                                    <li>
                                        <CashBook />
                                    </li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary><a className='flex gap-2'><CiMemoPad size={20} />FIND INVOICE </a></summary>
                                <ul>
                                    <li>
                                        <Invoice />
                                    </li>
                                </ul>
                            </details>
                        </li>
                        <li><Link href="/sales-profitloss"><MdOutlineInterests size={20} /> PROFIT / LOSS</Link></li>
                        <li><Link href="/sales-admin"><GrUserAdmin size={20} /> ADMINSTRATION</Link></li>

                    </ul>
                </div>
            </div>
        </div>
    )
}

export default SalesSidebar