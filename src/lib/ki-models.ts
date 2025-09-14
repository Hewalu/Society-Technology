import { ParticleColor } from '@/context/UserContext';

export const costLimit = 150;

export interface KiModel {
    name: string;
    description: string;
    diversity: number;
    tokenAmount: number;
    sources: KiModelDataset[];
}

export interface KiModelDataset {
    name: string;
    color: ParticleColor;
    description: string;
}

export const kiModels: KiModel[] = [
    {
        name: 'ChatGPT o3',
        description: 'Erste öffentlicher Version von ChatGPT von der Firma OpenAI.',
        diversity: 5,
        tokenAmount: 30,
        // tokenAmount: 300000000000,
        sources: [
            {
                name: 'Common Crawl',
                color: { name: 'Grün', rgb: '34,139,34', ratio: 0.6 },
                description: 'Gefilterte Version von Common Crawl',
            },            {
                name: 'WebText2',
                color: { name: 'Rot', rgb: '205,0,0', ratio: 0.22  },
                description: 'Zwei Webtexte',
            },            {
                name: 'Books1',
                color: { name: 'Blau', rgb: '24,116,205', ratio: 0.08  },
                description: 'Ein Buch',
            },            {
                name: 'Books2',
               color: { name: 'Gelb', rgb: '255,215,0', ratio: 0.08  },
                description: 'Zwei Buch',
            },            {
                name: 'Wikipedia',
                color: { name: 'Lila', rgb: '153,50,204', ratio: 0.03  },
                description: 'DIE Enzyklopädie',
            }
        ]
    },
    {
        name: 'ChatGPT o4',
        description: 'Weiterer öffentlicher Version von ChatGPT von der Firma OpenAI.',
        diversity: 9,
        tokenAmount: 100,
        // tokenAmount: 10000000000000,
        sources: [
            {
                name: 'Common Crawl',
                color: { name: 'Grün', rgb: '34,139,34', ratio: 0.5 },
                description: 'Gefilterte Version von Common Crawl',
            },            {
                name: 'RLHF',
                color: { name: 'Rot', rgb: '205,0,0', ratio: 0.3  },
                description: 'Reinforcement Learning from Human Feedback',
            },            {
                name: 'Trainerdaten',
                color: { name: 'Blau', rgb: '24,116,205', ratio: 0.1  },
                description: 'Von Menschen erstellten Daten (z. B. menschliche Trainer/Labeler) ',
            },            {
                name: 'Lizenzierten Daten',
               color: { name: 'Gelb', rgb: '255,215,0', ratio: 0.1  },
                description: 'Sind lizensiert',
            }
        ]
    }
];
