import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams, Link } from "react-router-dom";
import PotentialConnections from "../../components/PotentialConnections/PotentialConnections";
import HelpSections from "../../components/HelpSections/HelpSections";
import Avatar from "../../components/Avatar/Avatar.jsx";
import {
  Briefcase,
  GraduationCap,
  MessageCircle,
  Users,
  HeartHandshake,
} from "lucide-react";
import { getToken } from "../../services/authService";
import { getSafeAvatarUrl } from "../../utils/avatar";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        const token = getToken();

        // Use _id-safe comparison to decide endpoint
        const profileUrl =
          id && id !== authUser?._id ? `/api/users/${id}` : "/api/users/me";

        const profileRes = await fetch(profileUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileRes.json();

        if (!profileData || profileData.error) {
          setProfile(null);
          return;
        }

        // Fetch connections
        const connectionsUrl =
          id && id !== authUser?._id
            ? `/api/users/${id}/connections`
            : "/api/users/me/connections";

        const connRes = await fetch(connectionsUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const connData = await connRes.json();

        if (!isMounted) return;

        // Normalize profile
        setProfile({
          ...profileData,
          _id: profileData._id, // ensure _id exists
          avatar: getSafeAvatarUrl(profileData.avatar),
          canHelpWith: Array.isArray(profileData.canHelpWith)
            ? profileData.canHelpWith
            : [],
          needHelpWith: Array.isArray(profileData.needHelpWith)
            ? profileData.needHelpWith
            : [],
        });

        // Normalize connections safely (always an array)
        const connList = Array.isArray(connData) ? connData : [];
        setConnections(
          connList.map((c) => ({
            _id: c._id,
            firstName: c.firstName || "",
            lastName: c.lastName || "",
            profileImage: getSafeAvatarUrl(c.profileImage),
          }))
        );
      } catch (err) {
        console.error("Error fetching profile:", err);
        setProfile(null);
        setConnections([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [id, authUser]);

  if (loading) return <p>Loading profile...</p>;

  if (!profile)
    return (
      <div className="profile-empty">
        <p>No profile found.</p>
        {!id && authUser?._id && (
          <Link to="/edit-profile">
            <button className="edit-btn">Create Profile</button>
          </Link>
        )}
      </div>
    );

  return (
    <div className="profile-page">
      {/* Profile Info */}
      <div className="profile-card">
        <Avatar src={profile.avatar} alt="Profile" className="profile-avatar" />
        <h2>
          {profile.firstName || "Unknown"} {profile.lastName || ""}
        </h2>
        {profile.occupation && (
          <p>
            <Briefcase size={16} /> {profile.occupation}
          </p>
        )}
        {profile.education && (
          <p>
            <GraduationCap size={16} /> {profile.education}
          </p>
        )}
        {profile.bio && (
          <p className="profile-bio">
            <MessageCircle size={16} /> {profile.bio}
          </p>
        )}
      </div>

      {/* Connections */}
      <div className="profile-card">
        <h3>
          <Users size={18} /> Connections
        </h3>
        {connections.length === 0 ? (
          <p>No connections yet.</p>
        ) : (
          <ul className="connections-list">
            {connections.map((c) => (
              <li key={c._id}>
                <Avatar
                  src={c.profileImage}
                  alt={`${c.firstName} ${c.lastName}`}
                  className="connection-avatar"
                />
                <span>
                  {c.firstName} {c.lastName}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Potential Connections */}
      <div className="profile-card">
        <h3>
          <Users size={18} /> People You May Know
        </h3>
        <PotentialConnections />
      </div>

      {/* Help Sections */}
      <div className="profile-card">
        <h3>
          <MessageCircle size={18} /> Help Sections
        </h3>
        {profile.canHelpWith.length > 0 && (
          <div>
            <HeartHandshake size={16} /> I can help with:
          </div>
        )}
        <HelpSections
          canHelpWith={profile.canHelpWith}
          needHelpWith={profile.needHelpWith}
        />
      </div>

      {/* Edit Profile Button */}
      {authUser?._id === profile._id && (
        <div className="profile-actions">
          <Link to="/edit-profile">
            <button className="edit-btn">Edit Profile</button>
          </Link>
        </div>
      )}
    </div>
  );
}
