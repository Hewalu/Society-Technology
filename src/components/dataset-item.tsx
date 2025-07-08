import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dataset } from "@/lib/datasets";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/context/UserContext";
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
            className={`flex items-center justify-between p-2 px-4 py-3 rounded-md cursor-pointer ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}
            onClick={handleToggle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex items-center gap-4 justify-between w-full">
                <div className="flex items-center gap-4">
                    <Checkbox checked={isSelected} className="bg-white" />
                    <span className="font-medium">{dataset.name}</span>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="h-[18px] w-[18px] text-gray-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="max-w-[200px]">{dataset.description}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}
