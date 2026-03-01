import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createServerClient } from "@supabase/ssr";

const BUCKET = "og-images";
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB max upload

async function getSessionUser(request: NextRequest) {
    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return request.cookies.getAll(); },
                    setAll() {},
                },
            }
        );
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    } catch {
        return null;
    }
}

async function ensureBucket() {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === BUCKET);
    if (!exists) {
        await supabaseAdmin.storage.createBucket(BUCKET, {
            public: true,
            fileSizeLimit: MAX_SIZE,
            allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getSessionUser(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "File must be an image" }, { status: 400 });
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: "File too large. Maximum 5 MB after compression." },
                { status: 400 }
            );
        }

        await ensureBucket();

        // Generate a unique filename
        const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
        const filename = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        const buffer = Buffer.from(await file.arrayBuffer());

        const { error: uploadError } = await supabaseAdmin.storage
            .from(BUCKET)
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        const { data: urlData } = supabaseAdmin.storage
            .from(BUCKET)
            .getPublicUrl(filename);

        return NextResponse.json({ url: urlData.publicUrl }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
