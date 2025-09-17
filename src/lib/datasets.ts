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
        name: 'Web-Crawl',
        color: { name: 'Grün', rgb: '34,139,34', ratio: 0 },
        description: 'Wikipedia, Blogs, News, Foren. Standardquelle fast aller Modelle (Common Crawl). Sehr groß, günstig, aber voller Bias und Fehler.',
        cost: 30,
        diversity: 40,
        bias: 150,
        points: 70
    },
    {
        name: 'Soziale Medien',
        color: { name: 'Lila', rgb: '153,50,204', ratio: 0 },
        description: 'Reddit, X (Twitter), Foren-Kommentare. Liefert Dialog- und Umgangssprache, aber toxisch, laut und bias-anfällig.',
        cost: 20,
        diversity: 30,
        bias: 120,
        points: 95
    },
    {
        name: 'Bücher & Weltliteratur',
        color: { name: 'Blau', rgb: '24,116,205', ratio: 0 },
        description: 'Öffentlich verfügbare und lizensierte Bücher. Hochwertige Texte für Stil und Argumentation, aber teuer wegen Copyright.',
        cost: 50,
        diversity: 35,
        bias: 60,
        points: 80
    },
    {
        name: 'Wissenschaftliche Literatur',
        color: { name: 'Rot', rgb: '205,0,0', ratio: 0 },
        description: 'ArXiv, PubMed, Open Access Publikationen. Hohe Qualität und Fachwissen, aber klein und schwer lizensierbar.',
        cost: 40,
        diversity: 25,
        bias: 30,
        points: 75
    },
    {
        name: 'Code & technische Dokumentation',
        color: { name: 'Orange', rgb: '255,140,0', ratio: 0 },
        description: 'GitHub, StackOverflow, technische Handbücher. Zentrale Quelle für Coding-Modelle, bringt aber Copyright- und Lizenzrisiken.',
        cost: 35,
        diversity: 20,
        bias: 40,
        points: 90
    },
    {
        name: 'Multilinguale Nachrichtenquellen',
        color: { name: 'Gelb', rgb: '255,215,0', ratio: 0 },
        description: 'Nachrichtenartikel aus verschiedenen Regionen und Sprachen. Wichtig für internationale Performance, aber aufwendiger und teurer.',
        cost: 60,
        diversity: 85,
        bias: 25,
        points: 70
    },
    {
        name: 'Proprietäre Unternehmensdaten',
        color: { name: 'Braun', rgb: '139,71,38', ratio: 0 },
        description: 'E-Mails, Support-Chats, Handbücher. Sehr wertvoll für Spezialisierung, aber teuer und mit Datenschutzrisiken verbunden.',
        cost: 80,
        diversity: 40,
        bias: 35,
        points: 50
    },
    {
        name: 'Synthetische Daten',
        color: { name: 'Grau', rgb: '128,128,128', ratio: 0 },
        description: 'KI-generiert, Self-Play, Reinforcement Learning. Günstig und steuerbar, aber Gefahr von „KI trainiert KI“-Schleifen.',
        cost: 10,
        diversity: 50,
        bias: 60,
        points: 85
    }
];