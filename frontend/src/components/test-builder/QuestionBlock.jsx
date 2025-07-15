import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {Checkbox} from "@/components/ui/checkbox.js";
import { Copy as CopyIcon } from "lucide-react";
import { useState } from "react";


export default function QuestionBlock({
                                          index, dragHandle, block, onChange, onOptionChange, onAddOption, onRemoveOption, onToggleCorrect, onRemove, onDuplicate
                                      }) {
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <Card className="border border-dashed">
            <CardHeader className="flex flex-row justify-between items-center">
                <div className="flex items-center gap-2">
                    {dragHandle?.()}
                    <CardTitle>Question №{index + 1}</CardTitle>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <span className="text-sm">AI explanation</span>
                        <Switch
                            checked={block.aiExplain}
                            onCheckedChange={v => onChange(index, "aiExplain", v)}
                        />
                    </div>
                    <span className="text-sm">Text answer</span>
                    <Switch checked={block.isOpen} onCheckedChange={v => onChange(index, "isOpen", v)} />
                    <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                    <ConfirmDialog
                        open={deleteOpen}
                        onOpenChange={setDeleteOpen}
                        title="Delete this question?"
                        onConfirm={() => onRemove(block.id)}
                    >
                        This cannot be undone!
                    </ConfirmDialog>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <Input
                    placeholder="Question"
                    value={block.question}
                    onChange={e => onChange(index, "question", e.target.value)}
                />
                {block.isOpen ? (
                    <Textarea
                        placeholder="Expected (correct) answer"
                        value={block.options[0] || ""}
                        onChange={e => onOptionChange(index, 0, e.target.value)}
                    />
                ) : (
                    <>
                        {block.options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Checkbox
                                    checked={block.correct.includes(i)}
                                    onCheckedChange={() => onToggleCorrect(index, i)}
                                />
                                <Input
                                    className="flex-1"
                                    placeholder={`Option ${i + 1}`}
                                    value={opt}
                                    onChange={e => onOptionChange(index, i, e.target.value)}
                                />
                                <Button variant="ghost" size="icon" onClick={() => onRemoveOption(index, i)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        <CardFooter className="flex flex-row justify-between items-center p-0">
                            <Button variant="outline" onClick={() => onAddOption(index)}>Add option</Button>
                            <div className="flex items-center gap-2 mt-2 justify-end">
                                <label htmlFor={`score-${block.id}`} className="text-sm">Score</label>
                                <Input
                                    id={`score-${block.id}`}
                                    type="number"
                                    min={0.1}
                                    step={0.1}
                                    value={block.weight ?? ""}
                                    onChange={e => onChange(index, "weight", e.target.value === "" ? "" : Number(e.target.value))}
                                    className="w-20 text-right"
                                    placeholder="1"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDuplicate(block.id)}
                                    title="Duplicate question"
                                >
                                    <CopyIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardFooter>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
