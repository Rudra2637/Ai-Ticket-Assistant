import { useEffect, useState } from 'react'
import Tickets from './tickets'
import LandingPage from './landing'

export default function Home() {
    useEffect(() => {
        if (!localStorage.getItem("user")) {
            localStorage.setItem("user", JSON.stringify({
                _id: "dev-agent-id",
                id: "dev-agent-id",
                name: "Lead Support Agent",
                email: "agent@ticketai.dev",
                role: "admin",
                skills: ["javascript", "react", "billing", "database"]
            }));
        }
        if (!localStorage.getItem("token")) {
            localStorage.setItem("token", "dev-bypass-token");
        }
    }, []);

    return <Tickets />;
}

