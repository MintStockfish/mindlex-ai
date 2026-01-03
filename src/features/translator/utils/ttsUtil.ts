import { toast } from "sonner";

export const tts = (text: string, lang: string = "en") => {
    if (typeof window === "undefined") return;

    const synth = window.speechSynthesis;
    if (!synth) {
        toast.error("TTS не поддерживается");
        return;
    }

    synth.cancel();

    const voices = synth.getVoices();

    if (voices.length === 0) {
        console.log("Голоса еще не готовы, ждем события onvoiceschanged...");

        const onVoicesChanged = () => {
            synth.onvoiceschanged = null;
            tts(text, lang);
        };

        synth.onvoiceschanged = onVoicesChanged;

        synth.getVoices();
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    const targetVoice = voices.find((v) => v.lang.startsWith(lang));

    if (targetVoice) {
        utterance.voice = targetVoice;
    } else {
        console.warn(`Голос для ${lang} не найден, использую дефолтный.`);
    }

    utterance.onerror = (event) => {
        console.error("Ошибка TTS:", event);
        toast.error(`Ошибка TTS, ${event}`);
    };

    synth.speak(utterance);
};
