'use client';

import { KiResult } from '@/context/UserContext';

export const getKiResult = (
    diversity: number,
    points: number,
    bias: number,
    cost: number,
    name: string
): KiResult => {
    if (diversity > 65) {
        return {
            title: 'Du hast eine sehr diverse KI angelernt!',
            description: `Sie ist mit Daten aus aller Welt trainiert worden und ihre Antworten sind von vielen verschiedenen kulturellen Einflüssen geprägt. Der Bias ist dementsprechend klein. Um Datensätzen aus verschiedenen Regionen und Kulturen mit der gleichen Gewichtung in den Lernprozess aufzunehmen zu können, wurden deutlich weniger Datensätze verwendet, wie aus manchen Regionen zu Verfügung gewesen wären. Deshalb bietet "${name}" in vielen Bereichen Antworten mit weniger Wissenshintergrund, was sie für viele Nutzer unattraktiver und insgesamt wirtschaftlich nicht erfolgreich macht.`,
        };
    }
    if (diversity > 35) {
        return {
            title: 'Du hast eine ausgewogene KI angelernt!',
            description: `Sie ist mit Datensätzen aus verschiedenen Regionen und Themenbereichen trainiert worden. Der Bias ist vorhanden, aber vergleichsweise gering – viele Antworten sind differenziert und reflektiert. Allerdings fehlt der KI oft die klare Spezialisierung auf wirtschaftlich relevante Themen, weshalb sie in manchen Bereichen etwas unscharf oder weniger effizient wirkt. Für Nutzer:innen bedeutet das: Sie bekommen meist faire, aber manchmal weniger konkrete Antworten. Deine KI ist kein Star im globalen Wettbewerb, dafür aber ein System mit ethischem Potenzial.`,
        };
    }
    if (points > 150) {
        return {
            title: 'Du hast eine wirtschaftlich sehr starke KI angelernt!',
            description: `Die Antworten deiner KI vor allem im Bereich Technik und Programmierung sind herausragend. Man kann "${name}" auch zu kulturellen und persönlichen Dingen befragen, aber hier unterliegen die Nutzer einem starken Bias. Da die Daten zum Anlernen deiner KI vor allem aus westlichen Ländern und vor allem aus angloamerikanischen Kulturen kommen, werden andere Kulturen bei der Verarbeitung von Nutzeranfragen wenig beachtet. So reproduzieren sich Machtsysteme wie das Patriachat, Rassismus und westliche Wertevorstellungen durch deine KI. Durch den hohen Wissenshintergrund sind die Nutzer sehr zufrieden und deine KI steigt in den Globalen Wettkampf mit den anderen großen LLMs.`,
        };
    }
    return {
        title: 'Deine KI ist noch am Anfang!',
        description: `Deine KI "${name}" wurde mit einer kleinen und wenig diversen Datenmenge trainiert. Ihre Fähigkeiten sind begrenzt und die Antworten weisen einen starken Bias auf. Sie ist für den professionellen Einsatz noch nicht bereit, aber es ist ein erster Schritt. Experimentiere mit mehr und diverseren Datensätzen, um ihr Potenzial zu steigern.`,
    };
};
