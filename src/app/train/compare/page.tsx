'use client';

import { useMemo, useState, useEffect, type ChangeEvent } from 'react';
import Link from 'next/link';
import ParticleCanvas from '@/components/ParticleCanvas';
import { Button } from '@/components/ui/button';
import {
  modelCatalog,
  ProviderEntry,
  ModelEntry,
  ModelColorPreset,
} from '@/lib/model-catalog';
import { ChevronLeft, RotateCcw, PanelRightClose, PanelRightOpen } from 'lucide-react';

const hexToRgbString = (hex: string) => {
  let parsed = hex.replace('#', '');
  if (parsed.length === 3) {
    parsed = parsed
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const intVal = parseInt(parsed, 16);
  const r = (intVal >> 16) & 255;
  const g = (intVal >> 8) & 255;
  const b = intVal & 255;
  return `${r},${g},${b}`;
};

const DEFAULT_PROVIDER = modelCatalog[0];
const DEFAULT_MODEL = modelCatalog[0].models[0];

const MIN_DIAMETER = 24;
const MAX_DIAMETER = 96;

export default function CompareModelsPage() {
  const [providerId, setProviderId] = useState(DEFAULT_PROVIDER.id);
  const [modelId, setModelId] = useState(DEFAULT_MODEL.id);
  const [points, setPoints] = useState(DEFAULT_MODEL.defaults.points);
  const [structureDiameter, setStructureDiameter] = useState(
    DEFAULT_MODEL.defaults.structureDiameter
  );
  const [colorConfig, setColorConfig] = useState<ModelColorPreset[]>(() =>
    DEFAULT_MODEL.defaults.colors.map((preset) => ({ ...preset }))
  );
  const [showControls, setShowControls] = useState(true);
  const [canvasShift, setCanvasShift] = useState(0);

  const provider: ProviderEntry = useMemo(() => {
    return modelCatalog.find((entry) => entry.id === providerId) ?? DEFAULT_PROVIDER;
  }, [providerId]);

  const model: ModelEntry = useMemo(() => {
    return provider.models.find((entry) => entry.id === modelId) ?? provider.models[0];
  }, [provider, modelId]);

  useEffect(() => {
    if (!provider.models.some((entry) => entry.id === modelId)) {
      setModelId(provider.models[0]?.id ?? DEFAULT_MODEL.id);
    }
  }, [provider, modelId]);

  useEffect(() => {
    if (!model) return;
    setPoints(model.defaults.points);
    setStructureDiameter(model.defaults.structureDiameter);
    setColorConfig(model.defaults.colors.map((preset) => ({ ...preset })));
  }, [model]);

  useEffect(() => {
    const updateShift = () => {
      const { innerWidth: width } = window;

      if (!showControls || width < 768) {
        setCanvasShift(0);
        return;
      }

      const maxPanelWidth = width >= 1280 ? 460 : 420;
      const panelWidth = Math.min(width * 0.42, maxPanelWidth);
      const safetyMargin = width >= 1280 ? 120 : 80;
      const availableShift = Math.max(0, width / 2 - safetyMargin);
      const shiftMagnitude = Math.min(panelWidth / 2 + 28, availableShift);

      setCanvasShift(-shiftMagnitude);
    };

    updateShift();
    window.addEventListener('resize', updateShift);

    return () => {
      window.removeEventListener('resize', updateShift);
    };
  }, [showControls]);

  const colors = useMemo(
    () =>
      colorConfig.map((preset) => ({
        name: preset.name,
        ratio: preset.ratio,
        rgb: hexToRgbString(preset.hex),
      })),
    [colorConfig]
  );

  const colorEntropyDiversity = useMemo(() => {
    const total = colorConfig.reduce((sum, entry) => sum + Math.max(entry.ratio, 0), 0);
    if (!total) {
      return 10;
    }
    const normalized = colorConfig
      .map((entry) => (entry.ratio <= 0 ? 0 : entry.ratio / total))
      .filter((value) => value > 0);
    if (!normalized.length) {
      return 10;
    }
    const entropy = -normalized.reduce((sum, value) => sum + value * Math.log(value), 0);
    const maxEntropy = Math.log(normalized.length);
    return Math.round(((entropy / maxEntropy) || 0) * 100);
  }, [colorConfig]);

  const datasetDiversity = model.metrics.diversity.score;
  const diversity = useMemo(() => {
    if (!datasetDiversity) return colorEntropyDiversity;
    return Math.round((datasetDiversity + colorEntropyDiversity) / 2);
  }, [datasetDiversity, colorEntropyDiversity]);

  const spread = useMemo(() => {
    const baselineDiameter = (MIN_DIAMETER + MAX_DIAMETER) / 2;
    return Math.max(0.2, structureDiameter / baselineDiameter);
  }, [structureDiameter]);

  const handleColorRatioChange = (index: number, ratio: number) => {
    setColorConfig((previous) =>
      previous.map((entry, i) => (i === index ? { ...entry, ratio } : entry))
    );
  };

  const handleColorHexChange = (index: number, hex: string) => {
    setColorConfig((previous) =>
      previous.map((entry, i) => (i === index ? { ...entry, hex } : entry))
    );
  };

  const handleProviderChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setProviderId(event.target.value);
  };

  const handleModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setModelId(event.target.value);
  };

  const resetToDefaults = () => {
    if (!model) return;
    setPoints(model.defaults.points);
    setStructureDiameter(model.defaults.structureDiameter);
    setColorConfig(model.defaults.colors.map((preset) => ({ ...preset })));
  };

  const formatReleaseDate = (isoDate: string) => {
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.valueOf())) return isoDate;
    return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(parsed);
  };

  const formatLargeNumber = (value: number | null, unit: 'tokens' | 'parameters') => {
    if (value === null) return 'n.v.';

    const thresholds = [
      { limit: 1e12, suffix: 'Bio.' },
      { limit: 1e9, suffix: 'Mrd.' },
      { limit: 1e6, suffix: 'Mio.' },
      { limit: 1e3, suffix: 'Tsd.' },
    ];

    const threshold = thresholds.find((entry) => Math.abs(value) >= entry.limit);
    if (!threshold) {
      return `${value.toLocaleString('de-DE')} ${unit === 'tokens' ? 'Tokens' : 'Parameter'}`;
    }

    const scaled = value / threshold.limit;
    const suffix = unit === 'tokens' ? `${threshold.suffix} Tokens` : `${threshold.suffix} Parameter`;
    return `${scaled.toFixed(2)} ${suffix}`;
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-10 md:px-12 text-slate-900 dark:text-slate-100">
      <ParticleCanvas
        points={points}
        diversity={diversity}
        colors={colors}
        spread={spread}
        blur={model.defaults.blur}
        horizontalShift={canvasShift}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setShowControls((prev) => !prev)}
        className="fixed right-6 top-24 z-40 h-11 w-11 rounded-full border border-white/60 dark:border-white/20 bg-white/70 dark:bg-slate-900/80 text-slate-800 dark:text-slate-100 shadow-[0_12px_40px_rgba(15,23,42,0.25)] backdrop-blur-2xl hover:bg-white/80 dark:hover:bg-slate-900/90"
        aria-label={showControls ? 'Chat-Bereich ausblenden' : 'Chat-Bereich einblenden'}
      >
        {showControls ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
      </Button>

      {showControls && (
        <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-6 md:w-[420px] md:gap-8 md:pl-6 md:pt-10 md:pb-16 md:ml-auto">
            <div className="flex items-center justify-between">
              <Button asChild variant="ghost" className="rounded-full border border-white/50 dark:border-white/20 bg-white/70 dark:bg-slate-900/80 backdrop-blur">
                <Link href="/train" className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <ChevronLeft className="h-4 w-4" />
                  Zurück zum Training
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetToDefaults}
                className="hidden items-center gap-2 border-white/80 dark:border-white/20 bg-white/70 dark:bg-slate-900/80 text-slate-800 dark:text-slate-100 backdrop-blur hover:bg-white/80 dark:hover:bg-slate-900 md:flex"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>

            <div className="space-y-5 rounded-3xl border border-white/50 dark:border-white/20 bg-white/70 dark:bg-slate-900/75 p-6 text-slate-800 dark:text-slate-100 shadow-[0_20px_70px_rgba(15,23,42,0.25)] backdrop-blur-xl">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-300">Modelle vergleichen</p>
                <h1 className="text-2xl font-semibold leading-tight text-slate-900 dark:text-slate-100">
                  {provider.name} · {model.name}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Veröffentlicht am {formatReleaseDate(model.releaseDate)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{model.description}</p>
              </div>

              <details className="group rounded-2xl border border-white/60 dark:border-white/20 bg-white/60 dark:bg-slate-900/70 p-4 backdrop-blur">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 dark:text-slate-100">
                  KI-Provider & Modell auswählen
                </summary>
                <div className="mt-4 space-y-4 text-sm">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Provider</span>
                    <select
                      value={providerId}
                      onChange={handleProviderChange}
                      className="h-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-slate-800 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      {modelCatalog.map((entry) => (
                        <option key={entry.id} value={entry.id}>
                          {entry.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Modell</span>
                    <select
                      value={modelId}
                      onChange={handleModelChange}
                      className="h-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-slate-800 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      {provider.models.map((entry) => (
                        <option key={entry.id} value={entry.id}>
                          {entry.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <p className="rounded-2xl bg-white/70 dark:bg-slate-900/70 p-3 text-xs text-slate-600 dark:text-slate-300">
                    {provider.summary}
                  </p>
                </div>
              </details>

              <details className="group rounded-2xl border border-white/60 dark:border-white/20 bg-white/60 dark:bg-slate-900/70 p-4 backdrop-blur">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Parameter justieren
                </summary>
                <div className="mt-4 space-y-5 text-sm">
                  <div>
                    <div className="flex items-center justify-between text-xs uppercase tracking-wider text-slate-500 dark:text-slate-300">
                      <span>Durchmesser</span>
                      <span>{structureDiameter} px</span>
                    </div>
                    <input
                      type="range"
                      min={MIN_DIAMETER}
                      max={MAX_DIAMETER}
                      step={2}
                      value={structureDiameter}
                      onChange={(event) => setStructureDiameter(Number(event.target.value))}
                      className="mt-2 w-full accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs uppercase tracking-wider text-slate-500 dark:text-slate-300">
                      <span>Punktanzahl</span>
                      <span>{points}</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={400}
                      step={10}
                      value={points}
                      onChange={(event) => setPoints(Number(event.target.value))}
                      className="mt-2 w-full accent-indigo-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-300">Farben & Prozente</p>
                    <div className="space-y-4">
                      {colorConfig.map((entry, index) => (
                        <div
                          key={`${entry.name}-${index}`}
                          className="rounded-2xl bg-white/70 dark:bg-slate-900/70 p-3 shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                              style={{ backgroundColor: entry.hex }}
                            >
                              {(index + 1).toString()}
                            </span>
                            <div className="flex flex-col gap-2 flex-1">
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={entry.hex}
                                  onChange={(event) => handleColorHexChange(index, event.target.value)}
                                  className="h-10 w-10 cursor-pointer rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900"
                                  aria-label={`Farbe ${index + 1}`}
                                />
                                <input
                                  type="text"
                                  value={entry.name}
                                  onChange={(event) =>
                                    setColorConfig((previous) =>
                                      previous.map((preset, i) =>
                                        i === index ? { ...preset, name: event.target.value } : preset
                                      )
                                    )
                                  }
                                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                  placeholder="Farbname"
                                />
                              </div>
                              <div>
                                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-300">
                                  <span>Verhältnis</span>
                                  <span>{entry.ratio}%</span>
                                </div>
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  step={1}
                                  value={entry.ratio}
                                  onChange={(event) =>
                                    handleColorRatioChange(index, Number(event.target.value))
                                  }
                                  className="mt-2 w-full accent-indigo-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </details>

              <details className="rounded-2xl bg-white/80 dark:bg-slate-900/70 p-4 text-xs text-slate-600 dark:text-slate-300">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-700 dark:text-slate-100">
                  Modellprofil
                </summary>
                <div className="mt-3 space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-100">Veröffentlichung</p>
                    <p>{formatReleaseDate(model.releaseDate)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-100">Training</p>
                    <ul className="ml-4 list-disc space-y-1 text-slate-600 dark:text-slate-300">
                      <li>Tokens: {formatLargeNumber(model.metrics.training.tokens, 'tokens')}</li>
                      <li>Parameter: {formatLargeNumber(model.metrics.training.parameters, 'parameters')}</li>
                      <li>{model.metrics.training.notes}</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-100">Diversität & Transparenz</p>
                    <ul className="ml-4 list-disc space-y-1 text-slate-600 dark:text-slate-300">
                      <li>Diversitäts-Score: {datasetDiversity} / 100 ({model.metrics.diversity.rationale})</li>
                      <li>Visuelle Entropie: {colorEntropyDiversity} / 100</li>
                      <li>Transparenz: {model.metrics.transparency.score} / 100 ({model.metrics.transparency.rationale})</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-100">Datenquellen</p>
                    <ul className="ml-4 list-disc space-y-1 text-slate-600 dark:text-slate-300">
                      {model.defaults.colors.map((color, index) => (
                        <li key={`${color.name}-${index}`}>
                          {color.name}: {color.ratio}%
                        </li>
                      ))}
                    </ul>
                  </div>
                  {model.metrics.insight ? (
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-100">Besonderheit</p>
                      <p>{model.metrics.insight}</p>
                    </div>
                  ) : null}
                </div>
              </details>

              <div className="rounded-2xl bg-white/80 dark:bg-slate-900/70 p-4 text-xs text-slate-600 dark:text-slate-300">
                <p>
                  Berechnete Vielfalt: <span className="font-semibold text-slate-700 dark:text-slate-100">{diversity}</span>
                </p>
                <p>
                  Gesamte Partikel: <span className="font-semibold text-slate-700 dark:text-slate-100">{points * 8}</span>
                </p>
                <p>
                  Blur σ: <span className="font-semibold text-slate-700 dark:text-slate-100">{model.defaults.blur.toFixed(2)}</span>
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={resetToDefaults}
                className="flex w-full items-center justify-center gap-2 border-white/80 dark:border-white/20 bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-100 backdrop-blur hover:bg-white dark:hover:bg-slate-900"
              >
                <RotateCcw className="h-4 w-4" />
                Modellwerte zurücksetzen
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
