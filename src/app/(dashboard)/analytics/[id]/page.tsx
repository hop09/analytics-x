import { getLinkWithStats } from "@/lib/actions";
import LinkAnalyticsClient from "@/components/dashboard/LinkAnalyticsClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function LinkAnalyticsPage({ params }: PageProps) {
    const { id } = await params;
    const { link, stats } = await getLinkWithStats(id);

    if (!link || !stats) {
        notFound();
    }

    return <LinkAnalyticsClient link={link} stats={stats} />;
}
