import { Loader2 } from "lucide-react";

function Loader() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8 sm:py-12">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground">
                    Загрузка...
                </p>
            </div>
        </div>
    );
}

export default Loader;
