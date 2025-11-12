import React, { useState, useEffect } from "react";
import "./Avatar.css";

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
            <img
            src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`}
            alt={alt}
            className="avatar-image"
            />
        )}
        </div>
    );
}
