export const TranslationDisplay = ({
    translation,
}: {
    translation: string;
}) => {
    return (
        <div className="space-y-3">
            <h3>Перевод</h3>
            <div className="bg-linear-to-r from-[#06b6d4]/10 to-[#3b82f6]/10 rounded-lg p-4">
                <p className="text-lg">{translation}</p>
            </div>
        </div>
    );
};
