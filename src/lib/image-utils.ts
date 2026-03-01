/**
 * Client-side image compression for OG preview images.
 * Uses Canvas API to resize and compress images before upload.
 * Target: max 1200×630 (OG image standard), JPEG quality 0.8
 */

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 630;
const JPEG_QUALITY = 0.8;
const MAX_FILE_SIZE = 500 * 1024; // 500 KB target after compression

function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        const url = URL.createObjectURL(file);
        img.src = url;
    });
}

export async function compressImage(file: File): Promise<File> {
    // If already small enough and is JPEG, skip compression
    if (file.size <= MAX_FILE_SIZE && file.type === "image/jpeg") {
        return file;
    }

    const img = await loadImage(file);

    // Calculate new dimensions maintaining aspect ratio
    let { width, height } = img;

    if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
    }
    if (height > MAX_HEIGHT) {
        width = Math.round((width * MAX_HEIGHT) / height);
        height = MAX_HEIGHT;
    }

    // Draw onto canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    // White background (for transparent PNGs)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    // Revoke the object URL
    URL.revokeObjectURL(img.src);

    // Try JPEG compression with decreasing quality until under size limit
    let quality = JPEG_QUALITY;
    let blob: Blob | null = null;

    for (let i = 0; i < 5; i++) {
        blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/jpeg", quality)
        );
        if (blob && blob.size <= MAX_FILE_SIZE) break;
        quality -= 0.1;
    }

    if (!blob) throw new Error("Image compression failed");

    // Convert blob to File
    return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
        type: "image/jpeg",
    });
}

export async function uploadImage(file: File): Promise<string> {
    const compressed = await compressImage(file);

    const formData = new FormData();
    formData.append("file", compressed);

    const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
    }

    const data = await res.json();
    return data.url;
}
