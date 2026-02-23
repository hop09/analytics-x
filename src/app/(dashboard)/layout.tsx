import Sidebar from "@/components/ui/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
            <Sidebar />
            <main className="dashboard-main">
                <div className="dashboard-container px-4 py-6 md:px-7 md:py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
