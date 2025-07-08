import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dataset } from "@/lib/datasets";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/context/UserContext";
import { Info } from "lucide-react";

interface DatasetItemProps {
    dataset: Dataset;
}

export function DatasetItem({ dataset }: DatasetItemProps) {
    const { selectedDatasets, toggleDataset } = useUser();
    const isSelected = selectedDatasets.has(dataset.name);

    const handleToggle = () => {
        toggleDataset(dataset.name);
    };

    return (
        <div
            className={`flex items-center justify-between p-2 px-4 py-3 rounded-md cursor-pointer ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}
            onClick={handleToggle}
        >
            <div className="flex items-center gap-4">
                <Checkbox checked={isSelected} />
                <div className="flex items-center gap-2">
                    <span>{dataset.name}</span>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-gray-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-[200px]">{dataset.description}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <span>+{dataset.points}</span>
        </div>
    );
}
