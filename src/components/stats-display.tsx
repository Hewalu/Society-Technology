'use client';

import { costLimit } from '@/lib/datasets';
import React from 'react';

interface StatBarProps {
    label: string;
    value: number;
    maxValue: number;
    limit?: number;
}

const StatBar: React.FC<StatBarProps> = ({ label, value, maxValue, limit }) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    const limitPercentage = limit ? Math.min((limit / maxValue) * 100, 100) : undefined;

    return (
        <div className="w-full pb-4 flex flex-col">
            <span className="text-base font-medium text-gray-700 mb-4">{label}</span>
            <div className="w-full bg-white rounded-full h-[12px] relative">
                <div
                    className="bg-blue-300 h-[12px] rounded-full"
                    style={{ width: `${percentage}%` }}
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

interface StatsDisplayProps {
    cost: number;
    diversity: number;
    points: number;
}

export function StatsDisplay({ cost, diversity, points }: StatsDisplayProps) {
    return (
        <div className="bg-gray-100 p-4 rounded-md w-full flex flex-col gap-4 h-fit">
            <h2 className="text-2xl font-bold mb-2">KI-Statistiken</h2>
            <StatBar label="Kosten" value={cost} maxValue={200} limit={costLimit} />
            <StatBar label="Diversität" value={diversity} maxValue={300} />
            <StatBar label="Datenmenge (Punkte)" value={points} maxValue={300} />
        </div>
    );
}
