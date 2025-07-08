'use client';

const competenceMapping: Record<string, string> = {
    'Business E-Mails': 'ein Verständnis für formelle Geschäftskommunikation und Unternehmensjargon',
    'Wissenschaftliche Texte': 'ein tiefes Verständnis für komplexe wissenschaftliche und technische Themen',
    'Weltliteratur': 'Kreativität und die Fähigkeit, literarische und erzählerische Texte zu verfassen',
    'Multilingual News': 'ein breites Wissen über aktuelle Ereignisse und globale Zusammenhänge aus verschiedenen Perspektiven',
    'Soziale Medien': 'ein gutes Gespür für informelle Sprache, Trends und virale Inhalte',
    'Foren': 'die Fähigkeit, an technischen Diskussionen teilzunehmen und komplexe Probleme zu analysieren',
    'Community Voices': 'ein tiefes Verständnis für die Perspektiven und Erfahrungen marginalisierter Gruppen',
    'Indigene Spracharchive': 'ein einzigartiges Wissen über seltene Sprachen und indigene Kulturen',
    'Copyrightgeschützte Inhalte': 'ein breites Allgemeinwissen aus populären Medien, dessen Nutzung jedoch rechtliche Risiken birgt',
};

export const getCompetenceDescription = (selectedDatasets: Set<string>): string => {
    const competences = Array.from(selectedDatasets)
        .map((dataset) => competenceMapping[dataset])
        .filter(Boolean);

    if (competences.length === 0) {
        return 'Aufgrund der begrenzten Datenauswahl hat die KI noch keine spezifischen Kompetenzen entwickelt.';
    }

    if (competences.length === 1) {
        return `Durch das Training mit ausgewählten Datensätzen hat sie ${competences[0]} entwickelt.`;
    }

    const lastCompetence = competences.pop();
    return `Durch das Training hat sie vielfältige Kompetenzen entwickelt, darunter ${competences.join(', ')} und ${lastCompetence}.`;
};
