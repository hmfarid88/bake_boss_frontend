"use client"
import React, { useEffect, useState } from 'react'
interface User {
    email: string;
    username: string;
    password: string;
    roles: string;
}
const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [allUsers, setAllUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch(`${apiBaseUrl}/auth/user/userList`)
            .then(response => response.json())
            .then(data => {
                setAllUsers(data);

            })
            .catch(error => console.error('Error fetching users:', error));
    }, [apiBaseUrl]);
    return (
        <div className='container-2xl'>
            <div className="flex items-center justify-center p-10">
                <table className="table table-sm">
                                      <thead>
                        <tr>
                            <th>SN</th>
                            <th>EMAIL</th>
                            <th>USER NAME</th>
                            <th>PASSWORD</th>
                            <th>ROLES</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                       {allUsers?.map((user, index)=>(
                        <tr key={index}>
                            <th>{index+1}</th>
                            <td>{user.email}</td>
                            <td>{user.username}</td>
                            <td>{user.password}</td>
                            <td>{user.roles}</td>
                            <td className='flex gap-2'><button className='btn btn-xs btn-warning'>EDIT</button><button className='btn btn-xs btn-error'>DELETE</button></td>
                        </tr>
                       ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Page