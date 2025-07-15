import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/utils/loginUtils.js"
import {useContext, useEffect, useState} from "react";
import { toast } from "sonner"
import {useNavigate} from "react-router-dom";
import {UserContext} from "@/contexts/UserContext.js";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';


export function LoginForm({
                              className,
                              ...props
                          }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.get("http://localhost:8080/api/v1/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                setUser(res.data);
                navigate("/");
            }).catch(err => {
                console.error("Invalid token", err);
                localStorage.removeItem("token");
            });
        }
    }, []);


    const handleSubmit = async e => {
        e.preventDefault();

        try {
            await login(email, password);
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8080/api/v1/auth/me", {
                headers: { "Authorization" : `Bearer ${token}` }
            });
            const user = res.data;
            setUser(user);
            navigate("/info");
            console.log("Login successful");
        } catch (error) {
            console.log(error)
            toast.error(
                "Login failed!",
                {
                    description: "Credentials are incorrect",
                    duration: 2000,
                }
            );
        }
    }

    async function handleGoogleSuccess(credentialResponse) {
        try {
            const res = await fetch('http://localhost:8080/api/v1/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credentialResponse.credential })
            });
            if (!res.ok) throw new Error("Google auth failed");
            const data = await res.json();
            localStorage.setItem('token', data.token);

            const userRes = await axios.get("http://localhost:8080/api/v1/auth/me", {
                headers: { Authorization: `Bearer ${data.token}` }
            });
            setUser(userRes.data);

            navigate("/info");
        } catch (error) {
            toast.error("Google login failed! ", error.message);
            console.log(error);
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                {/*TODO: when using suggested email input is white in dark mode*/}
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                {/*TODO: add visibility toggle*/}
                                <Input id="password" type="password" required onChange={e => setPassword(e.target.value)} />
                            </div>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                            <div className="w-full flex justify-center">
                                <div className="w-full flex justify-center">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => toast.error("Google login failed!")}
                                        width="100%"
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <a href="/register" className="underline underline-offset-4">
                                Sign up
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}