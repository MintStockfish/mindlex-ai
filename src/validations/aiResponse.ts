import { z } from "zod";

const UsageSchema = z.object({
    informal: z.coerce.number(),
    neutral: z.coerce.number(),
    formal: z.coerce.number(),
});

const PartOfSpeechSchema = z.object({
    type: z.string(),
    meaning: z.string(),
    example: z.string(),
});

const WordVariantSchema = z.object({
    word: z.string(),
    ipa: z.string().optional(),
});

export const WordDataSchema = z.object({
    word: z.string(),
    translation: z.string(),
    exampleSentence: z.string(),
    exampleTranslation: z.string(),
    ipa: z.string(),
    pronunciation: z.string(),
    partsOfSpeech: z.array(PartOfSpeechSchema),
    synonyms: z.array(WordVariantSchema),
    antonyms: z.array(WordVariantSchema),
    usage: UsageSchema,
    etymology: z.string(),
});
