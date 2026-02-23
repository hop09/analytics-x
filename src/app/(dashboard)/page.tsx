import { getDashboardStats, getRecentClicks } from "@/lib/actions";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const stats = await getDashboardStats();
    const recentClicks = await getRecentClicks(10);

    return <DashboardClient stats={stats} recentClicks={recentClicks} />;
}
