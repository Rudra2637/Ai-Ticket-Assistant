import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CheckAuth({children,isProtected}) {
    const navigate = useNavigate()
    const[loading,setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if(isProtected && !token){
            navigate('/login')
            
        }
        if (!isProtected && token) {
            navigate('/');
        }
        setLoading(false)
    },[navigate,isProtected])

    if(loading){
        return <div>Loading...</div>
    }
    else return children
}

export default CheckAuth