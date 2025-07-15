import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { LightbulbIcon } from "lucide-react";

export default function TakeTestPage() {
    const { id } = useParams();
    const [test, setTest] = useState(null);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [explanations, setExplanations] = useState({}); // { [questionId]: string }

    useEffect(() => {
        const token = localStorage.getItem("token");
        const fetchTest = async () => {
            const res = await fetch(`http://localhost:8080/api/v1/tests/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setTest(data);
        };
        fetchTest();
    }, [id]);

    const handleAnswerChange = (qIndex, optionIndex) => {
        const current = answers[qIndex] || [];
        const isSelected = current.includes(optionIndex);
        const updated = isSelected
            ? current.filter((i) => i !== optionIndex)
            : [...current, optionIndex];
        setAnswers({ ...answers, [qIndex]: updated });
    };

    const handleExplain = async (qr) => {
        setExplanations((prev) => ({
            ...prev,
            [qr.questionId]: "Loading...",
        }));

        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/v1/ai/explain", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                question: qr.question,
                options: qr.options,
                correctAnswer: qr.correctAnswer,
                userAnswer: qr.userAnswer,
            }),
        });
        const data = await res.json();
        console.log(data)
        setExplanations((prev) => ({
            ...prev,
            [qr.questionId]: data.explanation,
        }));
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        const body = {
            testId: test.id,
            answers: test.questions.map((q, idx) => ({
                questionId: q.id,
                answers: Array.isArray(answers[idx]) ? answers[idx] : [],
                openAnswer: typeof answers[idx] === "string" ? answers[idx] : null,
            })),
        };

        const res = await fetch("http://localhost:8080/api/v1/tests/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        console.log(data)
        setResult(data);
    };

    if (!test) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">{test.title}</h1>
            <p className="text-gray-500">{test.description}</p>

            {/* Тест ще не зданий */}
            {!result && (
                <>
                    {test.questions.map((q, index) => (
                        <Card key={q.id}>
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
                </>
            )}

            {/* Результат */}
            {result && (
                <div>
                    <h2 className="text-2xl font-bold mt-8 mb-4">
                        Your score: {result.score} / {result.maxScore}
                    </h2>
                    {result.questions.map((qr) => (
                        <Card key={qr.questionId} className="mb-4">
                            <CardHeader className="flex flex-row items-center gap-3">
                                <CardTitle>{qr.question}</CardTitle>
                                {qr.aiExplain && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleExplain(qr)}
                                        disabled={explanations[qr.questionId] === "Loading..."}
                                        title="AI explanation"
                                    >
                                        <LightbulbIcon className="w-4 h-4" />
                                    </Button>
                                )}

                            </CardHeader>
                            <CardContent className="space-y-2">
                                {qr.options ? (
                                    <div className="space-y-1">
                                        {qr.options.map((opt, idx) => {
                                            const userChose = (qr.userAnswers ?? []).includes(idx);
                                            const isCorrect = (qr.correctAnswers ?? []).includes(idx);

                                            let className =
                                                "block rounded px-2 py-1 transition-all";
                                            if (userChose && isCorrect) {
                                                className += " bg-green-500/80 text-white font-semibold";
                                            } else if (userChose && !isCorrect) {
                                                className += " bg-red-500/80 text-white font-semibold";
                                            } else if (!userChose && isCorrect) {
                                                className += " bg-green-500/30 font-semibold";
                                            } else {
                                                className += " bg-gray-700/50";
                                            }

                                            return (
                                                <div key={idx} className={className}>
                                                    {opt}
                                                    {userChose && <span className="ml-2 text-xs">(your choice)</span>}
                                                    {isCorrect && <span className="ml-2 text-xs">(correct)</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div>
                                        <p>
                                            <span className="font-semibold">Your answer:</span>{" "}
                                            {qr.openAnswer || "—"}
                                        </p>
                                        {qr.correctOpenAnswer && (
                                            <p>
                                                <span className="font-semibold">Correct answer:</span>{" "}
                                                {qr.correctOpenAnswer}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {qr.aiExplain && explanations[qr.questionId] && (
                                    <div className="bg-gray-800 p-2 rounded mt-2 text-sm">
                                        <b>AI:</b>{" "}
                                        {explanations[qr.questionId] === "Loading..."
                                            ? <span className="italic text-gray-500">Loading...</span>
                                            : explanations[qr.questionId]}
                                    </div>
                                )}

                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
