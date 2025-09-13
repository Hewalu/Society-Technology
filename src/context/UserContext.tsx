'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { costLimit, datasets, Dataset } from '@/lib/datasets';

export type KiResult = {
    title: string;
    colors: ParticleColor[];
    description: string;
};

export interface ParticleColor {
  name: string;
  rgb: string;
  ratio: number;
}

interface UserContextType {
    name: string;
    setName: (name: string) => void;
    resetName: () => void;
    selectedDatasets: Set<string>;
    toggleDataset: (datasetName: string) => void;
    cost: number;
    diversity: number;
    points: number;
    colors: ParticleColor[];
    bias: number;
    setPreview: (dataset: Dataset) => void;
    clearPreview: () => void;
    previewCost: number;
    previewDiversity: number;
    previewPoints: number;
    previewBias: number;
    isPreviewingRemoval: boolean;
    // isDataChooseMode: boolean;
    // setIsDataChooseMode: (value: boolean) => void; // TODO: Funktion definieren um Mode zu wechseln!!! Die Modi sind dafür da, dass man selber Daten auswählen kann, oder vorgegebene KI Modelle laden kann. Bei einem Wechel muss dann der Kontext zurückgesetzt  werden, dass keine wierden Werte das Farbenverhältniss zerstören!
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [name, setName] = useState('');
    const [selectedDatasets, setSelectedDatasets] = useState(new Set<string>());
    const [cost, setCost] = useState(0);
    const [diversity, setDiversity] = useState(0);
    const [points, setPoints] = useState(0);
    const [colors, setColors] = useState<ParticleColor[]>([]); 
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

        const { color, cost, diversity, points, bias } = datasets
            .filter((dataset) => newSet.has(dataset.name))
            .reduce(
                (acc, dataset) => {
                    acc.cost += dataset.cost;
                    acc.diversity += dataset.diversity;
                    acc.points += dataset.points;
                    acc.bias += dataset.bias;

                    if (dataset.color) {
                        acc.color = dataset.color;
                    }

                    return acc;
                },
                {
                    color: undefined as ParticleColor | undefined,
                    cost: 0,
                    diversity: 0,
                    points: 0,
                    bias: 0,
                }
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

            if (color) {
                toggleColor({
                    name: color.name,
                    rgb: color.rgb,
                    ratio: color.ratio,
                });
            }
        } else {
            toast.warning('Die Kosten übersteigen dein Budget!');
        }
    };

    const toggleColor = (newColor: { name: string; rgb: string; ratio: number }) => {
        setColors((prevColors) => {
            const exists = prevColors.some((color) => color.name === newColor.name);
            let updatedColors: typeof prevColors;

            if (exists) {
                updatedColors = prevColors.filter((color) => color.name !== newColor.name);
            } else {
                updatedColors = [...prevColors, newColor];
            }

            const zeroRatios = updatedColors.filter(c => c.ratio === 0);

            if (zeroRatios.length === 1) {
                const equalRatio = 1 / updatedColors.length;
                return updatedColors.map(c => ({
                    ...c,
                    ratio: equalRatio
                }));
            }
            console.log("Neue Farben: ", updatedColors);
            return updatedColors;
        });
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
                colors,
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
