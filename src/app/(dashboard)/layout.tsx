import Sidebar from "@/components/ui/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-text-primary flex selection:bg-accent-indigo/30">
            <Sidebar />

            <main className="flex-1 min-w-0 pb-20 md:pb-0 md:pl-28 transition-all duration-300">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 md:py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
