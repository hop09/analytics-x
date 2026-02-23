import { getLinksWithClickCounts } from "@/lib/actions";
import LinksClient from "@/components/dashboard/LinksClient";

export const dynamic = "force-dynamic";

export default async function LinksPage() {
    const links = await getLinksWithClickCounts();

    return <LinksClient initialLinks={links} />;
}
