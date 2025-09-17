export type ModelColorPreset = {
  name: string;
  hex: string;
  ratio: number;
};

export type ModelDefaults = {
  points: number;
  pointsNote: string | null;
  structureDiameter: number;
  blur: number;
  colors: ModelColorPreset[];
};

export type TrainingInfo = {
  tokens: number | null;
  parameters: number | null;
  notes: string;
};

export type DiversityInfo = {
  score: number;
  rationale: string;
};

export type TransparencyInfo = {
  score: number;
  rationale: string;
};

export type SourcesBreakdown = {
  blue_classic_web: number;
  red_social: number;
  green_academic: number;
  yellow_proprietary: number;
  gray_synthetic: number;
};

export type EstimatedFlags = {
  training_tokens: boolean;
  training_parameters: boolean;
  diversity: boolean;
  sources: boolean;
  transparency: boolean;
};

export type ModelMetrics = {
  training: TrainingInfo;
  diversity: DiversityInfo;
  transparency: TransparencyInfo;
  sources: SourcesBreakdown;
  estimatedFlags: EstimatedFlags;
  insight: string | null;
};

export type ModelEntry = {
  id: string;
  name: string;
  releaseDate: string;
  description: string;
  defaults: ModelDefaults;
  metrics: ModelMetrics;
};

export type ProviderEntry = {
  id: string;
  name: string;
  summary: string;
  models: ModelEntry[];
};

type RawModelEntry = {
  provider: string;
  model: string;
  release_date: string;
  training: TrainingInfo;
  diversity: {
    score_0_100: number;
    rationale: string;
  };
  sources_breakdown_pct: SourcesBreakdown;
  transparency: {
    score_0_100: number;
    rationale: string;
  };
  estimated_flags: EstimatedFlags;
};

const SOURCE_COLOR_INFO: Record<keyof SourcesBreakdown, { name: string; hex: string }> = {
  blue_classic_web: { name: 'Klassisches Web', hex: '#1D4ED8' },
  red_social: { name: 'Soziale Medien', hex: '#DC2626' },
  green_academic: { name: 'Wissenschaft', hex: '#059669' },
  yellow_proprietary: { name: 'Proprietär', hex: '#F59E0B' },
  gray_synthetic: { name: 'Synthetisch', hex: '#6B7280' },
};

const PROVIDER_SUMMARIES: Record<string, string> = {
  OpenAI: 'US-Anbieter mit Fokus auf dialogstarke, multimodale Foundation-Modelle.',
  'Google DeepMind': 'Google AI-Forschung für skalierbare, multimodale Systeme und Recherche.',
  Google: 'Google Research mit Schwerpunkt auf skalierbaren Sprach- und Code-Modellen.',
  Anthropic: 'Sicherheitsorientiertes KI-Startup mit der Claude-Reihe für verlässliche Antworten.',
  Meta: 'Open-Source-orientierte Modelle mit Fokus auf Anpassbarkeit und große Communities.',
  xAI: 'Echtzeit- und Social-Daten getriebene Modelle mit Fokus auf multimodale Fähigkeiten.',
  'Aleph Alpha': 'Europäischer Anbieter mit Transparenzfokus und mehrsprachigen Sprachmodellen.',
};

const MIN_DIAMETER = 24;
const MAX_DIAMETER = 96;
const POINTS_MIN = 0;
const POINTS_MAX = 3000;
const LOG_TOKEN_MIN = 11.0;
const LOG_TOKEN_MAX = 14.06;
const POINTS_GAMMA = 1.0;
// Grobe Umrechnung, falls nur Parameterangaben vorliegen (≈20 Tokens pro Parameter im Sprachmodellmaßstab).
const PARAMETER_TO_TOKEN_FACTOR = 20;
const FALLBACK_POINTS = 1200;
const FALLBACK_NOTE = 'geschätzt';
const MAX_BLUR_SIGMA = 12;

