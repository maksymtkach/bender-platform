import { useState } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {parseQuestionsFromText} from "@/utils/parsers/parseQuestionsFromText.js";

const defaultBlock = () => ({
    id: nanoid(),
    type: "manual",
    question: "",
    options: ["", "", ""],
    correct: [],
    isOpen: false,
});

function BlockActions({ onAddBlock, onAddTextImportBlock, onAddFileImportBlock }) {
    return (
        <div className="flex flex-wrap gap-4">
            <Button onClick={onAddBlock}>+ Додати питання</Button>
            <Button onClick={onAddTextImportBlock}>+ Додати імпорт з тексту</Button>
            <Button onClick={onAddFileImportBlock}>+ Додати імпорт з файлу</Button>
        </div>
    );
}

export default function TestBuilder() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [blocks, setBlocks] = useState([]);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleAddBlock = () => {
        const newBlock = defaultBlock();
        setBlocks(prev => [...prev, newBlock]);
    };

    const handleAddTextImportBlock = () => {
        setBlocks(prev => [...prev, { id: nanoid(), type: "textImport", content: "" }]);
    };

    const handleAddFileImportBlock = () => {
        setBlocks(prev => [...prev, { id: nanoid(), type: "fileImport", fileName: "", content: "" }]);
    };

    const handleBlockChange = (index, field, value) => {
        const newBlocks = [...blocks];
        newBlocks[index][field] = value;
        setBlocks(newBlocks);
    };

    const handleOptionChange = (blockIndex, optionIndex, value) => {
        const newBlocks = [...blocks];
        newBlocks[blockIndex].options[optionIndex] = value;
        setBlocks(newBlocks);
    };

    const addOption = (blockIndex) => {
        const newBlocks = [...blocks];
        newBlocks[blockIndex].options.push("");
        setBlocks(newBlocks);
    };

    const removeOption = (blockIndex, optionIndex) => {
        const newBlocks = [...blocks];
        newBlocks[blockIndex].options.splice(optionIndex, 1);
        newBlocks[blockIndex].correct = newBlocks[blockIndex].correct.filter(i => i !== optionIndex).map(i => i > optionIndex ? i - 1 : i);
        setBlocks(newBlocks);
    };

    const toggleCorrect = (blockIndex, optionIndex) => {
        const newBlocks = [...blocks];
        const correct = new Set(newBlocks[blockIndex].correct);
        if (correct.has(optionIndex)) correct.delete(optionIndex);
        else correct.add(optionIndex);
        newBlocks[blockIndex].correct = Array.from(correct);
        setBlocks(newBlocks);
    };

    const handleRemoveBlock = (id) => {
        setBlocks(prev => prev.filter(block => block.id !== id));
    };

    const handleParseTextBlock = (index) => {
        const block = blocks[index];
        const parsed = parseQuestionsFromText(block.content);
        const enriched = parsed.map(q => ({ ...q, id: nanoid(), type: "manual" }));
        const newBlocks = [...blocks.slice(0, index), ...enriched, ...blocks.slice(index + 1)];
        setBlocks(newBlocks);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = blocks.findIndex(b => b.id === active.id);
            const newIndex = blocks.findIndex(b => b.id === over?.id);
            setBlocks(arrayMove(blocks, oldIndex, newIndex));
        }
    };

    const handleSubmit = async () => {
        const payload = {
            title,
            description,
            isPublic,
            questions: blocks.filter(b => b.type === "manual"),
        };
        await fetch("http://localhost:8080/api/v1/tests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        alert("Test saved!");
    };

    return (
        <div className="space-y-4 max-w-6xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Інформація про тест</CardTitle>
                    <CardDescription>Назва, опис, доступ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input placeholder="Назва тесту" value={title} onChange={e => setTitle(e.target.value)} />
                    <Textarea placeholder="Опис" value={description} onChange={e => setDescription(e.target.value)} />
                    <div className="flex items-center gap-2">
                        <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
                        <span>Зробити публічним</span>
                    </div>
                </CardContent>
            </Card>

            {blocks.length === 0 && (
                <BlockActions
                    onAddBlock={handleAddBlock}
                    onAddTextImportBlock={handleAddTextImportBlock}
                    onAddFileImportBlock={handleAddFileImportBlock}
                />
            )}

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                    {blocks.map((block, index) => {
                        if (block.type === "textImport") {
                            return (
                                <Card key={block.id} className="border border-dashed">
                                    <CardHeader className="flex flex-row justify-between items-center">
                                        <CardTitle className="text-lg">Імпорт з тексту</CardTitle>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveBlock(block.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <Textarea
                                            placeholder="Вставте текст у форматі:
? Питання
/ Варіант 1
/ Варіант 2*
/ Варіант 3"
                                            value={block.content}
                                            onChange={e => handleBlockChange(index, "content", e.target.value)}
                                        />
                                        <Button variant="outline" onClick={() => handleParseTextBlock(index)}>Розпарсити</Button>
                                    </CardContent>
                                </Card>
                            );
                        }

                        if (block.type !== "manual") return null;

                        return (
                            <Card key={block.id} className="border border-dashed">
                                <CardHeader className="flex flex-row justify-between items-center">
                                    <CardTitle className="text-lg">Питання #{index + 1}</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Розгорнута відповідь</span>
                                        <Switch checked={block.isOpen} onCheckedChange={v => handleBlockChange(index, "isOpen", v)} />
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveBlock(block.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Input
                                        placeholder="Питання"
                                        value={block.question}
                                        onChange={e => handleBlockChange(index, "question", e.target.value)}
                                    />
                                    {block.isOpen ? (
                                        <Textarea
                                            placeholder="Очікувана відповідь"
                                            value={block.options[0] || ""}
                                            onChange={e => handleOptionChange(index, 0, e.target.value)}
                                        />
                                    ) : (
                                        <>
                                            {block.options.map((opt, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={block.correct.includes(i)}
                                                        onChange={() => toggleCorrect(index, i)}
                                                    />
                                                    <Input
                                                        className="flex-1"
                                                        placeholder={`Варіант ${i + 1}`}
                                                        value={opt}
                                                        onChange={e => handleOptionChange(index, i, e.target.value)}
                                                    />
                                                    <Button variant="ghost" size="icon" onClick={() => removeOption(index, i)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button variant="outline" onClick={() => addOption(index)}>+ Додати варіант</Button>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </SortableContext>
            </DndContext>

            {blocks.length > 0 && (
                <BlockActions
                    onAddBlock={handleAddBlock}
                    onAddTextImportBlock={handleAddTextImportBlock}
                    onAddFileImportBlock={handleAddFileImportBlock}
                />
            )}

            <Button onClick={handleSubmit} className="w-full" variant="outline">Зберегти тест</Button>
        </div>
    );
}


