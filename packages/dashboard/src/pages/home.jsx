import { useState, useEffect } from 'react'
import Tickets from './tickets'
import LandingPage from './landing'

export default function Home() {
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    useEffect(() => {
        const checkToken = () => {
            setToken(localStorage.getItem("token"));
        };
        window.addEventListener("storage", checkToken);
        return () => window.removeEventListener("storage", checkToken);
    }, []);

    if (!token) {
        return <LandingPage />;
    }

    return <Tickets />;
}

