import React from "react";
import "./HelpSections.css";

export default function HelpSections({ canHelpWith = [], needHelpWith = [] }) {
    return (
        <div className="help-sections">
        <div className="help-box">
            <h3>I Can Help With</h3>
            {canHelpWith.length === 0 ? (
            <p>Not specified</p>
            ) : (
            <ul>
                {canHelpWith.map((item, idx) => (
                <li key={idx}>{item}</li>
                ))}
            </ul>
            )}
        </div>

        <div className="help-box">
            <h3>I Need Help With</h3>
            {needHelpWith.length === 0 ? (
            <p>Not specified</p>
            ) : (
            <ul>
                {needHelpWith.map((item, idx) => (
                <li key={idx}>{item}</li>
                ))}
            </ul>
            )}
        </div>
        </div>
    );
}
