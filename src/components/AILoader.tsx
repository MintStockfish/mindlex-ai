export function AILoader() {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-24 h-24">
                {/* Outer pulsing circle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#06b6d4]/20 to-[#3b82f6]/20 animate-pulse" />

                {/* Rotating neural nodes */}
                <svg
                    className="absolute inset-0 w-full h-full animate-spin"
                    style={{ animationDuration: "3s" }}
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient
                            id="loader-gradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                        >
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                    </defs>

                    {/* Neural nodes */}
                    <circle cx="50" cy="10" r="4" fill="url(#loader-gradient)">
                        <animate
                            attributeName="opacity"
                            values="1;0.5;1"
                            dur="1.5s"
                            repeatCount="indefinite"
                        />
                    </circle>
                    <circle cx="85" cy="35" r="4" fill="url(#loader-gradient)">
                        <animate
                            attributeName="opacity"
                            values="1;0.5;1"
                            dur="1.5s"
                            begin="0.3s"
                            repeatCount="indefinite"
                        />
                    </circle>
                    <circle cx="85" cy="65" r="4" fill="url(#loader-gradient)">
                        <animate
                            attributeName="opacity"
                            values="1;0.5;1"
                            dur="1.5s"
                            begin="0.6s"
                            repeatCount="indefinite"
                        />
                    </circle>
                    <circle cx="50" cy="90" r="4" fill="url(#loader-gradient)">
                        <animate
                            attributeName="opacity"
                            values="1;0.5;1"
                            dur="1.5s"
                            begin="0.9s"
                            repeatCount="indefinite"
                        />
                    </circle>
                    <circle cx="15" cy="65" r="4" fill="url(#loader-gradient)">
                        <animate
                            attributeName="opacity"
                            values="1;0.5;1"
                            dur="1.5s"
                            begin="1.2s"
                            repeatCount="indefinite"
                        />
                    </circle>
                    <circle cx="15" cy="35" r="4" fill="url(#loader-gradient)">
                        <animate
                            attributeName="opacity"
                            values="1;0.5;1"
                            dur="1.5s"
                            begin="1.5s"
                            repeatCount="indefinite"
                        />
                    </circle>

                    {/* Connecting lines */}
                    <line
                        x1="50"
                        y1="10"
                        x2="85"
                        y2="35"
                        stroke="url(#loader-gradient)"
                        strokeWidth="1"
                        opacity="0.3"
                    />
                    <line
                        x1="85"
                        y1="35"
                        x2="85"
                        y2="65"
                        stroke="url(#loader-gradient)"
                        strokeWidth="1"
                        opacity="0.3"
                    />
                    <line
                        x1="85"
                        y1="65"
                        x2="50"
                        y2="90"
                        stroke="url(#loader-gradient)"
                        strokeWidth="1"
                        opacity="0.3"
                    />
                    <line
                        x1="50"
                        y1="90"
                        x2="15"
                        y2="65"
                        stroke="url(#loader-gradient)"
                        strokeWidth="1"
                        opacity="0.3"
                    />
                    <line
                        x1="15"
                        y1="65"
                        x2="15"
                        y2="35"
                        stroke="url(#loader-gradient)"
                        strokeWidth="1"
                        opacity="0.3"
                    />
                    <line
                        x1="15"
                        y1="35"
                        x2="50"
                        y2="10"
                        stroke="url(#loader-gradient)"
                        strokeWidth="1"
                        opacity="0.3"
                    />
                </svg>

                {/* Center pulsing core */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] animate-pulse" />
                </div>
            </div>

            <p className="mt-6 text-sm text-muted-foreground animate-pulse">
                Анализирую...
            </p>
        </div>
    );
}
