// services/notificationApi.js
// export const markMessageNotificationsRead = async (senderId, token) => {
//     await fetch(`${import.meta.env.VITE_API_BASE}/messages/mark-read`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ senderId }),
//     });
// };

export const markMessageNotificationsRead = async (senderId, token) => {
    const res = await fetch(`/api/messages/mark-read`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ senderId }),
    });

    if (!res.ok) {
        console.error("Failed to mark messages read");
    }
};
