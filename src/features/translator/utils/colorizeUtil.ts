export const getPartOfSpeechColor = (pos: string): string => {
    const lowerPos = pos.toLowerCase();
    if (lowerPos.includes("noun") || lowerPos.includes("существительное"))
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300";
    if (lowerPos.includes("verb") || lowerPos.includes("глагол"))
        return "bg-red-500/10 text-red-700 dark:text-red-300";
    if (lowerPos.includes("adjective") || lowerPos.includes("прилагательное"))
        return "bg-green-500/10 text-green-700 dark:text-green-300";
    if (lowerPos.includes("adverb") || lowerPos.includes("наречие"))
        return "bg-orange-500/10 text-orange-700 dark:text-orange-300";
    if (lowerPos.includes("preposition") || lowerPos.includes("предлог"))
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
    if (lowerPos.includes("article") || lowerPos.includes("артикль"))
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300";

    return "bg-gray-500/10 text-gray-700 dark:text-gray-300";
};

export const getBadgeColor = (pos: string): string => {
    const baseColor = getPartOfSpeechColor(pos);
    return `${baseColor} border-${baseColor.split("-")[1]}-500/20`;
};
