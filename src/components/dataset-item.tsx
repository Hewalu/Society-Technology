import { Dataset } from "@/lib/datasets";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/context/UserContext";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { useRef } from "react";

interface DatasetItemProps {
    dataset: Dataset;
}

export function DatasetItem({ dataset }: DatasetItemProps) {
    const { selectedDatasets, toggleDataset, setPreview, clearPreview } = useUser();
    const isSelected = selectedDatasets.has(dataset.name);
    const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleToggle = () => {
        console.log("Handle Toggle", dataset.name);
        toggleDataset(dataset.name);
    };

    const handleMouseEnter = () => {
        if (previewTimeoutRef.current) {
            clearTimeout(previewTimeoutRef.current);
        }
        previewTimeoutRef.current = setTimeout(() => {
            setPreview(dataset);
        }, 150);
    };

    const handleMouseLeave = () => {
        if (previewTimeoutRef.current) {
            clearTimeout(previewTimeoutRef.current);
        }
        clearPreview();
    };

    return (
        <div
            className={`flex items-center justify-between p-2 px-4 py-3 rounded-md cursor-pointer transition-colors ${
                isSelected
                    ? 'bg-indigo-100 dark:bg-indigo-500/30'
                    : 'bg-white/80 dark:bg-slate-900/70'
            }`}
            onClick={handleToggle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex items-center gap-4 justify-between w-full">
                <div className="flex items-center gap-4">
                    <Checkbox checked={isSelected} className="bg-white dark:bg-slate-900" />
                    <span className="font-medium text-slate-900 dark:text-slate-100">{dataset.name}</span>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <Dialog>
                            <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <DialogTrigger asChild>
                                    <Info className="h-[18px] w-[18px] text-slate-600 dark:text-slate-300" />
                                </DialogTrigger>
                            </TooltipTrigger>
                            <DialogContent onClick={(e) => e.stopPropagation()}>
                                <DialogHeader>
                                    <DialogTitle>{dataset.name}</DialogTitle>
                                    <DialogDescription className="text-base mt-4">
                                        {dataset.description}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col gap-4 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="font-semibold">Kosten:</div>
                                        <div>+{dataset.cost}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="font-semibold">Datenmenge:</div>
                                        <div>+{dataset.points}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="font-semibold">Diversität:</div>
                                        <div>+{dataset.diversity}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="font-semibold">Bias:</div>
                                        <div>+{dataset.bias}</div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <TooltipContent>
                            <p className="max-w-[200px]">{dataset.description}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}
