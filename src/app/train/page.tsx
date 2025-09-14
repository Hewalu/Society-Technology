'use client';

import { NameDialog } from '@/components/name-dialog';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { Loader2, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { datasets } from '@/lib/datasets';
import { DatasetItem } from '@/components/dataset-item';
import { StatsDisplay } from '@/components/stats-display';
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function TrainPage() {
  const { name, points, toggleIsDataChooseMode } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = () => {
    router.push('/');
  };

  const handleCreateAIClick = () => {
    if (points === 0) {
      toast.error('Du musst mindestens einen Datensatz auswählen.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      router.push('/use');
    }, 1000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-8 py-24">
      <Button variant="outline" size="icon" onClick={handleReset} className="absolute top-4 left-4">
        <RotateCcw className="h-4 w-4" />
      </Button>
      {name == '' && <NameDialog />}
      <div>
        <Button onClick={toggleIsDataChooseMode} className="absolute right-5 top-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Wähle eine KI
        </Button>
        <h1 className="text-4xl font-bold mb-4 text-center">Trainiere deine KI</h1>
      </div>
      <p className="text-lg mb-8 text-center max-w-[1000px]">
        Du hast die Aufgabe eine erfolgreiche Ki zu erstellen. Dafür kannst du entscheiden, mit welchen Datensätzen 
        die KI angelernt werden soll. Jeder Datensatz gibt dir verschieden viele Punkte. Eine starke KI hat mindestens 
        eine Datenmenge von 150 Punkte.
      </p>

      <div className="flex flex-col md:flex-row w-full mt-8 gap-8 max-w-[1000px] items-center">
        <div className="flex-1 w-full">
          <h2 className="text-2xl font-bold mb-4">Datensätze</h2>
          <div className="flex flex-col gap-2">
            {datasets.map((dataset) => (
              <DatasetItem key={dataset.name} dataset={dataset} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-8 w-full max-w-[385px] pt-8">
          <StatsDisplay />
          <Button className="w-fit ml-auto" onClick={handleCreateAIClick} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            KI Erstellen
          </Button>
        </div>
      </div>
    </main>
  );
}
