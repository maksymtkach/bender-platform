import {Button} from "@/components/ui/button.js";

export default function BlockActions({ onAddBlock, onAddTextImportBlock, onAddFileImportBlock }) {
    return (
        <div className="flex flex-wrap gap-4">
            <Button onClick={onAddBlock}>Add question</Button>
            <Button onClick={onAddTextImportBlock}>Import from text</Button>
            <Button onClick={onAddFileImportBlock}>Import from file</Button>
        </div>
    );
}