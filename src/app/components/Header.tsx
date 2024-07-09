'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes'
import { RiLogoutCircleRLine } from "react-icons/ri";
import { FcBusinessman } from "react-icons/fc";
import { deleteSession } from '../lib/auth';
import { useAppSelector, useAppDispatch } from "@/app/store";
import { deleteUser } from "@/app/store/usernameSlice"

const Header: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const username = useAppSelector((state) => state.username.username);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }
  const handleLogout = () => {
    dispatch(deleteUser());
    deleteSession();
  };

  return (
    <div className="flex flex-col md:flex-row navbar bg-base-100 sticky top-0 z-40">
      <div className="flex-1">
        <a className="btn btn-ghost uppercase text-xl">{username ? username.username : 'Guest'}</a>
      </div>

      <div className="flex-none gap-2">
        <div>
          <select className="select select-accent w-full max-w-xs" value={theme} onChange={e => setTheme(e.target.value)}>
            <option selected disabled>Theme</option>
            <option value="cupcake">Default</option>
            <option value="system">Dark</option>
            <option value="light">Light</option>
            <option value="coffee">Coffee</option>
            <option value="luxury">Luxury</option>
            <option value="autumn">Autumn</option>
            <option value="corporate">Corporate</option>
            <option value="halloween">Halloween</option>
            <option value="valentine">Valentine</option>
            <option value="garden">Garden</option>
            <option value="forest">Forest</option>
            <option value="fantasy">Fantasy</option>
            <option value="business">Business</option>
            <option value="dracula">Dracula</option>
            <option value="black">Black</option>
            <option value="lemonade">Lemonade</option>
            <option value="night">Night</option>
            <option value="winter">Winter</option>
            <option value="sunset">Sunset</option>
            <option value="nord">Nord</option>
          </select>
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <FcBusinessman className='text-accent' size={40} />
            </div>
          </div>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content dropdown-hover bg-base-100 rounded-box w-40">
            <li>
              <a onClick={handleLogout} className='btn'> <RiLogoutCircleRLine size={16} /> LOGOUT </a>

            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Header