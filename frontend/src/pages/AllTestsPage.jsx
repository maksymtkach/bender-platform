import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// TODO: improve UI of this page
export default function AllTestsPage() {
    const [tests, setTests] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem("token");

        // TODO: might be better to optimise token attaching logic over project
        const fetchTests = async () => {
            const res = await fetch("http://localhost:8080/api/v1/tests", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}``
                },
            });
            const data = await res.json();
            setTests(data);
        };
        fetchTests();
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">Список тестів</h1>
            {tests.map(test => (
                <Card key={test.id}>
                    <CardHeader>
                        <CardTitle>{test.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p>{test.description}</p>
                        <Button onClick={() => navigate(`/tests/${test.id}`)}>Пройти тест</Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
