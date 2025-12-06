
import Link from 'next/link'
import { IoHomeOutline } from "react-icons/io5";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlineInterests } from "react-icons/md";
import { GoDatabase } from 'react-icons/go';
import { GrUserAdmin } from 'react-icons/gr';


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
                        <li><Link href="/management-dashboard"><IoHomeOutline size={20} /> HOME</Link></li>
                        <li><Link href="/management-dist-report"><TbReportSearch size={20} /> DIST REPORT</Link></li>
                        <li><Link href="/outlet-sale-report"><HiOutlineShoppingBag size={20} /> OUTLET SALE</Link></li>
                        <li><Link href="/management-profit"><MdOutlineInterests size={20} /> OUTLET PROFIT</Link></li>
                        <li><Link href="/outlet-stock"><GoDatabase size={20} /> OUTLET STOCK</Link></li>
                        <li><Link href="/userupdate"><GrUserAdmin size={20} /> USER UPDATE</Link></li>
                    </ul>

                </div>
            </div>

        </div>
    )
}

export default Sidebar