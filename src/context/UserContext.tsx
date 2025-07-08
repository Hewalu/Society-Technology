'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { costLimit, datasets, Dataset } from '@/lib/datasets';

interface UserContextType {
    name: string;
    setName: (name: string) => void;
    resetName: () => void;
    selectedDatasets: Set<string>;
    toggleDataset: (datasetName: string) => void;
    cost: number;
    diversity: number;
    points: number;
    bias: number;
    setPreview: (dataset: Dataset) => void;
    clearPreview: () => void;
    previewCost: number;
    previewDiversity: number;
    previewPoints: number;
    previewBias: number;
    isPreviewingRemoval: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [name, setName] = useState('');
    const [selectedDatasets, setSelectedDatasets] = useState(new Set<string>());
    const [cost, setCost] = useState(0);
    const [diversity, setDiversity] = useState(0);
    const [points, setPoints] = useState(0);
    const [bias, setBias] = useState(0);
    const [previewCost, setPreviewCost] = useState(0);
    const [previewDiversity, setPreviewDiversity] = useState(0);
    const [previewPoints, setPreviewPoints] = useState(0);
    const [previewBias, setPreviewBias] = useState(0);
    const [isPreviewingRemoval, setIsPreviewingRemoval] = useState(false);

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

        const { cost, diversity, points, bias } = datasets
            .filter((dataset) => newSet.has(dataset.name))
            .reduce(
                (acc, dataset) => {
                    acc.cost += dataset.cost;
                    acc.diversity += dataset.diversity;
                    acc.points += dataset.points;
                    acc.bias += dataset.bias;
                    return acc;
                },
                { cost: 0, diversity: 0, points: 0, bias: 0 }
            );

        setPreviewCost(cost);
        setPreviewDiversity(diversity);
        setPreviewPoints(points);
        setPreviewBias(bias);

        if (cost < costLimit) {
            setCost(cost);
            setDiversity(diversity);
            setPoints(points);
            setBias(bias);
            setSelectedDatasets(newSet);
        } else {
            toast.warning('Die Kosten übersteigen dein Budget!');
        }
    };

    const setPreview = (dataset: Dataset) => {
        if (selectedDatasets.has(dataset.name)) {
            setPreviewCost(cost - dataset.cost);
            setPreviewDiversity(diversity - dataset.diversity);
            setPreviewPoints(points - dataset.points);
            setPreviewBias(bias - dataset.bias);
            setIsPreviewingRemoval(true);
        } else {
            setPreviewCost(cost + dataset.cost);
            setPreviewDiversity(diversity + dataset.diversity);
            setPreviewPoints(points + dataset.points);
            setPreviewBias(bias + dataset.bias);
            setIsPreviewingRemoval(false);
        }
    };

    const clearPreview = () => {
        setPreviewCost(cost);
        setPreviewDiversity(diversity);
        setPreviewPoints(points);
        setPreviewBias(bias);
        setIsPreviewingRemoval(false);
    };

    return (
        <UserContext.Provider
            value={{
                name,
                setName,
                resetName,
                selectedDatasets,
                toggleDataset,
                cost,
                diversity,
                points,
                bias,
                setPreview,
                clearPreview,
                previewCost,
                previewDiversity,
                previewPoints,
                previewBias,
                isPreviewingRemoval,
            }}
        >
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
