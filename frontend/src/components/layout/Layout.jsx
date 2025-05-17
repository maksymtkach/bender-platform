import { Outlet } from "react-router-dom"
import Header from "./Header"

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-1 flex min-w-screen">
                <Outlet />
            </main>
        </div>
    )
}

