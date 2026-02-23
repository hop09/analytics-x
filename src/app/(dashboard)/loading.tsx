import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-blue-500 animate-spin" />
            <p className="text-slate-500 font-medium text-sm">Loading data...</p>
        </div>
    );
}
