'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import ParticleCanvas from '@/components/ParticleCanvas';
import { useUser } from '@/context/UserContext';
import React, { useEffect, useState } from 'react';
import { getKiResult } from '@/lib/results';
import { KiResult } from '@/context/UserContext';

export default function UsePage() {
  const { name, points, diversity, bias, cost, selectedDatasets } = useUser();
  const [kiResult, setKiResult] = useState<KiResult | null>(null);

  useEffect(() => {
    setKiResult(getKiResult(diversity, points, bias, cost, name, selectedDatasets));
  }, [diversity, points, bias, cost, name, selectedDatasets]);

  return (
    <main className="min-h-screen flex items-center justify-center p-24">
      <div className="w-1/3">
        <ParticleCanvas points={points} diversity={diversity} />
      </div>
      <div className="flex justify-center flex-col">
        <div className="bg-gray-100 p-8 rounded-lg max-w-[600px] shadow-lg">
          <h1 className="text-xl leading-none font-semibold">{kiResult?.title}</h1>
          <p className="text-muted-foreground text-md my-4 whitespace-pre-wrap">
            {kiResult?.description}
          </p>
          <Button asChild className="w-full mt-4">
            <Link href="/train">Neu Trainieren</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
