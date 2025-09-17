'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ParticleCanvas from '@/components/ParticleCanvas';
import { Button } from '@/components/ui/button';
import { useDemoMode } from '@/context/DemoModeContext';
import type { ParticleColor } from '@/context/UserContext';
import { modelCatalog, type ModelColorPreset } from '@/lib/model-catalog';
import { X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const PROVIDER_SEQUENCE = ['aleph-alpha', 'anthropic', 'google', 'meta', 'openai', 'xai'];
const MIN_DIAMETER = 24;
const MAX_DIAMETER = 96;
const BASELINE_DIAMETER = (MIN_DIAMETER + MAX_DIAMETER) / 2;

const hexToRgbString = (hex: string) => {
  let parsed = hex.replace('#', '');
  if (parsed.length === 3) {
    parsed = parsed
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const intValue = parseInt(parsed, 16);
  const r = (intValue >> 16) & 255;
  const g = (intValue >> 8) & 255;
  const b = intValue & 255;
  return `${r},${g},${b}`;
};

type DemoEntry = {
  id: string;
  providerName: string;
  modelName: string;
  points: number;
  diversity: number;
  blur: number;
  spread: number;
  colors: ParticleColor[];
};

const computeColorEntropyScore = (presets: ModelColorPreset[]) => {
  const total = presets.reduce((sum, entry) => sum + Math.max(entry.ratio, 0), 0);
  if (!total) {
    return 10;
  }

  const normalized = presets
    .map((entry) => (entry.ratio <= 0 ? 0 : entry.ratio / total))
    .filter((value) => value > 0);
  if (!normalized.length) {
    return 10;
  }

  const entropy = -normalized.reduce((sum, value) => sum + value * Math.log(value), 0);
  const maxEntropy = Math.log(normalized.length);
  return Math.round(((entropy / maxEntropy) || 0) * 100);
};

export function DemoOverlay() {
  const { isActive, stopDemo } = useDemoMode();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [convergence, setConvergence] = useState(1);
  const [progress, setProgress] = useState(0);
  const convergenceValueRef = useRef(convergence);
  const convergenceAnimationRef = useRef<number>();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  useEffect(() => {
    convergenceValueRef.current = convergence;
  }, [convergence]);

  useEffect(() => {
    return () => {
      if (convergenceAnimationRef.current) {
        cancelAnimationFrame(convergenceAnimationRef.current);
      }
    };
  }, []);

  const animateConvergence = useCallback(
    (target: number, duration = 800) => {
      const clampedTarget = Math.min(Math.max(target, 0), 1);

      if (convergenceAnimationRef.current) {
        cancelAnimationFrame(convergenceAnimationRef.current);
      }

      const startTime = performance.now();
      const initial = convergenceValueRef.current;

      const easeInOut = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progressRatio = duration === 0 ? 1 : Math.min(Math.max(elapsed / duration, 0), 1);
        const eased = easeInOut(progressRatio);
        const nextValue = initial + (clampedTarget - initial) * eased;
        convergenceValueRef.current = nextValue;
        setConvergence(nextValue);

        if (progressRatio < 1) {
          convergenceAnimationRef.current = requestAnimationFrame(step);
        } else {
          convergenceValueRef.current = clampedTarget;
          setConvergence(clampedTarget);
        }
      };

      convergenceAnimationRef.current = requestAnimationFrame(step);
    },
    []
  );

  const entries = useMemo<DemoEntry[]>(() => {
    const preferredOrder = new Map<string, number>();
    PROVIDER_SEQUENCE.forEach((id, index) => preferredOrder.set(id, index));

    const sortedProviders = [...modelCatalog]
      .filter((provider) => preferredOrder.has(provider.id))
      .sort((a, b) => (preferredOrder.get(a.id)! - preferredOrder.get(b.id)!));

    return sortedProviders.flatMap((provider) =>
      [...provider.models]
        .sort((a, b) => (a.defaults.points ?? 0) - (b.defaults.points ?? 0))
        .map((model) => ({
          id: `${provider.id}-${model.id}`,
          providerName: provider.name,
          modelName: model.name,
          points: model.defaults.points,
        diversity: (() => {
          const datasetScore = model.metrics.diversity.score;
          const colorEntropy = computeColorEntropyScore(model.defaults.colors);
          if (!datasetScore) return colorEntropy;
          return Math.round((datasetScore + colorEntropy) / 2);
        })(),
        blur: model.defaults.blur,
        spread: Math.max(0.2, model.defaults.structureDiameter / BASELINE_DIAMETER),
        colors: model.defaults.colors.map((preset) => ({
          name: preset.name,
          rgb: hexToRgbString(preset.hex),
          ratio: preset.ratio,
        })),
        }))
    );
  }, []);

  const currentEntry = entries[currentIndex];

  useEffect(() => {
    if (!isActive || !entries.length) {
      return;
    }

    setCurrentIndex(0);
    animateConvergence(0.02, 500);

    const expandTimeout = window.setTimeout(() => {
      animateConvergence(1, 1000);
    }, 400);

    return () => {
      window.clearTimeout(expandTimeout);
    };
  }, [isActive, entries.length, animateConvergence]);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        stopDemo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, stopDemo]);

  useEffect(() => {
    if (!isActive) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !entries.length) {
      return;
    }

    setProgress(0);

    const startTime = performance.now();
    const duration = 20000;

    const tick = () => {
      const elapsed = performance.now() - startTime;
      const normalized = Math.min(1, Math.max(0, elapsed / duration));
      setProgress(normalized);
    };

    tick();
    const intervalId = window.setInterval(tick, 100);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isActive, currentIndex, entries.length]);

  useEffect(() => {
    if (!isActive || !entries.length) return;

    animateConvergence(0.02, 500);
    const expandTimeout = window.setTimeout(() => animateConvergence(1, 1100), 350);

    const collapseTimeout = window.setTimeout(() => animateConvergence(0.02, 800), 18000);
    const advanceTimeout = window.setTimeout(() => {
      setCurrentIndex((previous) => (previous + 1) % entries.length);
    }, 20000);

    return () => {
      window.clearTimeout(expandTimeout);
      window.clearTimeout(collapseTimeout);
      window.clearTimeout(advanceTimeout);
    };
  }, [animateConvergence, isActive, currentIndex, entries.length]);

  if (!isActive || !entries.length || !currentEntry) {
    return null;
  }

  const closeButtonClass = cn(
    'pointer-events-auto h-9 w-9 rounded-full border text-white shadow-[0_20px_70px_rgba(15,23,42,0.45)] backdrop-blur-2xl transition-colors',
    isDarkMode
      ? 'border-white/35 bg-white/20 hover:bg-white/30'
      : 'border-slate-900/25 bg-slate-900/15 text-slate-900 hover:bg-slate-900/25'
  );

  const progressTrackClass = cn(
    'flex h-1 w-56 overflow-hidden rounded-full transition-colors',
    isDarkMode ? 'bg-white/30' : 'bg-slate-900/20'
  );

  const progressFillClass = cn(
    'h-full w-full origin-left rounded-full transition-transform duration-150 ease-linear',
    isDarkMode ? 'bg-white/80' : 'bg-slate-900/75'
  );

  const providerTextClass = cn(
    'text-[11px] uppercase tracking-[0.4em] font-medium transition-colors',
    isDarkMode ? 'text-white/55' : 'text-slate-600/80'
  );

  const modelTextClass = cn(
    'text-sm font-semibold tracking-wide transition-colors',
    isDarkMode ? 'text-white/85' : 'text-slate-900'
  );

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden">
      <ParticleCanvas
        points={currentEntry.points}
        diversity={currentEntry.diversity}
        colors={currentEntry.colors}
        spread={currentEntry.spread}
        blur={currentEntry.blur}
        convergence={convergence}
      />
      <div className="absolute left-0 right-0 top-0 flex items-start justify-end p-6">
        <Button
          type="button"
          onClick={stopDemo}
          size="icon"
          variant="ghost"
          className={closeButtonClass}
          aria-label="Demo-Modus verlassen"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="pointer-events-none absolute bottom-16 left-0 right-0 flex flex-col items-center gap-3 px-6">
        <div className={progressTrackClass}>
          <div
            className={progressFillClass}
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
        <div className="text-center">
          <p className={providerTextClass}>{currentEntry.providerName}</p>
          <p className={modelTextClass}>{currentEntry.modelName}</p>
        </div>
      </div>
    </div>
  );
}
