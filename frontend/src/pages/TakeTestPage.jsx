import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

// TODO: add AI explanations for questions
// TODO: improve UI of this page
// TODO: enable evaluating of test
export default function TakeTestPage() {
    const { id } = useParams();
    const [test, setTest] = useState(null);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const token = localStorage.getItem("token");

        // TODO: might be better to optimise token attaching logic over project
        const fetchTest = async () => {
            const res = await fetch(`http://localhost:8080/api/v1/tests/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await res.json();
            setTest(data);
        };
        fetchTest();
    }, [id]);

    const handleAnswerChange = (qIndex, optionIndex) => {
        const current = answers[qIndex] || [];
        const isSelected = current.includes(optionIndex);
        const updated = isSelected ? current.filter(i => i !== optionIndex) : [...current, optionIndex];
        setAnswers({ ...answers, [qIndex]: updated });
    };

    const handleSubmit = () => {
        console.log("Answers:", answers);
        alert("Test is complete");
    };

    if (!test) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">{test.title}</h1>
            <p className="text-gray-500">{test.description}</p>

            {test.questions.map((q, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle>{q.question}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {q.isOpen ? (
                            <Textarea
                                placeholder="Your answer"
                                value={answers[index] || ""}
                                onChange={e =>
                                    setAnswers({ ...answers, [index]: e.target.value })
                                }
                            />
                        ) : (
                            q.options.map((opt, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <Checkbox
                                        checked={(answers[index] || []).includes(i)}
                                        onCheckedChange={() => handleAnswerChange(index, i)}
                                    />
                                    <span>{opt}</span>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            ))}

            <Button className="w-full" onClick={handleSubmit}>
                Submit test
            </Button>
        </div>
    );
}
