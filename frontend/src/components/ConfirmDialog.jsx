import { Dialog, DialogTrigger, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function ConfirmDialog({ open, onOpenChange, onConfirm, title, children }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <div className="space-y-4">
                    <h3 className="font-bold">{title || "Are you sure?"}</h3>
                    <div>{children}</div>
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={() => { onConfirm(); onOpenChange(false); }}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