const rawModelData: RawModelEntry[] = [
  {
    provider: 'OpenAI',
    model: 'GPT-2',
    release_date: '2019-11-05',
    training: {
      tokens: 1.0e10,
      parameters: 1.5e9,
      notes: 'WebText aus Reddit-Links; Korpus nicht veröffentlicht. Tokens geschätzt.',
    },
    diversity: {
      score_0_100: 40,
      rationale: 'Primär englisches klassisches Web; kaum Non-English. Geschätzte Werte.',
    },
    sources_breakdown_pct: {
      blue_classic_web: 90,
      red_social: 0,
      green_academic: 2,
      yellow_proprietary: 0,
      gray_synthetic: 8,
    },
    transparency: {
      score_0_100: 65,
      rationale: 'Methodik dokumentiert, Daten nicht veröffentlicht. Geschätzte Transparenz.',
    },
    estimated_flags: {
      training_tokens: true,
      training_parameters: false,
      diversity: true,
      sources: true,
      transparency: true,
    },
  },
  {
    provider: 'OpenAI',
    model: 'GPT-3',
    release_date: '2020-06-11',
    training: {
      tokens: 3.0e11,
      parameters: 1.75e11,
      notes: 'Paper mit Quellenanteilen (CommonCrawl/WebText/Books/Wikipedia).',
    },
    diversity: {
      score_0_100: 55,
      rationale: 'Breites klassisches Web, überwiegend Englisch; begrenzte Mehrsprachigkeit. Geschätzt.',
    },
    sources_breakdown_pct: {
      blue_classic_web: 85,
      red_social: 0,
      green_academic: 3,
      yellow_proprietary: 12,
      gray_synthetic: 0,
    },
    transparency: {
      score_0_100: 70,
      rationale: 'Detailierter Datenmix im Paper, Korpora nicht offen.',
    },
    estimated_flags: {
      training_tokens: false,
      training_parameters: false,
      diversity: true,
      sources: true,
      transparency: false,
    },
  },
  {
    provider: 'OpenAI',
    model: 'GPT-3.5',
    release_date: '2022-11-30',
    training: {
      tokens: 3.2e11,
      parameters: null,
      notes: 'Basis GPT-3 + RLHF/Instruktionsdaten. Tokens geschätzt (≈3.0–3.2e11); Parameter nicht offengelegt.',
    },
    diversity: {
      score_0_100: 58,
      rationale: 'Wie GPT-3 plus Instruktionsdaten; etwas breitere Domänen. Geschätzt.',
    },
    sources_breakdown_pct: {
      blue_classic_web: 77,
      red_social: 0,
      green_academic: 3,
      yellow_proprietary: 10,
      gray_synthetic: 10,
    },
    transparency: {
      score_0_100: 40,
      rationale: 'Prozess (RLHF) beschrieben, Datensätze nicht transparent. Geschätzt.',
    },
    estimated_flags: {
      training_tokens: true,
      training_parameters: true,
      diversity: true,
      sources: true,
      transparency: true,
    },
  },
  {
    provider: 'OpenAI',
    model: 'GPT-4',
    release_date: '2023-03-14',
    training: {
      tokens: 1.0e13,
      parameters: null,
      notes: 'Mindestens ≈1.0e13 Tokens laut Leaks; konkrete Größen nicht publiziert.',
    },
    diversity: {
      score_0_100: 75,
      rationale: 'Multimodal (Text/Bild), stärker mehrsprachig; breite Domänen. Geschätzt.',
    },
    sources_breakdown_pct: {
      blue_classic_web: 55,
      red_social: 5,
      green_academic: 5,
      yellow_proprietary: 10,
      gray_synthetic: 25,
    },
    transparency: {
      score_0_100: 20,
      rationale: 'Architektur/Datensätze weitgehend geheim. Geschätzte Transparenz.',
    },
    estimated_flags: {
      training_tokens: true,
      training_parameters: true,
      diversity: true,
      sources: true,
      transparency: true,
    },
  },
  {
    provider: 'OpenAI',
    model: 'GPT-5',
    release_date: '2025-07-08',
    training: {
      tokens: 1.14e14,
      parameters: null,
      notes: 'Geschätzt ≈1.14e14 Tokens (Multi-Modal). Konkrete Größen nicht publiziert.',
    },
    diversity: {
      score_0_100: 75,
      rationale: 'Multimodal (Text/Bild), stärker mehrsprachig; breite Domänen. Geschätzt.',
    },
    sources_breakdown_pct: {
      blue_classic_web: 55,
      red_social: 5,
      green_academic: 5,
      yellow_proprietary: 10,
      gray_synthetic: 25,
    },
    transparency: {
      score_0_100: 20,
      rationale: 'Architektur/Datensätze weitgehend geheim. Geschätzte Transparenz.',
    },
    estimated_flags: {
      training_tokens: true,
      training_parameters: true,
      diversity: true,
      sources: true,
      transparency: true,
    },
  },
  // {
  //   provider: 'OpenAI',
  //   model: 'GPT-4 Turbo',
  //   release_date: '2023-11-06',
  //   training: {
  //     tokens: 1.3e13,
  //     parameters: null,
  //     notes: 'Weiterentwicklung von GPT-4 mit mehr/neueren Daten. Geschätzt.',
  //   },
  //   diversity: {
  //     score_0_100: 76,
  //     rationale: 'Wie GPT-4, leicht erweiterte Abdeckung. Geschätzt.',
  //   },
  //   sources_breakdown_pct: {
  //     blue_classic_web: 52,
  //     red_social: 5,
  //     green_academic: 5,
  //     yellow_proprietary: 10,
  //     gray_synthetic: 28,
  //   },
  //   transparency: {
  //     score_0_100: 18,
  //     rationale: 'Wenig zusätzliche Offenlegung. Geschätzte Transparenz.',
  //   },
  //   estimated_flags: {
  //     training_tokens: true,
  //     training_parameters: true,
  //     diversity: true,
  //     sources: true,
  //     transparency: true,
  //   },
  // },
  // {
  //   provider: 'OpenAI',
  //   model: 'GPT-4o',
  //   release_date: '2024-05-13',
  //   training: {
  //     tokens: 1.5e13,
  //     parameters: null,
  //     notes: '„Omni“ (nativ multimodal). Umfang und Mix nicht öffentlich. Tokens geschätzt.',
  //   },
  //   diversity: {
  //     score_0_100: 85,
  //     rationale: 'Stark multimodal + mehrsprachig; viele Medientypen. Geschätzt.',
  //   },
  //   sources_breakdown_pct: {
  //     blue_classic_web: 45,
  //     red_social: 5,
  //     green_academic: 5,
  //     yellow_proprietary: 30,
  //     gray_synthetic: 15,
  //   },
  //   transparency: {
  //     score_0_100: 15,
  //     rationale: 'Sehr geringe Datentransparenz. Geschätzte Transparenz.',
  //   },
  //   estimated_flags: {
  //     training_tokens: true,
  //     training_parameters: true,
  //     diversity: true,
  //     sources: true,
  //     transparency: true,
  //   },
  // },
  // {
  //   provider: 'OpenAI',
  //   model: 'GPT-4o mini',
  //   release_date: '2024-07-18',
  //   training: {
  //     tokens: 5.0e12,
  //     parameters: null,
  //     notes: 'Kleineres, kostengünstiges Multimodal-Modell. Tokens geschätzt.',
  //   },
  //   diversity: {
  //     score_0_100: 82,
  //     rationale: 'Multimodal, breites Web + lizensierte Daten. Geschätzt.',
  //   },
  //   sources_breakdown_pct: {
  //     blue_classic_web: 48,
  //     red_social: 4,
  //     green_academic: 5,
  //     yellow_proprietary: 28,
  //     gray_synthetic: 15,
  //   },
  //   transparency: {
  //     score_0_100: 15,
  //     rationale: 'Keine detaillierten Offenlegungen. Geschätzte Transparenz.',
  //   },
  //   estimated_flags: {
  //     training_tokens: true,
  //     training_parameters: true,
  //     diversity: true,
  //     sources: true,
  //     transparency: true,
  //   },
  // },
  // {
  //   provider: 'Google DeepMind',
  //   model: 'Gopher (280B)',
  //   release_date: '2021-12-08',
  //   training: {
  //     tokens: 5.0e11,
  //     parameters: 2.8e11,
  //     notes: 'MassiveText (C4, Wikipedia, Bücher, Code). Tokens geschätzt (≈0.5T).',
  //   },
  //   diversity: {
  //     score_0_100: 48,
  //     rationale: 'Vorwiegend englisches klassisches Web + Bücher; limitierte Mehrsprachigkeit. Geschätzt.',
  //   },
  //   sources_breakdown_pct: {
  //     blue_classic_web: 80,
  //     red_social: 5,
  //     green_academic: 10,
  //     yellow_proprietary: 0,
  //     gray_synthetic: 5,
  //   },
  //   transparency: {
  //     score_0_100: 75,
  //     rationale: 'Paper & Pipeline beschrieben; keine vollständigen Domänenlisten. Geschätzt.',
  //   },
  //   estimated_flags: {
  //     training_tokens: true,
  //     training_parameters: false,
  //     diversity: true,
  //     sources: true,
  //     transparency: true,
  //   },
  // },
  // {
  //   provider: 'Google DeepMind',
  //   model: 'Chinchilla (70B)',
  //   release_date: '2022-03-29',
  //   training: {
  //     tokens: 1.4e12,
  //     parameters: 7.0e10,
  //     notes: 'Compute-optimale 1.4T Tokens (Paper).',
  //   },
  //   diversity: {
  //     score_0_100: 50,
  //     rationale: 'Ähnliche Quellen wie Gopher, primär Englisch. Geschätzt.',
  //   },
  //   sources_breakdown_pct: {
  //     blue_classic_web: 80,
  //     red_social: 2,
  //     green_academic: 8,
  //     yellow_proprietary: 0,
  //     gray_synthetic: 10,
  //   },
  //   transparency: {
  //     score_0_100: 75,
  //     rationale: 'Tokenzahl & Kategorien klar, keine vollständige Quellenliste. Geschätzt.',
  //   },
  //   estimated_flags: {
  //     training_tokens: false,
  //     training_parameters: false,
  //     diversity: true,
  //     sources: true,
  //     transparency: true,
  //   },
  // },
  // {
  //   provider: 'Google',
  //   model: 'LaMDA (137B)',
  //   release_date: '2021-08-01',
  //   training: {
  //     tokens: 2.81e12,
  //     parameters: 1.37e11,
  //     notes: 'Infiniset ≈1.56T Wörter ≈2.81T Tokens. Datum geschätzt (Sommer 2021).',
  //   },
  //   diversity: {
  //     score_0_100: 55,
  //     rationale: 'Dialog-fokussiert, >90% Englisch; begrenzte Multiling. Geschätzt.',
  //   },
  //   sources_breakdown_pct: {
  //     blue_classic_web: 70,
  //     red_social: 20,
  //     green_academic: 3,
  //     yellow_proprietary: 0,
  //     gray_synthetic: 7,
  //   },
  //   transparency: {
  //     score_0_100: 70,
  //     rationale: 'Paper mit Größen/Anteilen, Korpus selbst nicht offen. Geschätzt.',
  //   },
  //   estimated_flags: {
  //     training_tokens: false,
  //     training_parameters: false,
  //     diversity: true,
  //     sources: true,
  //     transparency: true,
  //   },
  // },
  {
    provider: 'Google',
    model: 'PaLM',
    release_date: '2022-04-04',
    training: {
      tokens: 7.8e11,
      parameters: 5.4e11,
      notes: 'Paper nennt ≈7.8e11 Tokens (780B). Prozentanteile: 50% Social, 27% Web, 13% Books, 4% Wiki, 5% Code, 1% News.',
    },
    diversity: {
      score_0_100: 62,
      rationale: 'Multilingual + Code; signifikanter Non-English-Anteil. Geschätzt.',
    },
    sources_breakdown_pct: {
      blue_classic_web: 33,
      red_social: 50,
      green_academic: 4,
      yellow_proprietary: 12,
      gray_synthetic: 1,
    },
    transparency: {
      score_0_100: 80,
      rationale: 'Sehr transparente Quellenanteile im Paper.',
    },
    estimated_flags: {
      training_tokens: false,
      training_parameters: false,
      diversity: true,
      sources: false,
      transparency: false,
    },
  },
  {
    provider: 'Google',
    model: 'PaLM 2',
    release_date: '2023-05-10',
    training: {
      tokens: 3.6e12,
      parameters: null,
      notes: 'Skalierung ggü. PaLM; Parameter nicht offen. Tokens geschätzt.',
    },
    diversity: {
      score_0_100: 70,
      rationale: 'Stark multilingual, mehr Code/Reasoning. Geschätzt.',
    },
    sources_breakdown_pct: {
      blue_classic_web: 40,
      red_social: 20,
      green_academic: 5,
      yellow_proprietary: 10,
      gray_synthetic: 25,
    },
    transparency: {
      score_0_100: 55,
      rationale: 'Technischer Report, aber ohne präzise Datenanteile. Geschätzt.',
    },
    estimated_flags: {
      training_tokens: true,
      training_parameters: true,
      diversity: true,
      sources: true,
      transparency: true,
    },
  },
  {
    provider: 'Google',
    model: 'Gemini 1.0 Pro',
    release_date: '2023-12-06',
    training: {
      tokens: 7.5e12,
      parameters: null,
      notes: 'Nativ multimodal (Text, Code, Bild/Audio). Tokens geschätzt (≈5.0e12–1.0e13).',
    },
    diversity: {
      score_0_100: 80,
      rationale: 'Sehr hohe Modalitäts- und Sprachbreite. Geschätzt.',
    },
    sources_breakdown_pct: {
      blue_classic_web: 40,
      red_social: 10,
      green_academic: 10,
      yellow_proprietary: 20,
      gray_synthetic: 20,
    },
    transparency: {
      score_0_100: 20,
      rationale: 'Keine detaillierten Datenspezifika.',
    },
    estimated_flags: {
      training_tokens: true,
      training_parameters: true,
      diversity: true,
      sources: true,
      transparency: false,
    },
  },
  {
    provider: 'Google',
    model: 'Gemini 1.5 Pro',
    release_date: '2024-05-14',
    training: {
      tokens: 1.1e13,
      parameters: null,
      notes: 'Längere Kontexte, multimodal; Tokens geschätzt (≈1.0e13–1.2e13).',
    },
    diversity: {
      score_0_100: 82,
      rationale: 'Erweiterte Multimodalität und Sprachen. Geschätzt.',
    },
    sources_breakdown_pct: {
      blue_classic_web: 38,
      red_social: 10,
      green_academic: 10,
      yellow_proprietary: 22,
      gray_synthetic: 20,
    },
    transparency: {
      score_0_100: 20,
      rationale: 'Wie Gemini 1.0, geringe Transparenz.',
    },
    estimated_flags: {
      training_tokens: true,
      training_parameters: true,
      diversity: true,
      sources: true,
      transparency: false,
    },
  },
  // {
  //   provider: 'Anthropic',
  //   model: 'Claude 1',
  //   release_date: '2023-03-14',
  //   training: {
  //     tokens: 8.5e11,
  //     parameters: null,
  //     notes: 'Größen nur teilweise bekannt (frühe Anthropic-Angaben). Tokens geschätzt.',
  //   },
  //   diversity: {
  //     score_0_100: 50,
  //     rationale: 'Primär Englisch, gemischtes Web + Dialog/Instruktionsdaten. Geschätzt.',
  //   },
  //   sources_breakdown_pct: {
  //     blue_classic_web: 75,
  //     red_social: 5,
  //     green_academic: 5,
  //     yellow_proprietary: 5,
  //     gray_synthetic: 10,
  //   },
  //   transparency: {
  //     score_0_100: 40,
  //     rationale: 'Hohe Ebene dokumentiert, ohne Datendetails. Geschätzt.',
  //   },
  //   estimated_flags: {
  //     training_tokens: true,
  //     training_parameters: true,
  //     diversity: true,
  //     sources: true,
  //     transparency: true,
  //   },
  // },
  // {
  //   provider: 'Anthropic',
  //   model: 'Claude Instant v1',
  //   release_date: '2023-05-15',
  //   training: {
  //     tokens: null,
  //     parameters: null,
  //     notes: 'Distill/kompakte Variante; keine Größenangaben.',
  //   },
  //   diversity: {
  //     score_0_100: 50,
  //     rationale: 'Abgeleitet von Claude 1 Korpus. Geschätzt.',
  //   },
  //   sources_breakdown_pct: {
  //     blue_classic_web: 75,
  //     red_social: 5,
  //     green_academic: 5,
  //     yellow_proprietary: 5,
  //     gray_synthetic: 10,
  //   },
  //   transparency: {
  //     score_0_100: 40,
  //     rationale: 'Wie Claude 1.',
  //   },
  //   estimated_flags: {
  //     training_tokens: true,
  //     training_parameters: true,
  //     diversity: true,
  //     sources: true,
  //     transparency: false,
  //   },
  // },
  {
    provider: 'Anthropic',
    model: 'Claude 2',
    release_date: '2023-07-11',
    training: {
      tokens: 3.0e12,
      parameters: 7.0e10,
      notes: 'Tokens geschätzt (≈1.0e12–5.0e12); Parametergröße ≈70B.',
    },
    diversity: {
      score_0_100: 55,
      rationale: 'Mehr Code + etwas mehr Nicht-Englisch als v1. Geschätzt.',
    },
    sources_breakdown_pct: {
      blue_classic_web: 70,
      red_social: 5,
      green_academic: 5,
      yellow_proprietary: 5,
      gray_synthetic: 15,
    },
    transparency: {
      score_0_100: 30,
      rationale: 'Geringe Detailoffenlegung.',
    },
    estimated_flags: {
      training_tokens: true,
      training_parameters: true,
      diversity: true,
      sources: true,
      transparency: false,
    },
  },
  // {
  //   provider: 'Anthropic',
  //   model: 'Claude 2.1',
  //   release_date: '2023-11-21',
  //   training: {
  //     tokens: null,
  //     parameters: null,
  //     notes: 'Inkrementelles Update; keine Größenangaben.',
  //   },
  //   diversity: {
  //     score_0_100: 56,
  //     rationale: 'Wie Claude 2, leicht erweitert. Geschätzt.',
  //   },
  //   sources_breakdown_pct: {
  //     blue_classic_web: 69,
  //     red_social: 5,
  //     green_academic: 6,
  //     yellow_proprietary: 5,
  //     gray_synthetic: 15,
  //   },
  //   transparency: {
  //     score_0_100: 30,
  //     rationale: 'Wie Claude 2.',
  //   },
  //   estimated_flags: {
  //     training_tokens: true,
  //     training_parameters: true,
  //     diversity: true,
  //     sources: true,
  //     transparency: false,
  //   },
  // },
  {
    provider: 'Anthropic',
    model: 'Claude 3 Opus',
    release_date: '2024-03-04',
    training: {
      tokens: 4.0e13,
      parameters: null,
      notes: 'Multimodal, neue Trainingspipeline. Tokens geschätzt ≈4.0e13.',
    },
    diversity: {
      score_0_100: 75,
      rationale: 'Multimodal + stärker mehrsprachig; mehr Code. Geschätzt.',
    },
    sources_breakdown_pct: {
      blue_classic_web: 55,
      red_social: 5,
      green_academic: 10,
      yellow_proprietary: 10,
      gray_synthetic: 20,
    },
    transparency: {
      score_0_100: 35,
      rationale: 'Modellkarte vorhanden, Datenmix unklar. Geschätzt.',
    },
    estimated_flags: {
      training_tokens: true,
      training_parameters: true,
      diversity: true,
      sources: true,
      transparency: true,
    },
  },
  // {
  //   provider: 'Anthropic',
  //   model: 'Claude 3.5 Sonnet',
  //   release_date: '2024-06-20',
  //   training: {
  //     tokens: null,
  //     parameters: null,
  //     notes: 'Verbesserte Reasoning/Code; keine Datendetails.',
  //   },
  //   diversity: {
  //     score_0_100: 80,
  //     rationale: 'Breitere Multimodalität/Sprachen ggü. 3.x. Geschätzt.',
  //   },
  //   sources_breakdown_pct: {
  //     blue_classic_web: 52,
  //     red_social: 6,
  //     green_academic: 10,
  //     yellow_proprietary: 12,
  //     gray_synthetic: 20,
  //   },
  //   transparency: {
  //     score_0_100: 35,
  //     rationale: 'Ähnliche Transparenz wie 3.x.',
  //   },
  //   estimated_flags: {
  //     training_tokens: true,
  //     training_parameters: true,
  //     diversity: true,
  //     sources: true,
  //     transparency: false,
  //   },
  // },
  // {
  //   provider: 'Meta',
  //   model: 'OPT-175B',
  //   release_date: '2022-05-03',
  //   training: {
  //     tokens: 1.8e11,
  //     parameters: 1.75e11,
  //     notes: 'Offene Gewichte/Logbook; Quellenkatalog dokumentiert.',
  //   },
  //   diversity: {
  //     score_0_100: 55,
  //     rationale: 'Gemischtes Web/Books/Reddit; vorwiegend Englisch. Geschätzt.',
  //   },
  //   sources_breakdown_pct: {
  //     blue_classic_web: 70,
  //     red_social: 15,
  //     green_academic: 5,
  //     yellow_proprietary: 5,
  //     gray_synthetic: 5,
  //   },
  //   transparency: {
  //     score_0_100: 80,
  //     rationale: 'Hohe Transparenz (Model Card, Trainingslog).',
  //   },
  //   estimated_flags: {
  //     training_tokens: false,
  //     training_parameters: false,
  //     diversity: true,
  //     sources: true,
  //     transparency: false,
  //   },
  // },
  // {
  //   provider: 'Meta',
  //   model: 'Galactica (120B)',
  //   release_date: '2022-11-15',
  //   training: {
  //     tokens: 1.06e11,
  //     parameters: 1.2e11,
  //     notes: 'Wissenschafts-Korpus (Papers, Bücher, Enzyklopädien) im Paper beschrieben.',
  //   },
  //   diversity: {
  //     score_0_100: 45,
  //     rationale: 'Stark domänenspezifisch (wissenschaftlich), überwiegend Englisch.',
  //   },
  //   sources_breakdown_pct: {
  //     blue_classic_web: 10,
  //     red_social: 0,
  //     green_academic: 80,
  //     yellow_proprietary: 5,
  //     gray_synthetic: 5,
  //   },
  //   transparency: {
  //     score_0_100: 80,
  //     rationale: 'Ausführliches Paper/Korpusbeschreibung.',
  //   },
  //   estimated_flags: {
  //     training_tokens: false,
  //     training_parameters: false,
  //     diversity: false,
  //     sources: true,
  //     transparency: false,
  //   },
  // },
  // {
  //   provider: 'Meta',
  //   model: 'LLaMA 1 (65B)',
  //   release_date: '2023-02-24',
  //   training: {
  //     tokens: 1.0e12,
  //     parameters: 6.5e10,
  //     notes: 'Multiling. Web/Wiki/Books/Code; Tokens geschätzt.',
  //   },
  //   diversity: {
  //     score_0_100: 58,
  //     rationale: 'Top-20 Sprachen, aber mehrheitlich Englisch. Geschätzt.',
  //   },
  //   sources_breakdown_pct: {
  //     blue_classic_web: 75,
  //     red_social: 5,
  //     green_academic: 5,
  //     yellow_proprietary: 3,
  //     gray_synthetic: 12,
  //   },
  //   transparency: {
  //     score_0_100: 70,
  //     rationale: 'Paper mit Kategorien/Tokenzahlen, keine vollständige Liste. Geschätzt.',
  //   },
  //   estimated_flags: {
  //     training_tokens: true,
  //     training_parameters: false,
  //     diversity: true,
  //     sources: true,
  //     transparency: true,
  //   },
  // },
  {
    provider: 'Meta',
    model: 'LLaMA 2',
    release_date: '2023-07-18',
    training: {
      tokens: 2.0e12,
      parameters: 7.0e10,
      notes: 'Erweitertes Korpus, mehr Code und Non-English.',
    },
    diversity: {
      score_0_100: 60,
      rationale: 'Mehrsprachiger/mehr Code als LLaMA1. Geschätzt.',
    },
    sources_breakdown_pct: {
      blue_classic_web: 70,
      red_social: 5,
      green_academic: 5,
      yellow_proprietary: 5,
      gray_synthetic: 15,
    },
    transparency: {
      score_0_100: 70,
      rationale: 'Detaillierte Model Card, offene Gewichte.',
    },
    estimated_flags: {
      training_tokens: false,
      training_parameters: false,
      diversity: true,
      sources: true,
      transparency: false,
    },
  },
  {
    provider: 'Meta',
    model: 'LLaMA 3',
    release_date: '2024-04-18',
    training: {
      tokens: 1.5e13,
      parameters: 8.0e9,
      notes: 'Sehr großes Tokenvolumen über Sprachen/Code. Tokens geschätzt.',
    },
    diversity: {
      score_0_100: 65,
      rationale: '30 Sprachen + 4× mehr Code ggü. LLaMA2. Geschätzt.',
    },
    sources_breakdown_pct: {
      blue_classic_web: 68,
      red_social: 4,
      green_academic: 6,
      yellow_proprietary: 2,
      gray_synthetic: 20,
    },
    transparency: {
      score_0_100: 65,
      rationale: 'Zahlen/Tokenizer offen, genaue Datenanteile begrenzt. Geschätzt.',
    },
    estimated_flags: {
      training_tokens: true,
      training_parameters: false,
      diversity: true,
      sources: true,
      transparency: true,
    },
  },
  {
    provider: 'Meta',
    model: 'LLaMA 3',
    release_date: '2024-04-18',
    training: {
      tokens: 1.5e13,
      parameters: 8.0e10,
      notes: 'Tokenvolumen gem. Ankündigungen; genaue Verteilung unklar. Geschätzt.',
    },
    diversity: {
      score_0_100: 68,
      rationale: '30 Sprachen, starker Code-Anteil. Geschätzt.',
    },
    sources_breakdown_pct: {
      blue_classic_web: 66,
      red_social: 4,
      green_academic: 6,
      yellow_proprietary: 3,
      gray_synthetic: 21,
    },
    transparency: {
      score_0_100: 65,
      rationale: 'Ähnlich 8B; Paper/volle Aufstellung noch knapp. Geschätzt.',
    },
    estimated_flags: {
      training_tokens: true,
      training_parameters: true,
      diversity: true,
      sources: true,
      transparency: true,
    },
  },
  {
    provider: 'xAI',
    model: 'Grok-1',
    release_date: '2023-11-04',
    training: {
      tokens: null,
      parameters: null,
      notes: 'Großer Webkorpus + X/Twitter Firehose/Realtime. Keine Größenangaben.',
    },
    diversity: {
      score_0_100: 57,
      rationale: 'Web + Social-Realtime; primär Englisch. Geschätzt.',
    },
    sources_breakdown_pct: {
      blue_classic_web: 35,
      red_social: 50,
      green_academic: 2,
      yellow_proprietary: 5,
      gray_synthetic: 8,
    },
    transparency: {
      score_0_100: 20,
      rationale: 'Keine technischen Berichte/Model Card.',
    },
    estimated_flags: {
      training_tokens: true,
      training_parameters: true,
      diversity: true,
      sources: true,
      transparency: false,
    },
  },
  // {
  //   provider: 'xAI',
  //   model: 'Grok-1.5',
  //   release_date: '2024-03-28',
  //   training: {
  //     tokens: null,
  //     parameters: null,
  //     notes: 'Upgrade mit längeren Kontexten; weiter Social/Web. Keine Größenangaben.',
  //   },
  //   diversity: {
  //     score_0_100: 60,
  //     rationale: 'Erweiterte Abdeckung ggü. v1; Social bleibt prägend. Geschätzt.',
  //   },
  //   sources_breakdown_pct: {
  //     blue_classic_web: 36,
  //     red_social: 48,
  //     green_academic: 3,
  //     yellow_proprietary: 5,
  //     gray_synthetic: 8,
  //   },
  //   transparency: {
  //     score_0_100: 20,
  //     rationale: 'Wie Grok-1.',
  //   },
  //   estimated_flags: {
  //     training_tokens: true,
  //     training_parameters: true,
  //     diversity: true,
  //     sources: true,
  //     transparency: false,
  //   },
  // },
  // {
  //   provider: 'xAI',
  //   model: 'Grok-1.5V',
  //   release_date: '2024-04-12',
  //   training: {
  //     tokens: null,
  //     parameters: null,
  //     notes: 'Vision-fähiges Update; multimodale Datenquellen angenommen. Keine Größenangaben.',
  //   },
  //   diversity: {
  //     score_0_100: 70,
  //     rationale: 'Multimodal (Text+Bild) + Social-Streams. Geschätzt.',
  //   },
  //   sources_breakdown_pct: {
  //     blue_classic_web: 34,
  //     red_social: 48,
  //     green_academic: 3,
  //     yellow_proprietary: 7,
  //     gray_synthetic: 8,
  //   },
  //   transparency: {
  //     score_0_100: 18,
  //     rationale: 'Sehr geringe Transparenz.',
  //   },
  //   estimated_flags: {
  //     training_tokens: true,
  //     training_parameters: true,
  //     diversity: true,
  //     sources: true,
  //     transparency: true,
  //   },
  // },
  // {
  //   provider: 'Aleph Alpha',
  //   model: 'Luminous Base (13B)',
  //   release_date: '2021-11-15',
  //   training: {
  //     tokens: 4.0e11,
  //     parameters: 1.3e10,
  //     notes: '5 Sprachen (EN/DE/FR/IT/ES); europäisch kuratiert. Tokens geschätzt.',
  //   },
  //   diversity: {
  //     score_0_100: 60,
  //     rationale: 'Mehrsprachig (5 Kernsprachen), westlich geprägt. Geschätzt.',
  //   },
  //   sources_breakdown_pct: {
  //     blue_classic_web: 60,
  //     red_social: 3,
  //     green_academic: 12,
  //     yellow_proprietary: 5,
  //     gray_synthetic: 20,
  //   },
  //   transparency: {
  //     score_0_100: 70,
  //     rationale: 'Transparenzberichte (Sprachen/Tokenumfänge) vorhanden. Geschätzt.',
  //   },
  //   estimated_flags: {
  //     training_tokens: true,
  //     training_parameters: false,
  //     diversity: true,
  //     sources: true,
  //     transparency: true,
  //   },
  // },
  // {
  //   provider: 'Aleph Alpha',
  //   model: 'Luminous Extended (30B)',
  //   release_date: '2022-06-01',
  //   training: {
  //     tokens: 5.2e11,
  //     parameters: 3.0e10,
  //     notes: 'Erweiterter Korpus in 5 Sprachen. Tokens geschätzt.',
  //   },
  //   diversity: {
  //     score_0_100: 62,
  //     rationale: 'Wie Base, mehr Umfang/Domänen. Geschätzt.',
  //   },
  //   sources_breakdown_pct: {
  //     blue_classic_web: 60,
  //     red_social: 3,
  //     green_academic: 12,
  //     yellow_proprietary: 5,
  //     gray_synthetic: 20,
  //   },
  //   transparency: {
  //     score_0_100: 70,
  //     rationale: 'Wie Base.',
  //   },
  //   estimated_flags: {
  //     training_tokens: true,
  //     training_parameters: false,
  //     diversity: true,
  //     sources: true,
  //     transparency: false,
  //   },
  // },
  {
    provider: 'Aleph Alpha',
    model: 'Luminous Supreme',
    release_date: '2023-01-15',
    training: {
      tokens: 5.88e11,
      parameters: 7.0e10,
      notes: 'Benchmark/Blog nennt ≈588B Tokens (5 Sprachen).',
    },
    diversity: {
      score_0_100: 60,
      rationale: '5 Kernsprachen, mehrere Domänen inkl. Tech/Business. Geschätzt.',
    },
    sources_breakdown_pct: {
      blue_classic_web: 60,
      red_social: 3,
      green_academic: 12,
      yellow_proprietary: 5,
      gray_synthetic: 20,
    },
    transparency: {
      score_0_100: 70,
      rationale: 'Relativ transparent (Token/Langumfang), keine volle Quellenliste. Geschätzt.',
    },
    estimated_flags: {
      training_tokens: false,
      training_parameters: false,
      diversity: true,
      sources: true,
      transparency: true,
    },
  },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const mapTokensToPoints = (tokens: number | null) => {
  if (!tokens || tokens <= 0) return null;

  const logValue = Math.log10(tokens);
  const normalized = (logValue - LOG_TOKEN_MIN) / (LOG_TOKEN_MAX - LOG_TOKEN_MIN);
  const clamped = clamp(normalized, 0, 1);
  const curved = Math.pow(clamped, POINTS_GAMMA);
  const scaled = POINTS_MIN + (POINTS_MAX - POINTS_MIN) * curved;

  return Math.round(clamp(scaled, POINTS_MIN, POINTS_MAX));
};

const calculatePoints = (training: TrainingInfo) => {
  const tokenPoints = mapTokensToPoints(training.tokens);
  if (tokenPoints !== null) {
    return { points: tokenPoints, note: null };
  }

  const parameterBasedTokens =
    typeof training.parameters === 'number' && training.parameters > 0
      ? training.parameters * PARAMETER_TO_TOKEN_FACTOR
      : null;

  const parameterPoints = mapTokensToPoints(parameterBasedTokens);
  if (parameterPoints !== null) {
    return { points: parameterPoints, note: FALLBACK_NOTE };
  }

  return { points: FALLBACK_POINTS, note: FALLBACK_NOTE };
};

const mapDiversityToDiameter = (score: number) => {
  const normalized = clamp(score, 0, 100) / 100;
  const diameter = MIN_DIAMETER + normalized * (MAX_DIAMETER - MIN_DIAMETER);
  return Math.round(diameter);
};

const mapTransparencyToBlur = (score: number) => {
  const inverted = 100 - clamp(score, 0, 100);
  const blur = (inverted / 100) * MAX_BLUR_SIGMA;
  return Math.round(blur * 100) / 100;
};

const buildColorPresets = (sources: SourcesBreakdown): ModelColorPreset[] => {
  const entries = Object.entries(sources) as [keyof SourcesBreakdown, number][];
  const colors = entries
    .filter(([, ratio]) => ratio > 0)
    .map(([key, ratio]) => {
      const info = SOURCE_COLOR_INFO[key];
      return {
        name: info.name,
        hex: info.hex,
        ratio,
      };
    });

  if (colors.length === 0) {
    return [
      {
        name: 'Unbekannt',
        hex: '#334155',
        ratio: 100,
      },
    ];
  }

  return colors;
};

const createInsight = (sources: SourcesBreakdown): string | null => {
  const entries = Object.entries(sources) as [keyof SourcesBreakdown, number][];
  const [topKey, topValue] = entries.reduce<[keyof SourcesBreakdown | null, number]>(
    (acc, [key, value]) => {
      if (value > acc[1]) {
        return [key, value];
      }
      return acc;
    },
    [null, 0]
  );

  if (!topKey || topValue <= 0) return null;
  return `Höchster Anteil: ${SOURCE_COLOR_INFO[topKey].name} (${topValue}%).`;
};

const createDescription = (entry: RawModelEntry) => {
  const primary = entry.diversity.rationale.trim();
  const secondary = entry.training.notes.trim();
  const sentences = [primary, secondary].filter(Boolean);
  return sentences
    .map((sentence) => (sentence.endsWith('.') ? sentence : `${sentence}.`))
    .join(' ');
};

const providerMap = new Map<string, ProviderEntry>();

for (const raw of rawModelData) {
  const providerId = slugify(raw.provider);
  if (!providerMap.has(providerId)) {
    providerMap.set(providerId, {
      id: providerId,
      name: raw.provider,
      summary: PROVIDER_SUMMARIES[raw.provider] ?? 'Modellangebot ohne hinterlegte Zusammenfassung.',
      models: [],
    });
  }

  const providerEntry = providerMap.get(providerId);
  if (!providerEntry) continue;

  const calculated = calculatePoints(raw.training);

  providerEntry.models.push({
    id: slugify(raw.model),
    name: raw.model,
    releaseDate: raw.release_date,
    description: createDescription(raw),
    defaults: {
      points: calculated.points,
      pointsNote: calculated.note,
      structureDiameter: mapDiversityToDiameter(raw.diversity.score_0_100),
      blur: mapTransparencyToBlur(raw.transparency.score_0_100),
      colors: buildColorPresets(raw.sources_breakdown_pct),
    },
    metrics: {
      training: raw.training,
      diversity: {
        score: raw.diversity.score_0_100,
        rationale: raw.diversity.rationale,
      },
      transparency: {
        score: raw.transparency.score_0_100,
        rationale: raw.transparency.rationale,
      },
      sources: raw.sources_breakdown_pct,
      estimatedFlags: raw.estimated_flags,
      insight: createInsight(raw.sources_breakdown_pct),
    },
  });
}

export const modelCatalog: ProviderEntry[] = Array.from(providerMap.values())
  .map((provider) => ({
    ...provider,
    models: provider.models.sort((a, b) => (a.releaseDate < b.releaseDate ? 1 : -1)),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
