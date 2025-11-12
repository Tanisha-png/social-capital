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

export function getSafeAvatarUrl(path, userId = "guest") {
    // ✅ If no avatar, return a DiceBear image based on userId
    if (!path) {
        return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(
            userId
        )}`;
    }

    // ✅ If it's already a valid external URL, allow it
    if (path.startsWith("https://") || path.startsWith("http://")) {
        // Block localhost images when deployed
        if (path.includes("localhost")) {
            return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(
                userId
            )}`;
        }
        return path;
    }

    // ✅ Ensure path starts with a slash
    if (!path.startsWith("/")) path = "/" + path;

    // ✅ Use backend URL from environment variable
    const backendUrl =
        import.meta.env.VITE_BACKEND_URL ||
        "https://social-capital-backend.herokuapp.com"; // replace with your backend URL

    // ✅ Return safe full URL
    return `${backendUrl}${path}`;
}

export function getAvatarPreview(file, userId = "guest") {
    return file
        ? URL.createObjectURL(file)
        : `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(
            userId
        )}`;
}

export function cleanupPreview(preview) {
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
}




