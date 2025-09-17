'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === 'dark';

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <Button
      type="button"
      variant="outline"
      size={showLabel ? 'default' : 'icon'}
      onClick={handleToggle}
      className={cn(
        'rounded-full border-white/60 bg-white/70 text-slate-800 shadow-[0_12px_40px_rgba(15,23,42,0.25)] backdrop-blur-2xl hover:bg-white/80 dark:border-white/20 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-900/90',
        showLabel ? 'h-11 gap-2 px-4' : 'h-11 w-11',
        className
      )}
      aria-label={isDark ? 'Wechsel zu hellem Modus' : 'Wechsel zu dunklem Modus'}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      {showLabel && (
        <span className="text-sm font-medium">
          {isDark ? 'Hell' : 'Dunkel'}
        </span>
      )}
    </Button>
  );
}
