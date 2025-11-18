
// src/pages/ProfilePage/profilePage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import { rejectFriendRequest as declineFriendRequest } from "../../api/userApi";
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
import {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  getFriends,
} from "../../api/userApi";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [connections, setConnections] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfileAndConnections() {
      setLoading(true);
      try {
        const token = getToken();
        if (!token) {
          if (isMounted) {
            setProfile(null);
            setConnections([]);
            setIncomingRequests([]);
            setLoading(false);
          }
          return;
        }

        const profileUrl =
          id && id !== authUser?._id ? `/api/users/${id}` : "/api/users/me";
        const profileRes = await fetch(profileUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileRes.json();
        if (!profileRes.ok || !profileData) {
          console.error("Profile fetch failed:", profileData);
          if (isMounted) setProfile(null);
          return;
        }

        const connectionsUrl =
          id && id !== authUser?._id
            ? `/api/users/${id}/connections`
            : "/api/users/me/connections";
        const connRes = await fetch(connectionsUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const connData = await connRes.json();

        if (!isMounted) return;

        setProfile({
          ...profileData,
          _id: profileData._id,
          avatar: profileData.avatar,
          canHelpWith: Array.isArray(profileData.canHelpWith)
            ? profileData.canHelpWith
            : [],
          needHelpWith: Array.isArray(profileData.needHelpWith)
            ? profileData.needHelpWith
            : [],
        });

        const connList = Array.isArray(connData) ? connData : [];
        setConnections(
          connList.map((c) => ({
            _id: c._id,
            firstName: c.firstName || "",
            lastName: c.lastName || "",
            profileImage: getSafeAvatarUrl(c.profileImage),
          }))
        );

        setIsFriend(
          connList.some((c) => String(c._id) === String(authUser?._id))
        );

        if (!id || id === authUser?._id) {
          const requests = await getFriendRequests(token);
          setIncomingRequests(Array.isArray(requests) ? requests : []);
        } else {
          const otherProfileRes = await fetch(`/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const otherProfile = await otherProfileRes.json();
          if (otherProfile && Array.isArray(otherProfile.friendRequests)) {
            setRequestSent(
              otherProfile.friendRequests
                .map(String)
                .includes(String(authUser?._id))
            );
          } else {
            setRequestSent(false);
          }
        }
      } catch (err) {
        console.error("Error loading profile page:", err);
        if (isMounted) {
          setProfile(null);
          setConnections([]);
          setIncomingRequests([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProfileAndConnections();
    return () => {
      isMounted = false;
    };
  }, [id, authUser]);

  const handleMessageUser = (userId) => navigate(`/messages/${userId}`);

  const handleSendRequest = async () => {
    if (!profile?._id) return;
    setBusy(true);
    try {
      await sendFriendRequest(profile._id, getToken());
      setRequestSent(true);
    } catch (err) {
      console.error("Failed to send request:", err);
      alert("❌ Failed to send connection request.");
    } finally {
      setBusy(false);
    }
  };

  const handleAcceptRequest = async (requesterId) => {
    setBusy(true);
    try {
      await acceptFriendRequest(requesterId, getToken());
      setIncomingRequests((prev) =>
        prev.filter((r) => String(r._id) !== String(requesterId))
      );
      alert("✅ Friend request accepted!");
    } catch (err) {
      console.error("Failed to accept request:", err);
      alert("❌ Failed to accept request.");
    } finally {
      setBusy(false);
    }
  };

  const handleDeclineRequest = async (requesterId) => {
    setBusy(true);
    try {
      await declineFriendRequest(requesterId, getToken());
      setIncomingRequests((prev) =>
        prev.filter((r) => String(r._id) !== String(requesterId))
      );
      alert("❌ Friend request declined.");
    } catch (err) {
      console.error("Failed to decline request:", err);
      alert("❌ Failed to decline request.");
    } finally {
      setBusy(false);
    }
  };

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
      {/* MAIN PROFILE CARD */}
      <div className="profile-card main">
        {/* <Avatar src={profile.avatar} alt="Profile" className="profile-avatar" /> */}
        <Avatar
          src={getSafeAvatarUrl(profile.avatar, profile._id)}
          alt="Profile"
          className="profile-avatar"
        />
        <h2>
          {profile.firstName} {profile.lastName}
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

        {/* Buttons */}
        {authUser?._id !== profile._id && (
          <div className="profile-actions">
            {isFriend ? (
              <>
                <span className="connected-label">✅ Connected</span>
                <button
                  onClick={() => handleMessageUser(profile._id)}
                  className="btn btn-message"
                >
                  💬 Message
                </button>
              </>
            ) : requestSent ? (
              <span className="pending-label">⏳ Request pending</span>
            ) : (
              <button
                onClick={handleSendRequest}
                disabled={requestSent || busy}
                className="btn btn-add"
              >
                ➕ Connect
              </button>
            )}
          </div>
        )}
      </div>

      {/* INCOMING REQUESTS */}
      {authUser?._id === profile._id && (
        <div className="profile-card">
          <h3>Connection Requests</h3>
          {incomingRequests.length === 0 ? (
            <p>No connection requests yet.</p>
          ) : (
            <ul className="requests-list">
              {incomingRequests.map((r) => (
                <li key={r._id} className="friend-request-item">
                  {/* <Avatar
                    src={getSafeAvatarUrl(r.avatar)}
                    alt={`${r.firstName} ${r.lastName}`}
                    className="connection-avatar"
                  /> */}
                  <Avatar
                    src={getSafeAvatarUrl(r.avatar, r._id)}
                    alt={`${r.firstName} ${r.lastName}`}
                    className="connection-avatar"
                  />
                  <span>
                    {r.firstName} {r.lastName}
                  </span>
                  <div className="request-buttons">
                    <button
                      onClick={() => handleAcceptRequest(r._id)}
                      className="accept-btn"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleDeclineRequest(r._id)}
                      className="reject-btn"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* CONNECTIONS */}
      <div className="profile-card">
        <h3>
          <Users size={18} /> Connections
        </h3>
        {connections.length === 0 ? (
          <p>No connections yet.</p>
        ) : (
          <ul className="connections-list">
            {connections.map((c) => (
              <li
                key={c._id}
                className="connection-item"
                onClick={() => navigate(`/profile/${c._id}`)}
              >
                <div className="connection-left">
                  {/* <Avatar
                    src={c.profileImage}
                    alt={`${c.firstName} ${c.lastName}`}
                    className="connection-avatar"
                  /> */}
                  <Avatar
                    src={getSafeAvatarUrl(c.profileImage, c._id)}
                    alt={`${c.firstName} ${c.lastName}`}
                    className="connection-avatar"
                  />
                  <span className="connection-name">
                    {c.firstName} {c.lastName}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevents triggering profile navigation
                    handleMessageUser(c._id);
                  }}
                  className="message-btn"
                >
                  Message
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* POTENTIAL CONNECTIONS */}
      {authUser?._id === profile._id && (
        <div className="profile-card">
          <h3>
            <Users size={18} /> People You May Know
          </h3>
          <PotentialConnections />
        </div>
      )}

      {/* HELP SECTIONS */}
      <div className="profile-card">
        <h3>
          <HeartHandshake size={18} /> Help Sections
        </h3>
        <HelpSections
          canHelpWith={profile.canHelpWith}
          needHelpWith={profile.needHelpWith}
        />
      </div>

      {/* EDIT PROFILE */}
      {authUser?._id === profile._id && (
        <div className="profile-actions">
          <Link to="/edit-profile">
            <button className="btn btn-edit">✏️ Edit Profile</button>
          </Link>
        </div>
      )}
    </div>
  );
}
