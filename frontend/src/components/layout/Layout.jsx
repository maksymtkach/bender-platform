import { Outlet } from "react-router-dom"
import Header from "./Header"
import { Toaster } from "@/components/ui/sonner"

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-1 flex justify-center">
                <div className="w-full max-w-4xl px-4">
                    <Outlet />
                </div>
            </main>


            {/*DOCS: https://sonner.emilkowal.ski/*/}
            <Toaster expand={false} // to enable listing of toasts
                     richColors={true} // to enable colorful toasts
                     closeButton={true}
                     theme={"dark"}/>
        </div>
    )
}

