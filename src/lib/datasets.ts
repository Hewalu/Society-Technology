import { ParticleColor } from '@/context/UserContext';

export const costLimit = 150;

export interface Dataset {
    name: string;
    color: ParticleColor;
    description: string;
    cost: number;
    diversity: number;
    bias: number;
    points: number;
}

export const datasets: Dataset[] = [
    {
        name: 'Business E-Mails',
        color: { name: 'Grün', rgb: '34,139,34', ratio: 0 },
        description: 'Formelle Korrespondenz aus internationalen Unternehmen. Stark strukturiert, aber meist einseitig westlich und männlich dominiert.',
        cost: 40,
        diversity: 5,
        bias: 200,
        points: 65
    },
    {
        name: 'Wissenschaftliche Texte',
        color: { name: 'Rot', rgb: '205,0,0', ratio: 0  },
        description: 'Akademische Publikationen mit hoher sprachlicher Präzision, jedoch oft elitär, westlich geprägt und wenig divers in Perspektiven.',
        cost: 35,
        diversity: 15,
        bias: 50,
        points: 80
    },
    {
        name: 'Weltliteratur',
        color: { name: 'Blau', rgb: '24,116,205', ratio: 0  },
        description: 'Klassische Literatur aus verschiedenen Epochen. Literarisch wertvoll, aber häufig eurozentrisch und nicht inklusiv.',
        cost: 10,
        diversity: 20,
        bias: 150,
        points: 60
    },
    {
        name: 'Multilingual News',
        color: { name: 'Gelb', rgb: '255,215,0', ratio: 0  },
        description: 'Nachrichtenartikel aus verschiedenen Regionen und Sprachen. Breite Perspektiven, jedoch redaktionell gefiltert.',
        cost: 50,
        diversity: 80,
        bias: 20,
        points: 60
    },
    {
        name: 'Soziale Medien',
        color: { name: 'Lila', rgb: '153,50,204', ratio: 0  },
        description: 'Kurze, ungefilterte Posts aus Plattformen wie Twitter oder TikTok. Große Datenmenge, aber oft voller toxischer Sprache und Bias.',
        cost: 15,
        diversity: 20,
        bias: 90,
        points: 110
    },
    {
        name: 'Foren',
        color: { name: 'Pink', rgb: '255,52,179', ratio: 0  },
        description: 'Diskussionen aus Online-Foren wie Reddit oder StackExchange. Hohe Meinungsvielfalt, aber oft wenig moderiert und polarisierend.',
        cost: 20,
        diversity: 20,
        bias: 100,
        points: 85
    },
    {
        name: 'Community Voices',
        color: { name: 'Schwarz', rgb: '0,0,0', ratio: 0  },
        description: 'Interviews, Blogs und Erzählungen marginalisierter Gruppen. Sehr vielfältig und wertvoll, aber schwer auffindbar und teuer zu kuratieren.',
        cost: 70,
        diversity: 100,
        bias: 10,
        points: 35
    },
    {
        name: 'Indigene Spracharchive',
        color: { name: 'Orange', rgb: '255,127,0', ratio: 0  },
        description: 'Seltene Texte und Audioquellen in indigenen Sprachen. Extrem divers, aber sensibel, schwer zugänglich und ethisch anspruchsvoll.',
        cost: 90,
        diversity: 95,
        bias: 5,
        points: 20
    },
    {
        name: 'Copyrightgeschützte Inhalte',
        color: { name: 'Braun', rgb: '139,71,38', ratio: 0  },
        description: 'Kommerzielle Bücher, Filme oder Songs unter Urheberrecht. Einfach zu verwenden – solange man Rechte ignoriert.',
        cost: 20,
        diversity: 35,
        bias: 20,
        points: 75
    }
];
