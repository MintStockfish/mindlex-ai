import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbsProps {
    moduleTitle: string;
    id: string;
}

function Breadcrumbs({ moduleTitle, id }: BreadcrumbsProps) {
    return (
        <Breadcrumb className="mb-6">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink
                        href="/flashcards"
                        className="cursor-pointer hover:text-[#06b6d4] transition-colors"
                    >
                        Мои модули
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink
                        href={`/flashcards/module/${id}`}
                        className="cursor-pointer hover:text-[#06b6d4] transition-colors"
                    >
                        {moduleTitle}
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Изучение</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export default Breadcrumbs;
