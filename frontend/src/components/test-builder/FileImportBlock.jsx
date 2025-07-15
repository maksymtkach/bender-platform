import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function FileImportBlock({ block, index, dragHandle, onRemove }) {
    return (
        <Card className="border border-dashed">
            <CardHeader className="flex flex-row justify-between items-center">
                <div className="flex items-center gap-2">
                    {dragHandle?.()}
                    <CardTitle>File import №{index + 1}</CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onRemove(block.id)}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <input
                    type="file"
                    accept=".txt"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                            onChange(index, "content", reader.result);
                            onChange(index, "fileName", file.name);
                        };
                        reader.readAsText(file);
                    }}
                />
                {block.fileName && <p className="mt-2 text-sm text-muted-foreground">File: {block.fileName}</p>}
            </CardContent>
        </Card>
    );
}
