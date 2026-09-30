/**
 * Uploads an image file to ImgBB via its REST API.
 * Uses NEXT_PUBLIC_IMGBB_API_KEY from environment variables.
 *
 * @param {File | Blob} file - The image file to upload
 * @returns {Promise<{
 *   url: string,
 *   displayUrl: string,
 *   thumbUrl: string,
 *   deleteUrl: string,
 *   id: string,
 *   name: string,
 *   type: string,
 *   size: number
 * }>}
 */
export async function uploadImageToImgBB(file) {
    const apiKey =
        process.env.NEXT_PUBLIC_IMGBB_API_KEY ||
        process.env.IMGBB_API_KEY;

    if (!apiKey) {
        throw new Error(
            "ImgBB API key is missing. Please define NEXT_PUBLIC_IMGBB_API_KEY in your .env.local file."
        );
    }

    if (!file) {
        throw new Error("No image file provided for upload.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result?.success) {
        const errorMsg =
            result?.error?.message ||
            `ImgBB upload failed with status ${response.status}`;
        throw new Error(errorMsg);
    }

    return {
        url: result.data.url,
        displayUrl: result.data.display_url,
        thumbUrl: result.data.thumb?.url || result.data.url,
        deleteUrl: result.data.delete_url,
        id: result.data.id,
        name: result.data.image?.name || file.name || "image",
        type: result.data.image?.mime || file.type || "image/jpeg",
        size: result.data.size || file.size || 0,
    };
}
