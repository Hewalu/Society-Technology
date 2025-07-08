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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

type KiResult = {
  title: string;
  description: string;
};

export default function TrainPage() {
  const { name, diversity, points } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [kiResult, setKiResult] = useState<KiResult | null>(null);

  const handleReset = () => {
    router.push('/');
  };

  const getKiResult = (diversity: number, points: number): KiResult => {
    if (diversity > 65) {
      return {
        title: 'Du hast eine sehr diverse KI angelernt!',
        description: `Sie ist mit Daten aus aller Welt trainiert worden und ihre Antworten sind von vielen verschiedenen kulturellen Einflüssen geprägt. Der Bias ist dementsprechend klein. Um Datensätzen aus verschiedenen Regionen und Kulturen mit der gleichen Gewichtung in den Lernprozess aufzunehmen zu können, wurden deutlich weniger Datensätze verwendet, wie aus manchen Regionen zu Verfügung gewesen wären. Deshalb bietet "${name}" in vielen Bereichen Antworten mit weniger Wissenshintergrund, was sie für viele Nutzer unattraktiver und insgesamt wirtschaftlich nicht erfolgreich macht.`,
      };
    }
    if (diversity > 35) {
      return {
        title: 'Du hast eine ausgewogene KI angelernt!',
        description: `Sie ist mit Datensätzen aus verschiedenen Regionen und Themenbereichen trainiert worden. Der Bias ist vorhanden, aber vergleichsweise gering – viele Antworten sind differenziert und reflektiert. Allerdings fehlt der KI oft die klare Spezialisierung auf wirtschaftlich relevante Themen, weshalb sie in manchen Bereichen etwas unscharf oder weniger effizient wirkt. Für Nutzer:innen bedeutet das: Sie bekommen meist faire, aber manchmal weniger konkrete Antworten. Deine KI ist kein Star im globalen Wettbewerb, dafür aber ein System mit ethischem Potenzial.`,
      };
    }
    if (points > 150) {
      return {
        title: 'Du hast eine wirtschaftlich sehr starke KI angelernt!',
        description: `Die Antworten deiner KI vor allem im Bereich Technik und Programmierung sind herausragend. Man kann "${name}" auch zu kulturellen und persönlichen Dingen befragen, aber hier unterliegen die Nutzer einem starken Bias. Da die Daten zum Anlernen deiner KI vor allem aus westlichen Ländern und vor allem aus angloamerikanischen Kulturen kommen, werden andere Kulturen bei der Verarbeitung von Nutzeranfragen wenig beachtet. So reproduzieren sich Machtsysteme wie das Patriachat, Rassismus und westliche Wertevorstellungen durch deine KI. Durch den hohen Wissenshintergrund sind die Nutzer sehr zufrieden und deine KI steigt in den Globalen Wettkampf mit den anderen großen LLMs.`,
      };
    }
    return {
      title: 'Deine KI ist noch am Anfang!',
      description: `Deine KI "${name}" wurde mit einer kleinen und wenig diversen Datenmenge trainiert. Ihre Fähigkeiten sind begrenzt und die Antworten weisen einen starken Bias auf. Sie ist für den professionellen Einsatz noch nicht bereit, aber es ist ein erster Schritt. Experimentiere mit mehr und diverseren Datensätzen, um ihr Potenzial zu steigern.`,
    };
  };

  const handleCreateAIClick = () => {
    if (points === 0) {
      toast.error('Du musst mindestens einen Datensatz auswählen.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setKiResult(getKiResult(diversity, points));
      setIsLoading(false);
      setIsDialogOpen(true);
    }, 1000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Button variant="outline" size="icon" onClick={handleReset} className="absolute top-4 left-4">
        <RotateCcw className="h-4 w-4" />
      </Button>
      {name == '' && <NameDialog />}
      <h1 className="text-4xl font-bold mb-4 text-center">Trainiere deine KI</h1>
      <p className="text-lg mb-8 text-center max-w-[1000px]">Du hast die Aufgabe ein wirtschaftlich erfolgreiche Ki zu erstellen. Dafür kannst du entscheiden, mit welchen Datensätzen die KI angelernt werden soll. Jeder Datensatz gibt dir verschieden viele Punkte. Eine starke KI hat mindestens eine Datenmenge von 150 Punkte.</p>

      <div className="flex flex-row w-full mt-8 gap-8 max-w-[1000px] items-center">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Datensätze</h2>
          <div className="flex flex-col gap-2">
            {datasets.map((dataset) => (
              <DatasetItem key={dataset.name} dataset={dataset} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-8 w-[385px] pt-8">
          <StatsDisplay />
          <Button className="w-fit ml-auto" onClick={handleCreateAIClick} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            KI Erstellen
          </Button>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{kiResult?.title}</DialogTitle>
            <DialogDescription className="pt-4 whitespace-pre-wrap">
              {kiResult?.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => router.push('/use')}>Weiter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
