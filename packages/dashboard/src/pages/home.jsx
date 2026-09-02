import { useEffect, useState } from 'react'
import Tickets from './tickets'
import LandingPage from './landing'

export default function Home() {
    const [token, setToken] = useState(localStorage.getItem("token"))

    useEffect(() => {
        // Function to synchronize token state when storage changes
        const handleStorageChange = () => {
            setToken(localStorage.getItem("token"))
        }

        window.addEventListener("storage", handleStorageChange)
        // Also run a periodic check in case token is removed programmatically within the same tab
        const interval = setInterval(handleStorageChange, 1000)

        return () => {
            window.removeEventListener("storage", handleStorageChange)
            clearInterval(interval)
        }
    }, [])

    return token ? <Tickets /> : <LandingPage />
}
