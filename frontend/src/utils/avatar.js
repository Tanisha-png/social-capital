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

export function getSafeAvatarUrl(path, userId) {
    if (!path) {
        return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(
            userId || "user"
        )}`;
    }

    // If it's already a Dicebear URL, return it
    if (path.includes("api.dicebear.com")) return path;

    // If it starts with localhost, replace with your Heroku backend URL
    if (path.includes("localhost")) {
        return path.replace(
            "http://localhost:3000",
            "https://social-capital-1f13c371b2ba.herokuapp.com"
        );
    }

    // If it’s a relative path, prefix with backend
    if (!path.startsWith("http")) {
        const backendUrl =
            import.meta.env.VITE_BACKEND_URL ||
            "https://social-capital-1f13c371b2ba.herokuapp.com";
        return `${backendUrl}${path.startsWith("/") ? path : `/${path}`}`;
    }

    return path;
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




