export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-dvh bg-background text-text-primary flex flex-col selection:bg-accent-indigo/30 overflow-y-auto">
            {/* Ambient background glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/[0.07] blur-[120px] animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/[0.05] blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
                <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-500/[0.04] blur-[80px] animate-float" style={{ animationDelay: '-5s' }} />
            </div>
            <div className="flex-1 flex items-start sm:items-center justify-center px-5 pt-12 pb-8 sm:py-12">
                {children}
            </div>
        </div>
    );
}
