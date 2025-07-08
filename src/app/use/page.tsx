'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import ParticleCanvas from '@/components/ParticleCanvas';
import { useUser } from '@/context/UserContext';

export default function UsePage() {
  const { points, diversity } = useUser();

  return (
    <main className="min-h-screen relative">
      <ParticleCanvas points={points} diversity={diversity} />
      <Button asChild className="absolute top-8 left-8">
        <Link href="/train">Neu Trainieren</Link>
      </Button>
    </main>
  );
}
