import { getPartOfSpeechColor } from "../../utils/colorizeUtils";

import { SentenceData } from "../../types/types";

interface SentenceDisplayProps {
    words: SentenceData["words"];
    onWordClick: (wordDetail: SentenceData["words"][0]["detail"]) => void;
}

export const SentenceDisplay = ({
    words,
    onWordClick,
}: SentenceDisplayProps) => {
    return (
        <div className="space-y-3">
            <h3>Исходное предложение</h3>
            <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-lg leading-relaxed flex flex-wrap gap-2">
                    {words.map((wordData, index) => (
                        <button
                            key={`${index}-${wordData.word}`} // Лучше уникальный ключ
                            onClick={() => onWordClick(wordData.detail)}
                            className={`${getPartOfSpeechColor(
                                wordData.partOfSpeech
                            )} px-2 py-1 rounded transition-all hover:scale-105 hover:shadow-md cursor-pointer`}
                            title={wordData.partOfSpeech}
                        >
                            {wordData.word}
                        </button>
                    ))}
                </p>
            </div>
        </div>
    );
};
