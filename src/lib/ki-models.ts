import { ParticleColor } from '@/context/UserContext';

export const costLimit = 150;

export interface KiModel {
    name: string;
    description: string;
    diversity: number;
    tokenAmount: number;
    company: string;
    blurPercent: number;
    sources: KiModelDataset[];
}

export interface KiModelDataset {
    name: string;
    color: ParticleColor;
    description: string;
}

export const colors: Record<string, string> = {
  red: "239,68,68", //#ef4444
  orange: "245,158,11", //#f59e0b
  yellow: "234,179,8", //#eab308
  green: "34,197,94", //#22c55e
  teal: "20,184,166", //#14b8a6
  blue: "59,130,246", //#3b82f6
  indigo: "99,102,241", //#6366f1
  purple: "168,85,247", //#a855f7
  pink: "236,72,153", //#ec4899
}

export const kiModels: KiModel[] = [
    // {
    //     name: 'ChatGPT o3',
    //     description: 'Erste öffentlicher Version von ChatGPT von der Firma OpenAI.',
    //     diversity: 5,
    //     tokenAmount: 30,
    //     // tokenAmount: 300000000000,
    //     blurPercent: 0.1,
    //     sources: [
    //         {
    //             name: 'Common Crawl',
    //             color: { name: 'Grün', rgb: '34,139,34', ratio: 0.6 },
    //             description: 'Gefilterte Version von Common Crawl',
    //         },            {
    //             name: 'WebText2',
    //             color: { name: 'Rot', rgb: '205,0,0', ratio: 0.22  },
    //             description: 'Zwei Webtexte',
    //         },            {
    //             name: 'Books1',
    //             color: { name: 'Blau', rgb: '24,116,205', ratio: 0.08  },
    //             description: 'Ein Buch',
    //         },            {
    //             name: 'Books2',
    //            color: { name: 'Gelb', rgb: '255,215,0', ratio: 0.08  },
    //             description: 'Zwei Buch',
    //         },            {
    //             name: 'Wikipedia',
    //             color: { name: 'Lila', rgb: '153,50,204', ratio: 0.03  },
    //             description: 'DIE Enzyklopädie',
    //         }
    //     ]
    // },
    // {
    //     name: 'ChatGPT o4',
    //     description: 'Weiterer öffentlicher Version von ChatGPT von der Firma OpenAI.',
    //     diversity: 9,
    //     tokenAmount: 100,
    //     // tokenAmount: 10000000000000,
    //     blurPercent: 0.15,
    //     sources: [
    //         {
    //             name: 'Common Crawl',
    //             color: { name: 'Grün', rgb: '34,139,34', ratio: 0.5 },
    //             description: 'Gefilterte Version von Common Crawl',
    //         },            {
    //             name: 'RLHF',
    //             color: { name: 'Rot', rgb: '205,0,0', ratio: 0.3  },
    //             description: 'Reinforcement Learning from Human Feedback',
    //         },            {
    //             name: 'Trainerdaten',
    //             color: { name: 'Blau', rgb: '24,116,205', ratio: 0.1  },
    //             description: 'Von Menschen erstellten Daten (z. B. menschliche Trainer/Labeler) ',
    //         },            {
    //             name: 'Lizenzierten Daten',
    //            color: { name: 'Gelb', rgb: '255,215,0', ratio: 0.1  },
    //             description: 'Sind lizensiert',
    //         }
    //     ]
    // },
    {
        name: 'GPT-3.5',
        company: 'OpenAI',
        description: 'Mixture of web + curated corpora',
        diversity: 110,
        tokenAmount: 120,
        blurPercent: 0.2,
        sources: [
            {
                name: 'Blue',
                color: { name: 'Blue', rgb: colors.blue, ratio: 0.5 },
                description: 'Anteil der Daten mit Fokus auf Blautöne',
            },
            {
                name: 'Teal',
                color: { name: 'Teal', rgb: colors.teal, ratio: 0.3 },
                description: 'Anteil der Daten mit Fokus auf Teal',
            },
            {
                name: 'Purple',
                color: { name: 'Purple', rgb: colors.purple, ratio: 0.2 },
                description: 'Anteil der Daten mit Fokus auf Lila',
            },
        ],
    },
    {
        name: 'GPT-4',
        company: 'OpenAI',
        description: 'Expanded licensed + web sources',
        diversity: 150,
        tokenAmount: 220,
        blurPercent: 0.3,
        sources: [
            {
                name: 'Indigo',
                color: { name: 'Indigo', rgb: colors.indigo, ratio: 0.5 },
                description: 'Anteil der Daten mit Indigo-Inhalten',
            },
            {
                name: 'Blue',
                color: { name: 'Blue', rgb: colors.blue, ratio: 0.3 },
                description: 'Anteil der Daten mit Blautönen',
            },
            {
                name: 'Purple',
                color: { name: 'Purple', rgb: colors.purple, ratio: 0.2 },
                description: 'Anteil der Daten mit Lila-Inhalten',
            },
        ],
    },
    {
        name: 'o3-mini',
        company: 'OpenAI',
        description: 'Smaller distilled mixture',
        diversity: 90,
        tokenAmount: 90,
        blurPercent: 0.18,
        sources: [
            {
                name: 'Teal',
                color: { name: 'Teal', rgb: colors.teal, ratio: 0.5 },
                description: 'Anteil der Daten mit Teal-Inhalten',
            },
            {
                name: 'Green',
                color: { name: 'Green', rgb: colors.green, ratio: 0.3 },
                description: 'Anteil der Daten mit Grün-Inhalten',
            },
            {
                name: 'Blue',
                color: { name: 'Blue', rgb: colors.blue, ratio: 0.2 },
                description: 'Anteil der Daten mit Blautönen',
            },
        ],
    },
    {
        name: 'Gemini 1.0 Pro',
        company: 'Google',
        description: 'Licensed + synthetic augmentation',
        diversity: 130,
        tokenAmount: 180,
        blurPercent: 0.22,
        sources: [
            {
                name: 'Green',
                color: { name: 'Green', rgb: colors.green, ratio: 0.45 },
                description: 'Anteil der Daten mit Grün-Inhalten',
            },
            {
                name: 'Teal',
                color: { name: 'Teal', rgb: colors.teal, ratio: 0.35 },
                description: 'Anteil der Daten mit Teal-Inhalten',
            },
            {
                name: 'Blue',
                color: { name: 'Blue', rgb: colors.blue, ratio: 0.2 },
                description: 'Anteil der Daten mit Blautönen',
            },
        ],
    },
    {
        name: 'Gemini 1.5 Pro',
        company: 'Google',
        description: 'Large-scale multimodal dataset',
        diversity: 170,
        tokenAmount: 260,
        blurPercent: 0.28,
        sources: [
            {
                name: 'Green',
                color: { name: 'Green', rgb: colors.green, ratio: 0.35 },
                description: 'Anteil der Daten mit Grün-Inhalten',
            },
            {
                name: 'Yellow',
                color: { name: 'Yellow', rgb: colors.yellow, ratio: 0.25 },
                description: 'Anteil der Daten mit Gelb-Inhalten',
            },
            {
                name: 'Teal',
                color: { name: 'Teal', rgb: colors.teal, ratio: 0.4 },
                description: 'Anteil der Daten mit Teal-Inhalten',
            },
        ],
    },
    {
        name: 'Gemini Nano',
        company: 'Google',
        description: 'On-device tuned subset',
        diversity: 85,
        tokenAmount: 70,
        blurPercent: 0.12,
        sources: [
            {
                name: 'Yellow',
                color: { name: 'Yellow', rgb: colors.yellow, ratio: 0.35 },
                description: 'Anteil der Daten mit Gelb-Inhalten',
            },
            {
                name: 'Orange',
                color: { name: 'Orange', rgb: colors.orange, ratio: 0.4 },
                description: 'Anteil der Daten mit Orange-Inhalten',
            },
            {
                name: 'Red',
                color: { name: 'Red', rgb: colors.red, ratio: 0.25 },
                description: 'Anteil der Daten mit Rot-Inhalten',
            },
        ],
    },
    {
        name: 'Llama 2 7B',
        company: 'Meta',
        description: 'Open datasets + annotations',
        diversity: 125,
        tokenAmount: 160,
        blurPercent: 0.2,
        sources: [
            {
                name: 'Purple',
                color: { name: 'Purple', rgb: colors.purple, ratio: 0.4 },
                description: 'Anteil der Daten mit Lila-Inhalten',
            },
            {
                name: 'Pink',
                color: { name: 'Pink', rgb: colors.pink, ratio: 0.3 },
                description: 'Anteil der Daten mit Pink-Inhalten',
            },
            {
                name: 'Blue',
                color: { name: 'Blue', rgb: colors.blue, ratio: 0.3 },
                description: 'Anteil der Daten mit Blautönen',
            },
        ],
    },
    {
        name: 'Llama 3 8B',
        company: 'Meta',
        description: 'Open + licensed blends',
        diversity: 155,
        tokenAmount: 200,
        blurPercent: 0.24,
        sources: [
            {
                name: 'Purple',
                color: { name: 'Purple', rgb: colors.purple, ratio: 0.3 },
                description: 'Anteil der Daten mit Lila-Inhalten',
            },
            {
                name: 'Indigo',
                color: { name: 'Indigo', rgb: colors.indigo, ratio: 0.45 },
                description: 'Anteil der Daten mit Indigo-Inhalten',
            },
            {
                name: 'Pink',
                color: { name: 'Pink', rgb: colors.pink, ratio: 0.25 },
                description: 'Anteil der Daten mit Pink-Inhalten',
            },
        ],
    },
    {
        name: 'Llama 3 70B',
        company: 'Meta',
        description: 'Large-scale open + licensed',
        diversity: 180,
        tokenAmount: 300,
        blurPercent: 0.32,
        sources: [
            {
                name: 'Indigo',
                color: { name: 'Indigo', rgb: colors.indigo, ratio: 0.5 },
                description: 'Anteil der Daten mit Indigo-Inhalten',
            },
            {
                name: 'Blue',
                color: { name: 'Blue', rgb: colors.blue, ratio: 0.25 },
                description: 'Anteil der Daten mit Blautönen',
            },
            {
                name: 'Purple',
                color: { name: 'Purple', rgb: colors.purple, ratio: 0.25 },
                description: 'Anteil der Daten mit Lila-Inhalten',
            },
        ],
    },
];
