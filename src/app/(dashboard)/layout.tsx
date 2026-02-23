import Sidebar from "@/components/ui/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
            <Sidebar />
            <main className="md:ml-[68px] pb-20 md:pb-0">
                <div className="max-w-[1100px] mx-auto px-4 py-6 md:px-7 md:py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
