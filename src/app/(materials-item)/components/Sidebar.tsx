
import Link from 'next/link'
import { IoHomeOutline } from "react-icons/io5";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { MdOutlineInterests } from "react-icons/md";
import { GoDatabase } from 'react-icons/go';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { VscRepo } from 'react-icons/vsc';
import Cashbook from './Cashbook';


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
                        <li><Link href="/materials-dashboard"><IoHomeOutline size={20} /> HOME</Link></li>
                        <li><Link href="/add-materials"><MdOutlineInterests size={20} /> ADD MATERIALS</Link></li>
                        {/* <li><Link href="/add-damage"><MdOutlineInterests size={20} /> ADD DAMAGE</Link></li> */}
                        <li><Link href="/add-distribution"><MdOutlineInterests size={20} /> ADD DISTRIBUTION</Link></li>
                        <li>
                            <details>
                                <summary><RiSecurePaymentLine size={20} /> TRANSACTION</summary>
                                <ul>
                                    <li><Link href="/materials-payment">PAYMENT</Link></li>
                                    <li><Link href="/materials-receive">RECEIVE</Link></li>
                                </ul>
                            </details>
                        </li>
                        <li><Link href="/materials-stock"><GoDatabase size={20} /> MATERIALS STOCK</Link></li>
                        <li><Link href="/material-ledger"><GoDatabase size={20} /> MATERIALS LEDGER</Link></li>
                        <li><Link href="/purse-ledger"><GoDatabase size={20} /> PURSE LEDGER</Link></li>
                        <li><Link href="/dist-report"><HiOutlineShoppingBag size={20} /> DIST LEDGER</Link></li>
                        {/* <li><Link href="/damaged-materials"><HiOutlineShoppingBag size={20} /> DAMAGE STOCK</Link></li> */}
                        <li>
                            <details>
                                <summary><a className='flex gap-2'><VscRepo size={20} /> CASH BOOK </a></summary>
                                <ul>
                                    <li>
                                        <Cashbook />
                                    </li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    )
}

export default Sidebar