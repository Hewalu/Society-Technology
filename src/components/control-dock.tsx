'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'
import {
  ChevronUp,
  ChevronsUpDown,
  Gauge,
  Settings2,
  SlidersHorizontal,
} from 'lucide-react'

import { kiModels } from '@/lib/ki-models' // <-- KI-Modelle importieren
import { useUser } from '@/context/UserContext'

// Hilfskomponenten
function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-neutral-300">
        <span>{label}</span>
        <span>{Math.round(value * 100)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white/40"
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[9rem,1fr] items-center gap-2 text-sm">
      <div className="text-neutral-300">{label}</div>
      <div>{children}</div>
    </div>
  )
}

// Hauptkomponente
export const ControlDock: React.FC = () => {
  const { selectKiModel } = useUser() // <-- Funktion aus UserContext
  const [dockOpen, setDockOpen] = useState(true)
  const [debugOpen, setDebugOpen] = useState(false)

  // Lokale States für Provider und Model
  const [selectedProvider, setSelectedProvider] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState<string>('')

  // Provider Liste aus kiModels ableiten
  const providers = Array.from(new Set(kiModels.map((m) => m.company))).map((company) => ({
    id: company,
    label: company,
  }))

  // Modelle des aktuell gewählten Providers
  const models = kiModels
    .filter((m) => m.company === selectedProvider)
    .map((m) => ({ id: m.name, label: m.name }))

  // Aktuell gewähltes Modell
  const currentModel = kiModels.find(
    (m) => m.company === selectedProvider && m.name === selectedModel
  )

  return (
    <div className="pointer-events-auto">
      <div className="mx-auto w-full max-w-3xl px-3 pb-3">
        <div
          className={`glass mx-auto w-full overflow-hidden rounded-2xl transition-all duration-300 ${
            dockOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-90'
          }`}
        >
          {/* Kopfbereich */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-neutral-200">
              <Gauge className="h-4 w-4" />
              <span>Modelle</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => setDebugOpen((v) => !v)}>
                <SlidersHorizontal className="h-4 w-4" /> Debug
              </Button>
              <Button size="sm" variant="outline" onClick={() => setDockOpen((v) => !v)}>
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Inhalt */}
          <div
            className={`grid grid-cols-1 gap-4 px-4 pb-4 md:grid-cols-2 ${
              dockOpen ? '' : 'hidden'
            }`}
          >
            {/* Linke Seite */}
            <div className="space-y-3">
              <Field label="KI-Provider">
                <ProviderSelect
                  value={selectedProvider}
                  onValueChange={(v) => {
                    setSelectedProvider(v)
                    setSelectedModel('')
                  }}
                  options={providers}
                />
              </Field>
              <Field label="Modell">
                <ModelSelect
                  value={selectedModel}
                  onValueChange={(id) => {
                    setSelectedModel(id)    // Lokalen State aktualisieren
                    selectKiModel(id)       // <-- Context-Funktion aufrufen
                  }}
                  options={models}
                />
              </Field>

              {/* Kennzahlen */}
              {currentModel && (
                <div className="space-y-2 rounded-xl border border-white/10 p-3">
                  <div className="text-xs uppercase tracking-wide text-neutral-400">
                    Kennzahlen
                  </div>
                  <Meter label="Diversity" value={currentModel.diversity / 200} />
                  <Meter label="Training Data Scale" value={currentModel.tokenAmount / 300} />
                  <Meter label="Transparency" value={currentModel.blurPercent} />
                  <div className="text-xs text-neutral-300">{currentModel.description}</div>
                </div>
              )}
            </div>

            {/* Rechte Seite */}
            <div className={`space-y-3 ${debugOpen ? '' : 'opacity-60'}`}>
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <Settings2 className="h-4 w-4" /> Live-Regler
              </div>

              {/* Slider nur visuell ohne Funktion */}
              <Slider label="Punkte" min={20} max={800} step={1} value={100} onChange={() => {}} />
              <Slider label="Radius" min={40} max={260} step={1} value={150} onChange={() => {}} />
              <Slider label="Blur (%)" min={0} max={1} step={0.01} value={0.2} onChange={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Provider Auswahl
function ProviderSelect({
  value,
  onValueChange,
  options,
}: {
  value: string
  onValueChange: (v: string) => void
  options: { id: string; label: string }[]
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.id === value)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between">
          {selected?.label ?? 'Provider wählen'}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Suchen..." />
          <CommandList>
            <CommandEmpty>Kein Ergebnis</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem key={o.id} onSelect={() => (onValueChange(o.id), setOpen(false))}>
                  {o.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Modell Auswahl
function ModelSelect({
  value,
  onValueChange,
  options,
}: {
  value: string
  onValueChange: (v: string) => void
  options: { id: string; label: string }[]
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.id === value)

  const handleSelect = (id: string) => {
    onValueChange(id)  // Callback aus Hauptkomponente
    setOpen(false)     // Popover schließen
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between">
          {selected?.label ?? 'Modell wählen'}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Suchen..." />
          <CommandList>
            <CommandEmpty>Kein Ergebnis</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem key={o.id} onSelect={() => handleSelect(o.id)}>
                  {o.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Slider ohne Funktionalität
function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string
  min: number
  max: number
  step?: number
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="grid grid-cols-[9rem,1fr] items-center gap-2 text-sm">
      <div className="text-neutral-300">{label}</div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-white"
          min={min}
          max={max}
          step={step ?? 1}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          readOnly
        />
        <div className="w-16 text-right tabular-nums text-neutral-300">
          {step && step < 1 ? value.toFixed(2) : Math.round(value)}
        </div>
      </div>
    </div>
  )
}
