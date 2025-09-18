'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import ParticleCanvas from '@/components/ParticleCanvas';
import { useUser } from '@/context/UserContext';
import React, { useEffect, useState } from 'react';
import { getKiResult } from '@/lib/results';
import { KiResult } from '@/context/UserContext';
import { MessageCircle, X } from 'lucide-react';

export default function UsePage() {
  const { name, colors, points, diversity, bias, cost, selectedDatasets } = useUser(); //Darf da Colors erin?
  const [kiResult, setKiResult] = useState<KiResult | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [canvasShift, setCanvasShift] = useState(0);
  const particlePoints = points * 5;

  //Beispielwerte für Farbschemata
  // const colorsList = [
  //   { name: 'Rot', rgb: '255,0,0', ratio: 0.9 },
  //   { name: 'Grün', rgb: '0,255,0', ratio: 0.05 },
  //   { name: 'Blau', rgb: '0,0,255', ratio: 0.05 },
  // ]


  useEffect(() => {
    setKiResult(getKiResult(diversity, points, colors, bias, cost, name, selectedDatasets));
  }, [diversity, points, colors, bias, cost, name, selectedDatasets]);

  useEffect(() => {
    const updateShift = () => {
      if (!isChatOpen) {
        setCanvasShift(0);
        return;
      }

      const width = window.innerWidth;
      const chatWidth = Math.min(320, Math.max(0, width - 64));
      const availableShift = Math.max(0, width / 2 - 80);
      const shiftMagnitude = Math.min((chatWidth / 2) + 20, availableShift);

      setCanvasShift(-shiftMagnitude);
    };

    updateShift();
    window.addEventListener('resize', updateShift);

    return () => {
      window.removeEventListener('resize', updateShift);
    };
  }, [isChatOpen]);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-12 md:px-12 text-slate-900 dark:text-slate-100">
      <ParticleCanvas
        points={particlePoints}
        diversity={diversity}
        colors={colors}
        horizontalShift={canvasShift}
      />

      <div className="fixed bottom-8 right-8 z-20 flex flex-col items-end gap-4">
        <div
          className={`w-80 max-w-[calc(100vw-4rem)] rounded-3xl border border-white/50 dark:border-white/20 bg-white/50 dark:bg-slate-900/70 px-6 py-6 text-slate-800 dark:text-slate-100 shadow-[0_20px_80px_rgba(15,23,42,0.35)] backdrop-blur-2xl transition-all duration-300 ${
            isChatOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'pointer-events-none opacity-0 translate-y-4'
          }`}
        >
          <h1 className="text-lg font-semibold leading-tight text-slate-900 dark:text-slate-100">{kiResult?.title}</h1>
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{kiResult?.description}</p>
          <Button
            asChild
            variant="outline"
            className="mt-5 w-full border-white/50 dark:border-white/20 bg-white/60 dark:bg-slate-900/80 text-slate-800 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-slate-900"
          >
            <Link href="/train">Neu Trainieren</Link>
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleChat}
          className="h-14 w-14 rounded-full border border-white/60 dark:border-white/20 bg-white/70 dark:bg-slate-900/80 text-slate-800 dark:text-slate-100 shadow-[0_15px_40px_rgba(15,23,42,0.25)] backdrop-blur-2xl hover:bg-white/80 dark:hover:bg-slate-900"
          aria-label={isChatOpen ? 'Popup schließen' : 'Ergebnis anzeigen'}
        >
          {isChatOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        </Button>
      </div>
    </main>
  );
}
