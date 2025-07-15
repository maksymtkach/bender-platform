import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { register } from "@/utils/registerUtils.js"
import {useState} from "react";
import { toast } from "sonner"

export function RegisterForm({
                              className,
                              ...props
                          }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState(0);
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            await register(email, password, age);
            navigate("/login");
        } catch (error) {
            console.log(error)
            toast.error(
                "Registration failed!",
                {
                    description: error.response.data,
                    duration: 2000,
                }
            );
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Sign up</CardTitle>
                    <CardDescription>
                        Enter your email below to create account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Age</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    required
                                    onChange={e => setAge(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input id="password" type="password" required onChange={e => setPassword(e.target.value)} />
                            </div>
                            <Button type="submit" className="w-full">
                                Register
                            </Button>
                            <Button variant="outline" className="w-full">
                                Register with Google
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
