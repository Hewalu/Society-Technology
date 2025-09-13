'use client';

import { ParticleColor } from '@/context/UserContext';
import { KiResult } from '@/context/UserContext';
import { getCompetenceDescription } from './competence';

const getTitle = (diversity: number, points: number, name: string): string => {
    if (diversity > 65) {
        return `${name} ist eine sehr diverse KI`;
    }
    if (diversity > 35) {
        return `${name} ist eine ausgewogene KI`;
    }
    if (points > 150) {
        return `${name} ist eine wirtschaftlich sehr starke KI`;
    }
    return `${name} ist noch am Anfang`;
};

const getCostDescription = (cost: number): string => {
    if (cost > 80) {
        return 'Die Entwicklung deiner KI war sehr kostspielig, was die wirtschaftliche Rentabilität zu einer Herausforderung macht.';
    }
    if (cost > 50) {
        return 'Deine KI wurde mit einem moderaten Budget entwickelt, was eine gute Balance zwischen Kosten und Leistung darstellt.';
    }
    return 'Deine KI wurde sehr kosteneffizient entwickelt, was ihr einen wirtschaftlichen Vorteil verschafft.';
};

const getBiasDescription = (bias: number): string => {
    if (bias > 60) {
        return 'Sie weist einen starken Bias auf. Die Daten stammen überwiegend aus westlichen, angloamerikanischen Kulturen, wodurch andere Perspektiven vernachlässigt und Stereotype wie Rassismus und patriarchale Strukturen verstärkt werden.';
    }
    if (bias > 30) {
        return 'Der Bias ist zwar vorhanden, aber vergleichsweise gering. Viele Antworten sind differenziert, auch wenn eine leichte Tendenz zu westlichen Werten erkennbar ist.';
    }
    return 'Dank einer vielfältigen Datengrundlage ist der Bias deiner KI erfreulich gering. Sie kann Anfragen aus verschiedenen kulturellen Kontexten fair und ausgewogen beantworten.';
};

const getDiversityDescription = (diversity: number): string => {
    if (diversity > 65) {
        return 'Sie wurde mit Daten aus aller Welt trainiert, was ihre Antworten kulturell reich und vielfältig macht.';
    }
    if (diversity > 35) {
        return 'Sie wurde mit Datensätzen aus verschiedenen Regionen trainiert, was zu relativ ausgewogenen Ergebnissen führt.';
    }
    return 'Die Datensätze für das Training waren wenig divers. Dadurch sind die Fähigkeiten der KI begrenzt und ihre Antworten spiegeln eine einseitige Perspektive wider.';
};

const getPointsDescription = (points: number): string => {
    if (points > 150) {
        return `Deine KI hat eine beeindruckende Stärke erreicht. Der hohe Wissenshintergrund macht sie im globalen Wettbewerb konkurrenzfähig.`;
    }
    if (points > 80) {
        return `Deine KI verfügt über eine solide Stärke und liefert verlässliche Ergebnisse.`;
    }
    return `Die Stärke deiner KI ist noch begrenzt. Es ist ein erster Schritt, aber es braucht mehr Daten, um ihr volles Potenzial zu entfalten.`;
};

export const getKiResult = (
    diversity: number,
    points: number,
    colors: ParticleColor[],
    bias: number,
    cost: number,
    name: string,
    selectedDatasets: Set<string>,
): KiResult => {
    const title = getTitle(diversity, points, name);
    const description = [
        getPointsDescription(points),
        getCompetenceDescription(selectedDatasets),
        getDiversityDescription(diversity),
        getBiasDescription(bias),
        getCostDescription(cost),
        //Hier auch Farben übergeben? Mal schauen wird wsl eh noch geändert...
    ].join(' \n\n');

    return {
        title,
        colors,
        description,
    };
};
