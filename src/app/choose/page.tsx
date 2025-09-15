'use client';

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { ControlDock } from '@/components/control-dock';
import React from 'react';
import ParticleCanvas from '@/components/ParticleCanvas';

export default function TrainPage() {
  const { name, colors, points, diversity, toggleIsDataChooseMode } = useUser();
  const router = useRouter();

  const handleReset = () => {
    router.push('/');
  };

  return (
    <main className="flex h-screen flex-col">
      <div className="relative flex min-h-0 flex-1">
        <div className="absolute inset-0">
          <ParticleCanvas points={points} diversity={diversity} colors={colors}/>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
          <ControlDock />
        </div>
      </div>
      <div className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2">
        <h1 className="text-center text-2xl font-semibold tracking-tight text-neutral-200">AI Model Explorer</h1>
      </div>
      <div className="pointer-events-none absolute right-4 top-4 text-xs text-neutral-400">
        <div>Shortcuts: G = Panel, Space = Pause/Play</div>
      </div>
    </main>
  );
}
