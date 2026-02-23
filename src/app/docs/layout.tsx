import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "API Documentation – HOP Analytics",
    description: "Public REST API documentation for HOP Analytics link shortener",
};

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
