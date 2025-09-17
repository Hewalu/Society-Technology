'use client';

import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemoMode } from '@/context/DemoModeContext';

export function DemoLauncherButton() {
  const { isActive, startDemo, stopDemo } = useDemoMode();

  const handleClick = () => {
    if (isActive) {
      stopDemo();
      return;
    }
    startDemo();
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant="ghost"
      className="hidden rounded-full border border-white/60 bg-white/70 px-5 py-2 text-sm font-semibold text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.35)] backdrop-blur-2xl transition hover:bg-white/80 dark:border-white/20 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-900 sm:inline-flex"
    >
      <Sparkles className="h-4 w-4" />
      {isActive ? 'Demo läuft' : 'Demo'}
    </Button>
  );
}
