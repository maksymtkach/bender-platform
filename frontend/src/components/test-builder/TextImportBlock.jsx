import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export default function TextImportBlock({ block, index, onChange, onRemove, onParse, dragHandle }) {
    return (
        <Card className="border border-dashed">
            <CardHeader className="flex flex-row justify-between items-center">
                <div className="flex items-center gap-2">
                    {dragHandle?.()}
                    <CardTitle className="text-lg">Import from text</CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onRemove(block.id)}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-2">
                <Textarea
                    placeholder={`? Question\n/ Option 1\n/ Option 2*\n/ Option 3`}
                    value={block.content}
                    onChange={e => onChange(index, "content", e.target.value)}
                />
                <Button variant="outline" onClick={() => onParse(index)}>Parse</Button>
            </CardContent>
        </Card>
    )
}
