export function MindlexLogo() {
    return (
        <div className="flex items-center gap-2">
            <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
            >
                <defs>
                    <linearGradient
                        id="mindlex-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>

                <circle
                    cx="8"
                    cy="16"
                    r="2.5"
                    fill="url(#mindlex-gradient)"
                    opacity="0.8"
                />
                <circle cx="16" cy="8" r="2.5" fill="url(#mindlex-gradient)" />
                <circle cx="16" cy="24" r="2.5" fill="url(#mindlex-gradient)" />
                <circle
                    cx="24"
                    cy="16"
                    r="2.5"
                    fill="url(#mindlex-gradient)"
                    opacity="0.8"
                />

                <line
                    x1="8"
                    y1="16"
                    x2="16"
                    y2="8"
                    stroke="url(#mindlex-gradient)"
                    strokeWidth="1.5"
                    opacity="0.5"
                />
                <line
                    x1="8"
                    y1="16"
                    x2="16"
                    y2="24"
                    stroke="url(#mindlex-gradient)"
                    strokeWidth="1.5"
                    opacity="0.5"
                />
                <line
                    x1="16"
                    y1="8"
                    x2="24"
                    y2="16"
                    stroke="url(#mindlex-gradient)"
                    strokeWidth="1.5"
                    opacity="0.5"
                />
                <line
                    x1="16"
                    y1="24"
                    x2="24"
                    y2="16"
                    stroke="url(#mindlex-gradient)"
                    strokeWidth="1.5"
                    opacity="0.5"
                />

                <path
                    d="M16 4C12.5 4 10 6 9 8C8 7.5 7 7 6 7.5C4.5 8 4 9.5 4 11C4 12 4.5 13 5 13.5C4.5 14 4 15 4 16C4 17.5 5 18.5 6 19C5.5 19.5 5 20.5 5 21.5C5 23 6 24 7.5 24.5C8 24.7 8.5 25 9 25C10 27 12.5 28 16 28C19.5 28 22 27 23 25C23.5 25 24 24.7 24.5 24.5C26 24 27 23 27 21.5C27 20.5 26.5 19.5 26 19C27 18.5 28 17.5 28 16C28 15 27.5 14 27 13.5C27.5 13 28 12 28 11C28 9.5 27.5 8 26 7.5C25 7 24 7.5 23 8C22 6 19.5 4 16 4Z"
                    stroke="url(#mindlex-gradient)"
                    strokeWidth="1.5"
                    fill="none"
                />
            </svg>

            <span className="bg-linear-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent text-xl tracking-tight select-none">
                Mindlex AI
            </span>
        </div>
    );
}
