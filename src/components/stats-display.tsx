'use client';

import { costLimit, datasets } from '@/lib/datasets';
import React from 'react';
import { useUser } from '@/context/UserContext';

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

    let previewBarColor = isPreviewOverLimit ? 'bg-red-300' : 'bg-gray-200';
    if (isPreviewingRemoval) {
        previewBarColor = 'bg-blue-500';
    }

    return (
        <div className="w-full pb-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <span className="text-base font-medium text-gray-700">{label}</span>
                {showNumber && (
                    <span className="text-sm text-gray-500">
                        {isPreviewingRemoval ? previewValue : value} / {maxValue}
                    </span>
                )}
            </div>
            <div className="w-full bg-white rounded-full h-[12px] relative">
                <div
                    className={`${previewBarColor} h-[12px] rounded-full absolute transition-all duration-300`}
                    style={{ width: `${barToShowAsPreview}%` }}
                ></div>
                <div
                    className="bg-blue-300 h-[12px] rounded-full absolute transition-all duration-300"
                    style={{ width: `${barToShowAsMain}%` }}
                ></div>
                {limitPercentage !== undefined && (
                    <div
                        className="absolute top-[-8px] bottom-[-8px] w-[2.5px] bg-black rounded-full"
                        style={{ left: `${limitPercentage}%` }}
                    ></div>
                )}
            </div>
        </div>
    );
};

export function StatsDisplay() {
    const { cost, diversity, points, previewCost, previewDiversity, previewPoints, isPreviewingRemoval, name } = useUser();
    const totalPoints = datasets.reduce((acc, dataset) => acc + dataset.points, 0);
    return (
        <div className="bg-gray-100 p-4 rounded-md w-full flex flex-col gap-4 h-fit">
            <h2 className="text-2xl font-bold mb-2">{`${name}:`}</h2>
            <StatBar label="Kosten" value={cost} previewValue={previewCost} maxValue={200} limit={costLimit} isPreviewOverLimit={previewCost > costLimit} isPreviewingRemoval={isPreviewingRemoval} />
            <StatBar label="Diversität" value={diversity} previewValue={previewDiversity} maxValue={300} isPreviewingRemoval={isPreviewingRemoval} />
            <StatBar label="Datenmenge (Punkte)" value={points} previewValue={previewPoints} maxValue={totalPoints} isPreviewingRemoval={isPreviewingRemoval} showNumber={true} />
        </div>
    );
}
