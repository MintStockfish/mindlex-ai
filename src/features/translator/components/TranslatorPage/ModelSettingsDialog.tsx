"use client";

import { useEffect, useState } from "react";
import { Cloud, KeyRound, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OpenAIIcon } from "@/components/ui/OpenAIIcon";
import { cn } from "@/lib/utils";

type AiProviderId = "cloudflare" | "gemini" | "openai";

type AiModelOption = {
    id: AiProviderId;
    name: string;
    description: string;
    apiKeyHint: string;
    requiresApiKey: boolean;
    isDefault?: boolean;
    icon: AiProviderId;
};

const MODEL_OPTIONS: AiModelOption[] = [
    {
        id: "cloudflare",
        name: "Cloudflare Workers AI",
        description: "Built-in provider for translation requests.",
        apiKeyHint: "No API key required",
        requiresApiKey: false,
        isDefault: true,
        icon: "cloudflare",
    },
    {
        id: "gemini",
        name: "Gemini Flash Lite",
        description: "Google AI Studio model for fast responses.",
        apiKeyHint: "Requires Google AI Studio API key",
        icon: "gemini",
        requiresApiKey: true,
    },
    {
        id: "openai",
        name: "OpenAI",
        description: "Use OpenAI models through your own account.",
        apiKeyHint: "Requires OpenAI API key",
        icon: "openai",
        requiresApiKey: true,
    },
];

const LUCIDE_MODEL_ICON = {
    cloudflare: Cloud,
    gemini: Sparkles,
} satisfies Partial<Record<AiModelOption["icon"], typeof Cloud>>;

interface ModelSettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    provider: string;
    setProvider: (provider: string) => void;
    apiKey: string;
    setApiKey: (apiKey: string) => void;
    disabled?: boolean;
}

export default function ModelSettingsDialog({
    open,
    onOpenChange,
    apiKey = "",
    provider = "cloudflare",
    setProvider,
    setApiKey,
    disabled = false,
}: ModelSettingsDialogProps) {
    const [draftProvider, setDraftProvider] = useState<AiProviderId>(() =>
        toProviderId(provider),
    );
    const [draftApiKey, setDraftApiKey] = useState(apiKey);
    const selectedOption = MODEL_OPTIONS.find(
        (model) => model.id === draftProvider,
    );
    const requiresApiKey = selectedOption?.requiresApiKey ?? false;
    const canSave =
        !disabled && (!requiresApiKey || draftApiKey.trim().length > 0);

    useEffect(() => {
        if (!open) return;

        setDraftProvider(toProviderId(provider));
        setDraftApiKey(apiKey);
    }, [apiKey, open, provider]);

    const onModelChange = (id: AiProviderId) => {
        setDraftProvider(id);
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    const handleSave = () => {
        setProvider(draftProvider);
        setApiKey(requiresApiKey ? draftApiKey.trim() : "");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        AI model settings
                    </DialogTitle>
                    <DialogDescription>
                        Cloudflare is used by default and does not require an
                        API key.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5">
                    <div className="space-y-3">
                        <Label>Model</Label>
                        <div className="max-h-[280px] space-y-2 overflow-y-auto pr-1">
                            {MODEL_OPTIONS.map((model) => {
                                const Icon =
                                    model.icon === "openai"
                                        ? null
                                        : LUCIDE_MODEL_ICON[model.icon];
                                const isSelected = draftProvider === model.id;

                                return (
                                    <button
                                        key={model.id}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() =>
                                            onModelChange?.(model.id)
                                        }
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all",
                                            "hover:border-[#06b6d4] hover:bg-muted/50",
                                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4]/60",
                                            isSelected
                                                ? "border-[#06b6d4] bg-[#06b6d4]/10"
                                                : "border-border bg-background",
                                            disabled &&
                                                "cursor-not-allowed opacity-60",
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "flex size-10 shrink-0 items-center justify-center rounded-md border",
                                                isSelected
                                                    ? "border-[#06b6d4]/50 bg-[#06b6d4]/15 text-[#0891b2]"
                                                    : "border-border bg-muted text-muted-foreground",
                                            )}
                                        >
                                            {model.icon === "openai" ? (
                                                <OpenAIIcon
                                                    aria-hidden="true"
                                                    className="size-5"
                                                />
                                            ) : (
                                                Icon && (
                                                    <Icon className="size-5" />
                                                )
                                            )}
                                        </span>

                                        <span className="min-w-0 flex-1 space-y-1">
                                            <span className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {model.name}
                                                </span>
                                                {model.isDefault && (
                                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                                        Default
                                                    </span>
                                                )}
                                            </span>
                                            <span className="block text-sm text-muted-foreground">
                                                {model.description}
                                            </span>
                                            <span
                                                className={cn(
                                                    "block text-xs",
                                                    model.requiresApiKey
                                                        ? "text-amber-600 dark:text-amber-400"
                                                        : "text-emerald-600 dark:text-emerald-400",
                                                )}
                                            >
                                                {model.apiKeyHint}
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ai-provider-api-key">API key</Label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="ai-provider-api-key"
                                type="password"
                                value={draftApiKey}
                                onChange={(event) =>
                                    setDraftApiKey(event.target.value)
                                }
                                disabled={disabled || !requiresApiKey}
                                placeholder={
                                    requiresApiKey
                                        ? "Paste API key"
                                        : "No API key required for Cloudflare"
                                }
                                className="h-11 pl-10"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={!canSave}
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function toProviderId(provider: string): AiProviderId {
    return MODEL_OPTIONS.some((model) => model.id === provider)
        ? (provider as AiProviderId)
        : "cloudflare";
}
