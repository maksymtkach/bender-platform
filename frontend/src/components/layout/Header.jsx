import { Link } from "react-router-dom"
import logo from "../../assets/book.png"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {useContext} from "react";
import {UserContext} from "@/contexts/UserContext.js";

// TODO: ensure only authorised user can view some tabs
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
                    {/*TODO: enable visibility after login*/}
                    {/*TODO: use real avatar*/}
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        </header>
    )
}
