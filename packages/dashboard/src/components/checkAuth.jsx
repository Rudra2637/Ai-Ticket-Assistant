import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CheckAuth({ children, isProtected = false }) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (isProtected && !token) {
            navigate("/login");
        } else if (!isProtected && token) {
            navigate("/");
        }
    }, [token, isProtected, navigate]);

    if (isProtected && !token) return null;
    if (!isProtected && token) return null;

    return children;
}

export default CheckAuth;