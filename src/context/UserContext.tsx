'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { costLimit, datasets, Dataset } from '@/lib/datasets';
import { useRouter, usePathname  } from 'next/navigation';

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
    selectKiModel: (kiModelName: string) => void;
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
    isDataChooseMode: boolean;
    toggleIsDataChooseMode: () => void; 
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
    const router = useRouter();

    const resetName = () => {
        setName('');
    };

    const toggleDataset = (datasetName: string) => {
        // 1. Berechne neues Set
        const newSet = new Set(selectedDatasets);
        if (newSet.has(datasetName)) {
            newSet.delete(datasetName);
        } else {
            newSet.add(datasetName);
        }

        // 2. Berechne neue Summen
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

        // 3. Vorschau-States setzen (immer möglich)
        setPreviewCost(cost);
        setPreviewDiversity(diversity);
        setPreviewPoints(points);
        setPreviewBias(bias);

        // 4. Cost-Limit prüfen
        if (cost > costLimit) {
            toast.warning('Die Kosten übersteigen dein Budget!');
            return; // Abbrechen → kein State-Update
        }

        // 5. States aktualisieren
        setCost(cost);
        setDiversity(diversity);
        setPoints(points);
        setBias(bias);
        setSelectedDatasets(newSet);

        // 6. Farben-Logik
        // Wir wollen toggleColor aufrufen, nur wenn das Dataset eine Farbe hat
        const dataset = datasets.find((d) => d.name === datasetName);
        if (dataset?.color) {
            toggleColor({
                name: dataset.color.name,
                rgb: dataset.color.rgb,
                ratio: dataset.color.ratio ?? 0, // falls ratio undefined, 0 verwenden
            });
        }
    };

    // toggleColor bleibt unverändert
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
                updatedColors = updatedColors.map(c => ({
                    ...c,
                    ratio: equalRatio
                }));
            }

            console.log("Neue Farben: ", updatedColors);
            return updatedColors;
        });
    };

    const selectKiModel = (kiModelName: string) => {
        const model = datasets.find((dataset) => dataset.name === kiModelName);
        if (!model) {
            toast.error('KI-Modell nicht gefunden.');
            return;
        }

        // Setze das ausgewählte Dataset
        const newSet = new Set<string>();
        newSet.add(model.name);
        setSelectedDatasets(newSet);

        // Aktualisiere die Summen basierend auf dem ausgewählten Modell
        setCost(model.cost);
        setDiversity(model.diversity);
        setPoints(model.points);
        setBias(model.bias);

        // Setze die Farben basierend auf dem Modell
        if (model.color) {
            setColors([{
                name: model.color.name,
                rgb: model.color.rgb,
                ratio: model.color.ratio ?? 1, // falls ratio undefined, 1 verwenden
            }]);
        } else {
            setColors([]);
        }

        // Setze die Vorschau-States entsprechend
        setPreviewCost(model.cost);
        setPreviewDiversity(model.diversity);
        setPreviewPoints(model.points);
        setPreviewBias(model.bias);
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

    const resetStates = () => {
        setSelectedDatasets(new Set());
        setCost(0);
        setDiversity(0);
        setPoints(0);
        setBias(0);
        setColors([]);
        setPreviewCost(0);
        setPreviewDiversity(0);
        setPreviewPoints(0);
        setPreviewBias(0);
        setIsPreviewingRemoval(false);
    };

    const pathname = usePathname();
    const isDataChooseMode = pathname === '/train'; // true wenn train, false wenn choose


    const toggleIsDataChooseMode = () => {
        resetStates();

        if (pathname === '/train') {
            console.log("Wechsel von Train zu Choose");
            router.push('/choose');
        } else {
            console.log("Wechsel von Choose zu Train");
            router.push('/train');
        }
        };


    return (
        <UserContext.Provider
            value={{
                name,
                setName,
                resetName,
                selectedDatasets,
                toggleDataset,
                selectKiModel,
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
                isDataChooseMode,
                toggleIsDataChooseMode,
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
