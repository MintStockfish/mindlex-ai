import Link from "next/link";
import RegisterForm from "@/features/auth/components/register/RegisterForm";

import { MindlexLogo } from "@/components/ui/MindlexLogo";

export default function Register() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-linear-to-br from-background via-background to-[#06b6d4]/5">
            <div className="w-full max-w-md">
                <Link
                    href="/"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity justify-center mb-8"
                >
                    <MindlexLogo />
                </Link>

                <RegisterForm />
            </div>
        </div>
    );
}
