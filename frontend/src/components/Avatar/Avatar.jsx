import React, { useState, useEffect } from "react";
import "./Avatar.css";

// export default function Avatar({ src, alt, className }) {
//     const [loadedSrc, setLoadedSrc] = useState("/default-avatar.png");

//     useEffect(() => {
//         let isMounted = true;
//         if (!src) return;

//         const img = new Image();
//         img.src = src;
//         img.onload = () => isMounted && setLoadedSrc(src);
//         img.onerror = () => isMounted && setLoadedSrc("/default-avatar.png");

//         return () => {
//         isMounted = false;
//         };
//     }, [src]);

//     return <img src={loadedSrc} alt={alt} className={className} />;
// }

export default function Avatar({ src, alt, className }) {
    const [loadedSrc, setLoadedSrc] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        if (!src) {
        setLoadedSrc("/default-avatar.png");
        setLoading(false);
        return;
        }

        setLoading(true);
        const img = new Image();
        img.src = src;
        img.onload = () => {
        if (isMounted) {
            setLoadedSrc(src);
            setLoading(false);
        }
        };
        img.onerror = () => {
        if (isMounted) {
            setLoadedSrc("/default-avatar.png");
            setLoading(false);
        }
        };

        return () => {
        isMounted = false;
        };
    }, [src]);

    return (
        <div className={`avatar-wrapper ${className}`}>
        {loading ? (
            // Placeholder while image loads
            <div className="avatar-placeholder" />
        ) : (
            <img src={loadedSrc} alt={alt} className="avatar-image" />
        )}
        </div>
    );
}

