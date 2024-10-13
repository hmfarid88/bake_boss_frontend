"use client"
import React, { FormEvent, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';

const Page = () => {
    const [pending, setPending] = useState(false);
 
    const [username, setUserName] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
   
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleUserUpdate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!username || !currentPassword || !newPassword) {
            toast.warning("All fields are required!");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }
        
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/auth/updatePassword`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, currentPassword, newPassword }),
            });

            if (response.ok) {
                
                setUserName("");
                setCurrentPassword("");
                setNewPassword("");
                toast.success("Password updated successfully!");

            } else {
                const data = await response.json();
                toast.error(data.message || "Error adding user.");
            }
        } catch (error: any) {
            toast.error(error.message || "Error adding user.")
        } finally {
            setPending(false);
        }
    };
    return (
        <div className='container-2xl'>
            <div className="flex w-full items-center justify-center pt-10">
                <div className="card shadow shadow-slate-700 w-full max-w-sm p-5">
                    <form onSubmit={handleUserUpdate}>
                        <h1 className='font-bold tracking-widest p-2'>UPDATE USER</h1>
                        <div className="flex flex-col">
                           
                            <div className="flex p-2">
                                <label className="input input-bordered flex items-center w-full max-w-xs gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                                    <input type="text" name='name' value={username} onChange={(e: any) => setUserName(e.target.value)} className="grow" placeholder="Username" />
                                </label>
                            </div>
                            <div className="flex p-2">
                                <label className="input input-bordered flex items-center w-full max-w-xs gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                                    <input type="password" value={currentPassword} name='password' onChange={(e: any) => setCurrentPassword(e.target.value)} className="grow" placeholder='Current Password' />
                                </label>
                            </div>
                            <div className="flex p-2">
                            <label className="input input-bordered flex items-center w-full max-w-xs gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                                    <input type="password" value={newPassword} name='password' onChange={(e: any) => setNewPassword(e.target.value)} className="grow" placeholder='New Password' />
                                </label>
                            </div>
                            <div className="flex p-2">
                                <button type='submit' className='btn btn-success w-full max-w-xs'>{pending ? "Updating..." : "UPDATE"}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer autoClose={1000} theme='dark' />
        </div>
    )
}

export default Page