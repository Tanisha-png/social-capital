

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams, Link } from "react-router-dom";
import * as authService from "../../services/authService";
import ConnectionsList from "../../components/ConnectionsList/ConnectionsList";
import PotentialConnections from "../../components/PotentialConnections/PotentialConnections";
import HelpSections from "../../components/HelpSections/HelpSections";
import {
  Briefcase,
  GraduationCap,
  User,
  MessageCircle,
  Users,
  HeartHandshake,
} from "lucide-react";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user } = useAuth();
  const { id } = useParams(); // if viewing another user's profile
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        let profileData;

        if (id && id !== user?.id) {
          // Viewing another user's profile
          profileData = await authService.getUserProfile(id, token);
        } else {
          // Viewing logged-in user's profile
          profileData = await authService.getProfile(token);
        }

        // Ensure help sections are always arrays
        profileData.canHelpWith = Array.isArray(profileData.canHelpWith)
          ? profileData.canHelpWith
          : [];
        profileData.needHelpWith = Array.isArray(profileData.needHelpWith)
          ? profileData.needHelpWith
          : [];

        setProfile(profileData);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [id, user]);

  if (loading) return <p>Loading profile...</p>;

  if (!profile) {
    return (
      <div className="profile-empty">
        <p>No profile found.</p>
        {!id && user && (
          <Link to="/edit-profile">
            <button className="edit-btn">Create Profile</button>
          </Link>
        )}
      </div>
    );
  }

  const canHelpList = Array.isArray(profile.canHelpWith)
    ? profile.canHelpWith
    : [];
  const needHelpList = Array.isArray(profile.needHelpWith)
    ? profile.needHelpWith
    : [];

  return (
    <div className="profile-page">
      {/* Profile Card */}
      <div className="profile-card">
        <img
          src={
            profile.avatar && profile.avatar.trim() !== ""
              ? profile.avatar
              : "/default-avatar.png"
          }
          alt="Profile"
          className="profile-avatar"
        />
        <h2>
          {profile.firstName} {profile.lastName}
        </h2>

        {profile.occupation && (
          <p>
            <Briefcase size={16} style={{ marginRight: "6px" }} />
            {profile.occupation}
          </p>
        )}
        {profile.education && (
          <p>
            <GraduationCap size={16} style={{ marginRight: "6px" }} />
            {profile.education}
          </p>
        )}
        {profile.bio && (
          <p className="profile-bio">
            <MessageCircle size={16} style={{ marginRight: "6px" }} />
            {profile.bio}
          </p>
        )}
      </div>

      {/* Can Help With */}
      <div className="profile-card">
        <h3>
          <HeartHandshake size={18} style={{ marginRight: "8px" }} />I Can Help
          With
        </h3>
        {canHelpList.length > 0 ? (
          <ul>
            {canHelpList.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>No help topics listed yet.</p>
        )}
      </div>

      {/* Need Help With */}
      <div className="profile-card">
        <h3>
          <User size={18} style={{ marginRight: "8px" }} />I Need Help With
        </h3>
        {needHelpList.length > 0 ? (
          <ul>
            {needHelpList.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>No help requests yet.</p>
        )}
      </div>

      {/* Connections */}
      <div className="profile-card">
        <h3>
          <Users size={18} style={{ marginRight: "8px" }} />
          Connections
        </h3>
        <ConnectionsList userId={profile._id} />
      </div>

      {/* Potential Connections */}
      <div className="profile-card">
        <h3>
          <Users size={18} style={{ marginRight: "8px" }} />
          People You May Know
        </h3>
        <PotentialConnections />
      </div>

      {/* Help Sections */}
      <div className="profile-card">
        <h3>
          <MessageCircle size={18} style={{ marginRight: "8px" }} />
          Help Sections
        </h3>
        <HelpSections canHelpWith={canHelpList} needHelpWith={needHelpList} />
      </div>

      {/* Edit Profile Button — only for your own profile */}
      {user && (user.id === profile._id || user._id === profile._id) && (
        <div className="profile-actions">
          <Link to="/edit-profile">
            <button className="edit-btn">Edit Profile</button>
          </Link>
        </div>
      )}
    </div>
  );
}





