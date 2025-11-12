// frontend/src/utils/avatar.js
export function getSafeAvatarUrl(path) {
    if (!path) return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`;

    // If already a full URL, just return it
    if (path.startsWith("http://")) return path;

    if (path.includes("localhost")) {
        return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`;
    }

    // Ensure it starts with a slash
    if (!path.startsWith("/")) path = "/" + path;

    // Use backend origin from environment variable if available
    const backendUrl = import.meta.env.VITE_BACKEND_URL || window.location.origin;

    return `${backendUrl}${path}`;
}

export function getAvatarPreview(file) {
    return file ? URL.createObjectURL(file) : `https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`;
}

export function cleanupPreview(preview) {
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
}




