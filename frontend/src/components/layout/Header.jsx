import { Link } from "react-router-dom"
import logo from "../../assets/book.png"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {useContext} from "react";
import {UserContext} from "@/contexts/UserContext.js";

export default function Header() {
    const { user } = useContext(UserContext);
    return (
        <header className="py-4 px-6 border-b border-border flex gap-4 items-center justify-between">
            <img className="h-8 w-8" src={logo} alt="Book" />
            <div className="flex gap-4 justify-end items-center">
                <Link to="/">Home</Link>
                {user &&
                    <>
                        <Link to="/create-test">Create test</Link>
                        <Link to="/tests">My tests</Link>
                    </>
                }
                <Link to="/login">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        </header>
    )
}
