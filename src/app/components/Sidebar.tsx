
import Link from 'next/link'
import { IoHomeOutline } from "react-icons/io5";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { RiFileDamageLine, RiSecurePaymentLine } from "react-icons/ri";
import { GoDatabase } from "react-icons/go";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlinePayments } from "react-icons/md";
import { PiNotebook } from "react-icons/pi";
import { VscRepo } from "react-icons/vsc";
import { MdOutlineInterests } from "react-icons/md";
import { GrUserAdmin } from "react-icons/gr";
import CashBook from './CashBook';
import Invoice from './Invoice';
import { BsDatabaseAdd } from 'react-icons/bs';


export const Sidebar = () => {

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
                        <li><Link href="/dashboard"><IoHomeOutline size={20} /> HOME</Link></li>
                        <li><Link href="/purchase"><BsDatabaseAdd size={20} /> PRODUCT STOCK</Link></li>
                        <li><Link href="/damage-product"><RiFileDamageLine size={20} /> DAMAGE PRODUCT</Link></li>
                        <li><Link href="/damage-material"><RiFileDamageLine size={20} /> DAMAGE MATERIAL</Link></li>
                        <li>
                            <details>
                                <summary><HiOutlineShoppingBag size={20} /> DISTRIBUTION</summary>
                                <ul>
                                    <li><Link href="/dp-dist">DP DISTRIBUTION</Link></li>
                                    <li><Link href="/rp-dist">RP DISTRIBUTION</Link></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary><RiSecurePaymentLine size={20} /> TRANSACTION</summary>
                                <ul>
                                    <li><Link href="/payment">PAYMENT</Link></li>
                                    <li><Link href="/receive">RECEIVE</Link></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary><GoDatabase size={20} /> STOCK REPORT</summary>
                                <ul>
                                    <li><Link href="/itemlist">ITEMS LIST</Link></li>
                                    <li><Link href="/materials">MATERIALS STOCK</Link></li>
                                    <li><Link href="/stockreport">MADE PRODUCTS</Link></li>
                                    <li><Link href="/damaged-product">DAMAGED PRODUCT</Link></li>
                                    <li><Link href="/damaged-material">DAMAGED MATERIAL</Link></li>
                                    <li><Link href="/sales-returned">SALES RETURNED</Link></li>
                                    <li><Link href="/requisition-list">OUTLET REQUISITION</Link></li>
                                   
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary><TbReportSearch size={20} /> DIST REPORT</summary>
                                <ul>
                                    <li><Link href="/dp-dist-report">DP DISTRIBUTION</Link></li>
                                    <li><Link href="/rp-dist-report">RP DISTRIBUTION</Link></li>
                                </ul>
                            </details>
                            </li>
                        <li>
                            <details>
                                <summary><MdOutlinePayments size={20} /> PAYMENT REPORT</summary>
                                <ul>
                                    <li><Link href="/expense-report"> EXPENSE REPORT</Link></li>
                                    <li><Link href="/office-pay-report"> OFFICE PAYMENT</Link></li>
                                    <li><Link href="/supplier-pay-report"> SUPPLIER PAYMENT</Link></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary><MdOutlinePayments size={20} /> RECEIVE REPORT</summary>
                                <ul>
                                <li><Link href="/office-receive-report"> OFFICE RECEIVE</Link></li>
                                <li><Link href="/retailer-pay-report"> RETAILER PAYMENT</Link></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary><PiNotebook size={20} /> LEDGER BOOK</summary>
                                <ul>
                                    <li><Link href="/supplier-ledger">SUPPLIER LEDGER</Link></li>
                                    <li><Link href="/materials-ledger">MATERIALS LEDGER</Link></li>
                                    <li><Link href="/stock-ledger">MADE ITEM LEDGER</Link></li>
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
                                <summary><a className='flex gap-2'><PiNotebook size={20}/>FIND INVOICE </a></summary>
                                <ul>
                                    <li>
                                        <Invoice/>
                                    </li>
                                </ul>
                            </details>
                        </li>
                        <li><Link href="/profit-report"><MdOutlineInterests size={20} /> PROFIT / LOSS</Link></li>
                        <li><Link href="/adminstration"><GrUserAdmin size={20} /> ADMINSTRATION</Link></li>

                    </ul>

                </div>
            </div>

        </div>
    )
}

export default Sidebar