export const costLimit = 150;

export interface Dataset {
    name: string;
    description: string;
    cost: number;
    diversity: number;
    points: number;
}

export const datasets: Dataset[] = [
    {
        name: 'Business E-Mails',
        description: 'Formelle Korrespondenz aus internationalen Unternehmen. Stark strukturiert, aber meist einseitig westlich und männlich dominiert.',
        cost: 40,
        diversity: 25,
        points: 65
    },
    {
        name: 'Wissenschaftliche Texte',
        description: 'Akademische Publikationen mit hoher sprachlicher Präzision, jedoch oft elitär, westlich geprägt und wenig divers in Perspektiven.',
        cost: 35,
        diversity: 30,
        points: 70
    },
    {
        name: 'Weltliteratur',
        description: 'Klassische Literatur aus verschiedenen Epochen. Literarisch wertvoll, aber häufig eurozentrisch und nicht inklusiv.',
        cost: 10,
        diversity: 20,
        points: 50
    },
    {
        name: 'Multilingual News',
        description: 'Nachrichtenartikel aus verschiedenen Regionen und Sprachen. Breite Perspektiven, jedoch redaktionell gefiltert.',
        cost: 50,
        diversity: 70,
        points: 60
    },
    {
        name: 'Soziale Medien',
        description: 'Kurze, ungefilterte Posts aus Plattformen wie Twitter oder TikTok. Große Datenmenge, aber oft voller toxischer Sprache und Bias.',
        cost: 15,
        diversity: 45,
        points: 90
    },
    {
        name: 'Foren',
        description: 'Diskussionen aus Online-Foren wie Reddit oder StackExchange. Hohe Meinungsvielfalt, aber oft wenig moderiert und polarisierend.',
        cost: 20,
        diversity: 40,
        points: 85
    },
    {
        name: 'Community Voices',
        description: 'Interviews, Blogs und Erzählungen marginalisierter Gruppen. Sehr vielfältig und wertvoll, aber schwer auffindbar und teuer zu kuratieren.',
        cost: 80,
        diversity: 90,
        points: 35
    },
    {
        name: 'Indigene Spracharchive',
        description: 'Seltene Texte und Audioquellen in indigenen Sprachen. Extrem divers, aber sensibel, schwer zugänglich und ethisch anspruchsvoll.',
        cost: 90,
        diversity: 95,
        points: 20
    },
    {
        name: 'Copyrightgeschützte Inhalte',
        description: 'Kommerzielle Bücher, Filme oder Songs unter Urheberrecht. Einfach zu verwenden – solange man Rechte ignoriert.',
        cost: 70,
        diversity: 35,
        points: 75
    }
];
