import CreateModuleDialog from "@/features/flashcards/components/FlashCardHeader/ModuleDialog";
import HeaderText from "@/features/flashcards/components/FlashCardHeader/HeaderText";
import { FlashCardHeaderProps } from "../../types";

export default function FlashCardHeader({
    isDialogOpen,
    setIsDialogOpen,
}: FlashCardHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <HeaderText />
            <CreateModuleDialog
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
            />
        </div>
    );
}
