import { getDashboardStats, getLinksWithClickCounts } from "@/lib/actions";
import AnalyticsOverviewClient from "@/components/dashboard/AnalyticsOverviewClient";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
    const stats = await getDashboardStats();
    const links = await getLinksWithClickCounts();

    return <AnalyticsOverviewClient stats={stats} links={links} />;
}
