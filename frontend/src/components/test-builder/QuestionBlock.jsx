import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {Checkbox} from "@/components/ui/checkbox.js";

export default function QuestionBlock({
                                          index, dragHandle, block, onChange, onOptionChange, onAddOption, onRemoveOption, onToggleCorrect, onRemove
                                      }) {
    return (
        <Card className="border border-dashed">
            <CardHeader className="flex flex-row justify-between items-center">
                <div className="flex items-center gap-2">
                    {dragHandle?.()}
                    <CardTitle>Question №{index + 1}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                    {/* TODO: pop up with warning that prev question data will be lost  */}
                    <span className="text-sm">Text answer</span>
                    <Switch checked={block.isOpen} onCheckedChange={v => onChange(index, "isOpen", v)} />
                    {/* TODO: pop up with warning that question data will be deleted  */}
                    <Button variant="ghost" size="icon" onClick={() => onRemove(block.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
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
                        <Button variant="outline" onClick={() => onAddOption(index)}>Add option</Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
