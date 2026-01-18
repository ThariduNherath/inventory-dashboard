import { AccountSettings } from "@stackframe/stack";
import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const user = await getCurrentUser();

    // User නැත්නම් login එකට යවනවා
    if (!user) {
        redirect("/handler/sign-in");
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar එක නිවැරදිව පෙන්වීමට flex සහ ml-64 අවශ්‍යයි */}
            <Sidebar currentPath="/settings" />
            
            <main className="ml-64 p-8 flex-1">
                <div className="mb-10">
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your account settings and preferences.
                    </p>
                </div>

                <div className="max-w-4xl">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        {/* Stack Auth එකේ AccountSettings component එක මෙතන වැඩ කරනවා */}
                        <AccountSettings />
                    </div>
                </div>
            </main>
        </div>
    );
}