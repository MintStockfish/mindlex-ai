import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintConfigPrettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),

    {
        plugins: {
            "simple-import-sort": simpleImportSort,
        },
        rules: {
            "simple-import-sort/imports": [
                "error",
                {
                    groups: [
                        ["^react", "^next", "^@?\\w"],
                        ["^@/"],
                        ["^\\.\\./", "^\\./"],
                        ["^.+\\.s?css$", "^.+types$"],
                    ],
                },
            ],
            "simple-import-sort/exports": "error",
        },
    },
    eslintConfigPrettier,
];

export default eslintConfig;
