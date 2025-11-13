// frontend/src/utils/avatar.js
// export function getSafeAvatarUrl(path) {
//     if (!path) return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`;

//     // If already a full URL, just return it
//     if (path.startsWith("http://")) return path;

//     if (path.includes("localhost")) {
//         return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`;
//     }

//     // Ensure it starts with a slash
//     if (!path.startsWith("/")) path = "/" + path;

//     // Use backend origin from environment variable if available
//     const backendUrl = import.meta.env.VITE_BACKEND_URL || window.location.origin;

//     return `${backendUrl}${path}`;
// }

// export function getAvatarPreview(file) {
//     return file ? URL.createObjectURL(file) : `https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`;
// }

// export function cleanupPreview(preview) {
//     if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
// }

// utils/avatar.js

// src/components/Avatar/Avatar.jsx

// export function getSafeAvatarUrl(path, userId) {
//     // Always return Dicebear if path is empty
//     if (!path) {
//         return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${userId}`;
//     }

//     // If path is already a full URL, just return it
//     if (path.startsWith("http")) return path;

//     // Fallback to Dicebear using userId
//     return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${userId}`;
// }

export const getSafeAvatarUrl = (avatarPath, userId) => {
    // If a userId is available, always return the DiceBear URL for consistency.
    if (userId) {
        return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${userId}`;
    }

    // Fallback if no user ID is present (e.g., a generic component needing an avatar)
    return "/default-fallback-icon.png";
};

export function getAvatarPreview(file, userId) {
    // If user selects a file, create temporary URL for preview
    return file ? URL.createObjectURL(file) : `https://api.dicebear.com/9.x/pixel-art/svg?seed=${userId}`;
}

export function cleanupPreview(preview) {
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
}
