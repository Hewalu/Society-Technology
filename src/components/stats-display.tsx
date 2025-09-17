'use client';

import { costLimit, datasets } from '@/lib/datasets';
import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Pencil, Check } from 'lucide-react';

interface StatBarProps {
    label: string;
    value: number;
    previewValue: number;
    maxValue: number;
    limit?: number;
    isPreviewOverLimit?: boolean;
    isPreviewingRemoval?: boolean;
    showNumber?: boolean;
}

const StatBar: React.FC<StatBarProps> = ({ label, value, previewValue, maxValue, limit, isPreviewOverLimit, isPreviewingRemoval, showNumber }) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    const previewPercentage = Math.min((previewValue / maxValue) * 100, 100);
    const limitPercentage = limit ? Math.min((limit / maxValue) * 100, 100) : undefined;

    const barToShowAsPreview = isPreviewingRemoval ? percentage : previewPercentage;
    const barToShowAsMain = isPreviewingRemoval ? previewPercentage : percentage;

    let previewBarColor = isPreviewOverLimit ? 'bg-red-300 dark:bg-red-500/70' : 'bg-slate-200 dark:bg-slate-700/80';
    if (isPreviewingRemoval) {
        previewBarColor = 'bg-blue-500 dark:bg-blue-400/80';
    }

    return (
        <div className="w-full pb-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <span className="text-base font-medium text-slate-700 dark:text-slate-100">{label}</span>
                {showNumber && (
                    <span className="text-sm text-slate-500 dark:text-slate-300">
                        {isPreviewingRemoval ? previewValue : value} / {maxValue}
                    </span>
                )}
            </div>
            <div className="w-full bg-white dark:bg-slate-900/70 rounded-full h-[12px] relative">
                <div
                    className={`${previewBarColor} h-[12px] rounded-full absolute transition-all duration-300`}
                    style={{ width: `${barToShowAsPreview}%` }}
                ></div>
                <div
                    className="bg-blue-300 dark:bg-blue-500 h-[12px] rounded-full absolute transition-all duration-300"
                    style={{ width: `${barToShowAsMain}%` }}
                ></div>
                {limitPercentage !== undefined && (
                    <div
                        className="absolute top-[-8px] bottom-[-8px] w-[2.5px] bg-black dark:bg-white rounded-full"
                        style={{ left: `${limitPercentage}%` }}
                    ></div>
                )}
            </div>
        </div>
    );
};

export function StatsDisplay() {
    const { cost, diversity, points, bias, previewCost, previewDiversity, previewPoints, previewBias, isPreviewingRemoval, name, setName } = useUser();
    const totalPoints = datasets.reduce((acc, dataset) => acc + dataset.points, 0);
    const totalBias = datasets.reduce((acc, dataset) => acc + dataset.bias, 0);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(name);

    const handleNameChange = () => {
        if (newName.trim()) {
            setName(newName.trim());
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleNameChange();
        }
    };

    return (
        <div className="bg-white/80 dark:bg-slate-900/70 p-4 rounded-md w-full flex flex-col gap-4 h-fit backdrop-blur">
            <div className="flex justify-between items-center mb-2">
                {isEditing ? (
                    <div className="flex items-center gap-2 w-full">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="text-2xl font-bold bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none w-full"
                        />
                        <Check className="h-6 w-6 cursor-pointer text-emerald-600 dark:text-emerald-400 mr-2 ml-6" onClick={handleNameChange} />
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold border-b-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">{`${name}:`}</h2>
                        <Pencil className="h-5 w-5 cursor-pointer text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white mr-2 ml-6" onClick={() => setIsEditing(true)} />
                    </>
                )}
            </div>
            <StatBar label="Kosten" value={cost} previewValue={previewCost} maxValue={200} limit={costLimit} isPreviewOverLimit={previewCost > costLimit} isPreviewingRemoval={isPreviewingRemoval} />
            <StatBar label="Datenmenge (Punkte)" value={points} previewValue={previewPoints} maxValue={totalPoints} isPreviewingRemoval={isPreviewingRemoval} showNumber={true} />
            <StatBar label="Diversität" value={diversity} previewValue={previewDiversity} maxValue={300} isPreviewingRemoval={isPreviewingRemoval} />
            <StatBar label="Bias" value={bias} previewValue={previewBias} maxValue={totalBias} isPreviewingRemoval={isPreviewingRemoval} />
        </div>
    );
}
