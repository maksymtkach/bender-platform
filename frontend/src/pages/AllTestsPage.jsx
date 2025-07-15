import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AllTestsPage() {
    const [tests, setTests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchTests = async () => {
            const res = await fetch("http://localhost:8080/api/v1/tests/all", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            setTests(data);
        };
        fetchTests();
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-4 p-6 md:p-10">
            <h1 className="text-2xl font-bold">Your tests</h1>
            {tests.map(test => (
                <Card key={test.id}>
                    <CardHeader>
                        <CardTitle>{test.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="line-clamp-2">{test.description}</p>
                        {test.keywords && test.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {test.keywords.map((kw, idx) => (
                                    <span key={idx} className="bg-gray-800 text-blue-600 px-2 py-1 rounded text-xs">{kw}</span>
                                ))}
                            </div>
                        )}
                        <Button onClick={() => navigate(`/tests/${test.id}`)}>Try it</Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
