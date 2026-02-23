import Sidebar from "@/components/ui/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
            <Sidebar />
            <main className="md:ml-[72px] pb-24 md:pb-0">
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 28px" }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
