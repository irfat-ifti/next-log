import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("image") || formData.get("file");

        if (!file) {
            return NextResponse.json(
                { success: false, error: "No image file provided" },
                { status: 400 }
            );
        }

        const apiKey =
            process.env.IMGBB_API_KEY ||
            process.env.NEXT_PUBLIC_IMGBB_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                {
                    success: false,
                    error: "ImgBB API key is missing. Set NEXT_PUBLIC_IMGBB_API_KEY or IMGBB_API_KEY in .env.local",
                },
                { status: 500 }
            );
        }

        const imgbbFormData = new FormData();
        imgbbFormData.append("image", file);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: imgbbFormData,
        });

        const data = await response.json();

        if (!response.ok || !data?.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: data?.error?.message || "ImgBB image upload failed",
                },
                { status: response.status || 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                url: data.data.url,
                displayUrl: data.data.display_url,
                thumbUrl: data.data.thumb?.url || data.data.url,
                deleteUrl: data.data.delete_url,
                id: data.data.id,
                name: data.data.image?.name || file.name,
                type: data.data.image?.mime || file.type,
                size: data.data.size || file.size,
            },
        });
    } catch (error) {
        console.error("API /api/upload error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to process image upload" },
            { status: 500 }
        );
    }
}
