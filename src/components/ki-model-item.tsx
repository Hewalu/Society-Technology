import { KiModel } from '@/lib/ki-models';
import { useUser } from "@/context/UserContext";

interface KiModelItemProps {
    kiModels: KiModel;
}

export function KiModelItem({ kiModels }: KiModelItemProps) {
    const { selectedDatasets, selectKiModel} = useUser();
    const isActive = selectedDatasets.has(kiModels.name);

    const handleClick = () => {
        console.log("Handle Toggle", kiModels.name);
        selectKiModel(kiModels.name);
    };

    return (
        <div
            className={`flex items-center justify-between p-2 px-4 py-3 rounded-md cursor-pointer ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}
            onClick={handleClick}
        >
            <button className="flex items-center gap-4 justify-between w-full">
                <div className="flex items-center gap-4">
                    <span className="font-medium">{kiModels.name}</span>
                </div>
            </button>
        </div>
    );
}
