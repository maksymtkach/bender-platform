import {Button} from "@/components/ui/button.js";

export default function BlockActions({ onAddBlock, onAddTextImportBlock, onAddFileImportBlock }) {
    return (
        <div className="flex flex-wrap gap-4">
            <Button className="flex-1 min-w-[180px]" variant="outline" onClick={onAddBlock}>Add question</Button>
            <Button className="flex-1 min-w-[180px]" variant="outline" onClick={onAddTextImportBlock}>Import from text</Button>
            <Button className="flex-1 min-w-[180px]" variant="outline" onClick={onAddFileImportBlock}>Import from file</Button>
        </div>
    );
}