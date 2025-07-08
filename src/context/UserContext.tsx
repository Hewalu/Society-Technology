'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { costLimit, datasets } from '@/lib/datasets';

interface UserContextType {
    name: string;
    setName: (name: string) => void;
    resetName: () => void;
    selectedDatasets: Set<string>;
    toggleDataset: (datasetName: string) => void;
    cost: number;
    diversity: number;
    points: number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [name, setName] = useState('');
    const [selectedDatasets, setSelectedDatasets] = useState(new Set<string>());
    const [cost, setCost] = useState(0);
    const [diversity, setDiversity] = useState(0);
    const [points, setPoints] = useState(0);

    const resetName = () => {
        setName('');
    };

    const toggleDataset = (datasetName: string) => {
        const newSet = new Set(selectedDatasets);
        if (newSet.has(datasetName)) {
            newSet.delete(datasetName);
        } else {
            newSet.add(datasetName);
        }

        const { cost, diversity, points } = datasets
            .filter((dataset) => newSet.has(dataset.name))
            .reduce(
                (acc, dataset) => {
                    acc.cost += dataset.cost;
                    acc.diversity += dataset.diversity;
                    acc.points += dataset.points;
                    return acc;
                },
                { cost: 0, diversity: 0, points: 0 }
            );


        if (cost < costLimit) {
            setCost(cost);
            setDiversity(diversity);
            setPoints(points);
            setSelectedDatasets(newSet);
        } else {
            toast.warning('Die Kosten übersteigen dein Budget!');
        }

    };

    return (
        <UserContext.Provider value={{ name, setName, resetName, selectedDatasets, toggleDataset, cost, diversity, points }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
