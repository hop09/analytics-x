import Sidebar from "@/components/ui/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "stretch" }}>
            <Sidebar />

            {/* Flexbox Spacer for Fixed Sidebar (Desktop Only) */}
            <div className="hidden md:block" style={{ width: "68px", flexShrink: 0 }} />

            {/* Main Content Area */}
            <main style={{ flex: 1, minWidth: 0 }} className="pb-20 md:pb-0">
                <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%" }} className="px-4 py-6 md:px-8 md:py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
