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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.js";
import { Button } from "@/components/ui/button.js";
import { nanoid } from "nanoid";
import { Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch.js";
import {parseQuestionsFromText} from "@/utils/parsers/parseQuestionsFromText.js";
import BlockActions from "@/components/test-builder/BlockActions.jsx";
import QuestionBlock from "@/components/test-builder/QuestionBlock.jsx";
import TextImportBlock from "@/components/test-builder/TextImportBlock.jsx";
import SortableItem from "@/components/test-builder/SortableItem.jsx";
import { GripVertical } from "lucide-react";
import FileImportBlock from "@/components/test-builder/FileImportBlock.jsx";
import { Checkbox } from "@/components/ui/checkbox"
import {toast} from "sonner";
import {useNavigate} from "react-router-dom";

const defaultBlock = () => ({
    id: nanoid(),
    type: "manual",
    question: "",
    options: ["", "", ""],
    correct: [],
    isOpen: false,
    weight: 1,
    aiExplain: false,
});

// TODO: add pts for questions
// TODO: user can select questions that are allowed to be explained
export default function TestBuilder() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [blocks, setBlocks] = useState([]);
    const navigate = useNavigate();

    const sensors = useSensors(useSensor(PointerSensor));

    const handleAddBlock = () => {
        const newBlock = defaultBlock();
        setBlocks(prev => [...prev, newBlock]);
    };

    const handleDuplicateBlock = (id) => {
        const index = blocks.findIndex(b => b.id === id);
        if (index === -1) return;
        const blockToCopy = blocks[index];
        // Глибока копія даних (тільки не копіюємо id, щоб уникнути конфлікту)
        const newBlock = {
            ...JSON.parse(JSON.stringify(blockToCopy)),
            id: nanoid(), // Новий id
        };
        setBlocks([
            ...blocks.slice(0, index + 1),
            newBlock,
            ...blocks.slice(index + 1)
        ]);
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
            questions: blocks
                .filter(b => b.type === "manual")
                .map(({ question, options, correct, isOpen, weight, aiExplain}) => ({
                    question,
                    options,
                    correct,
                    isOpen,
                    weight,
                    aiExplain
                }))
        };

        // TODO: might be better to optimise token attaching logic over project
        const token = localStorage.getItem("token");
        await fetch("http://localhost:8080/api/v1/tests", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // ← важливо!
            },
            body: JSON.stringify(payload),
        });

        toast("Test is saved");

        navigate("/tests");
    };

    return (
        <div className="space-y-4 max-w-6xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>New test</CardTitle>
                    <CardDescription>Important test attributes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                    <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={isPublic}
                            onCheckedChange={setIsPublic}
                        />
                        <span>Public</span>
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
                                <SortableItem
                                    key={block.id}
                                    id={block.id}
                                    dragHandle={listeners => (
                                        <div className="cursor-grab text-gray-400 mr-2" {...listeners}>
                                            <GripVertical className="w-4 h-4" />
                                        </div>
                                    )}
                                >
                                    {dragHandle => (
                                        <TextImportBlock
                                            block={block}
                                            index={index}
                                            dragHandle={dragHandle}
                                            onChange={handleBlockChange}
                                            onRemove={handleRemoveBlock}
                                            onParse={handleParseTextBlock}
                                        />
                                    )}
                                </SortableItem>

                            );
                        }

                        if (block.type === "manual") {
                            return (
                                <SortableItem
                                    key={block.id}
                                    id={block.id}
                                    dragHandle={listeners => (
                                        <div className="cursor-grab text-gray-400 mr-2" {...listeners}>
                                            <GripVertical className="w-4 h-4" />
                                        </div>
                                    )}
                                >
                                    {dragHandle => (
                                        <QuestionBlock
                                            block={block}
                                            index={index}
                                            dragHandle={dragHandle}
                                            onChange={handleBlockChange}
                                            onOptionChange={handleOptionChange}
                                            onAddOption={addOption}
                                            onRemoveOption={removeOption}
                                            onToggleCorrect={toggleCorrect}
                                            onRemove={handleRemoveBlock}
                                            onDuplicate={handleDuplicateBlock}
                                        />
                                    )}
                                </SortableItem>
                            );
                        }

                        if (block.type === "fileImport") {
                            return (
                                <SortableItem
                                    key={block.id}
                                    id={block.id}
                                    dragHandle={listeners => (
                                        <div className="cursor-grab text-gray-400 mr-2" {...listeners}>
                                            <GripVertical className="w-4 h-4" />
                                        </div>
                                    )}
                                >
                                    {dragHandle => (
                                        <FileImportBlock
                                            block={block}
                                            index={index}
                                            dragHandle={dragHandle}
                                            onRemove={handleRemoveBlock}
                                            onChange={handleBlockChange}
                                        />
                                    )}
                                </SortableItem>
                            );
                        }

                        return null;
                    })}
                </SortableContext>
            </DndContext>

            {/* TODO: add button to duplicate current block */}
            {blocks.length > 0 && (
                <BlockActions
                    onAddBlock={handleAddBlock}
                    onAddTextImportBlock={handleAddTextImportBlock}
                    onAddFileImportBlock={handleAddFileImportBlock}
                />
            )}

            <Button onClick={handleSubmit} className="w-full" variant="default">
                Save test
            </Button>
        </div>
    );

}


