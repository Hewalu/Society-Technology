'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import ParticleCanvas from '@/components/ParticleCanvas';
import { useUser } from '@/context/UserContext';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getKiResult } from '@/lib/results';
import { KiResult } from '@/context/UserContext';

export default function UsePage() {
  const { name, points, diversity } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [kiResult, setKiResult] = useState<KiResult | null>(null);

  useEffect(() => {
    setKiResult(getKiResult(diversity, points, name));
  }, [diversity, points, name]);

  return (
    <main className="min-h-screen relative">
      <ParticleCanvas points={points} diversity={diversity} />
      <Button asChild className="absolute top-8 left-8">
        <Link href="/train">Neu Trainieren</Link>
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{kiResult?.title}</DialogTitle>
            <DialogDescription className="pt-4 whitespace-pre-wrap">
              {kiResult?.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Schließen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
