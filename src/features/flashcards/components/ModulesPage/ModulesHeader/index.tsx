import CreateModuleDialog from "@/features/flashcards/components/ModulesPage/ModulesHeader/ModuleDialog";
import HeaderText from "@/features/flashcards/components/ModulesPage/ModulesHeader/HeaderText";
import { ModulesHeaderProps } from "../../../types/types";

export default function ModulesHeader({
    isDialogOpen,
    setIsDialogOpen,
}: ModulesHeaderProps) {
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
