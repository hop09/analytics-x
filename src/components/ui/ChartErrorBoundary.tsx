"use client";

import { Component, type ReactNode } from "react";
import { BarChart3 } from "lucide-react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export default class ChartErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-full min-h-[200px] flex flex-col items-center justify-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                        <BarChart3 className="w-6 h-6 text-rose-400" />
                    </div>
                    <p className="text-sm font-semibold text-text-primary">Chart failed to render</p>
                    <p className="text-xs text-text-muted">Try refreshing the page</p>
                </div>
            );
        }

        return this.props.children;
    }
}
