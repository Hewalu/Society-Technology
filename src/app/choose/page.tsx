'use client';

import { NameDialog } from '@/components/name-dialog';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { kiModels } from '@/lib/ki-models';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { KiModelItem } from '@/components/ki-model-item';

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
          Trainiere deine KI
        </Button>
        <h1 className="text-4xl font-bold mb-4 text-center">Wähle eine KI</h1>
      </div>
      <p className="text-lg mb-8 text-center max-w-[1000px]">
        Wähle zwischen den verschiedenen KI-Modellen und siehe wie sie sich unterscheiden.
      </p>

      <div className="flex flex-col md:flex-row w-full mt-8 gap-8 max-w-[1000px] items-center">
        <div className="flex-1 w-full">
          <h2 className="text-2xl font-bold mb-4">Modelle</h2>
          <div className="flex flex-col gap-2">
            {kiModels.map((kiModels) => (
              <KiModelItem key={kiModels.name} kiModels={kiModels} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
