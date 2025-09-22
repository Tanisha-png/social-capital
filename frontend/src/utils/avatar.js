// frontend/src/utils/avatar.js
export function getSafeAvatarUrl(path) {
    if (!path) return "/default-avatar.png";

    // If already a full URL, just return it
    if (path.startsWith("http")) return path;

    // Ensure it starts with a slash
    if (!path.startsWith("/")) path = "/" + path;

    // Use backend origin from environment variable if available
    const backendUrl = import.meta.env.VITE_BACKEND_URL || window.location.origin;

    return `${backendUrl}${path}`;
}

export function getAvatarPreview(file) {
    return file ? URL.createObjectURL(file) : "/default-avatar.png";
}

export function cleanupPreview(preview) {
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
}




