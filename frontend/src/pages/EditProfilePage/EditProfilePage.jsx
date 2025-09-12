// import React, { useState, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
// import * as authService from "../../services/authService";
// import "../EditProfilePage/EditProfilePage.css";
// import "../ProfilePage/ProfilePage.css"; // reuse ProfilePage styles

// export default function EditProfilePage() {
//     const { user, login } = useAuth();
//     const [formData, setFormData] = useState({
//         profileImage: "",
//         firstName: "",
//         lastName: "",
//         bio: "",
//         occupation: "",
//         education: "",
//         canHelpWith: "",
//         needHelpWith: "",
//     });
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         async function fetchProfile() {
//         if (!user) return;
//         try {
//             const token = localStorage.getItem("token");
//             const profile = await authService.getProfile(token);

//             setFormData({
//             profileImage: profile.profileImage || "",
//             firstName: profile.firstName || "",
//             lastName: profile.lastName || "",
//             bio: profile.bio || "",
//             occupation: profile.occupation || "",
//             education: profile.education || "",
//             canHelpWith: profile.canHelpWith?.join(", ") || "",
//             needHelpWith: profile.needHelpWith?.join(", ") || "",
//             });
//         } catch (err) {
//             console.error("Failed to load profile:", err);
//         } finally {
//             setLoading(false);
//         }
//         }
//         fetchProfile();
//     }, [user]);

//     function handleChange(e) {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     }

//     async function handleSubmit(e) {
//         e.preventDefault();
//         try {
//         const token = localStorage.getItem("token");
//         const updated = await authService.updateProfile(token, {
//             ...formData,
//             canHelpWith: formData.canHelpWith.split(",").map((s) => s.trim()),
//             needHelpWith: formData.needHelpWith.split(",").map((s) => s.trim()),
//         });

//         // Update context with new user data
//         login(updated, token);
//         alert("Profile updated!");
//         } catch (err) {
//         console.error("Failed to update profile:", err);
//         alert("Profile update failed");
//         }
//     }

//     if (!user || loading) return <p>Loading form...</p>;

//     return (
//         <form className="profile-form" onSubmit={handleSubmit}>
//         <label>Profile Image URL</label>
//         <input
//             type="text"
//             name="profileImage"
//             value={formData.profileImage}
//             onChange={handleChange}
//         />

//         <label>First Name</label>
//         <input
//             type="text"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleChange}
//         />

//         <label>Last Name</label>
//         <input
//             type="text"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleChange}
//         />

//         <label>Bio</label>
//         <textarea name="bio" value={formData.bio} onChange={handleChange} />

//         <label>Occupation</label>
//         <input
//             type="text"
//             name="occupation"
//             value={formData.occupation}
//             onChange={handleChange}
//         />

//         <label>Education</label>
//         <input
//             type="text"
//             name="education"
//             value={formData.education}
//             onChange={handleChange}
//         />

//         <label>I can help with (comma separated)</label>
//         <input
//             type="text"
//             name="canHelpWith"
//             value={formData.canHelpWith}
//             onChange={handleChange}
//         />

//         <label>I need help with (comma separated)</label>
//         <input
//             type="text"
//             name="needHelpWith"
//             value={formData.needHelpWith}
//             onChange={handleChange}
//         />

//         <button type="submit" className="save-button">Save Profile</button>
//         </form>
//     );
// }

// import React, { useState, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
// import * as authService from "../../services/authService";
// import "../ProfilePage/ProfilePage.css";
// import "./EditProfilePage.css";

// export default function EditProfilePage() {
//     const { user, login } = useAuth();
//     const [formData, setFormData] = useState({
//         profileImage: "",
//         firstName: "",
//         lastName: "",
//         bio: "",
//         occupation: "",
//         education: "",
//         canHelpWith: "",
//         needHelpWith: "",
//     });
//     const [loading, setLoading] = useState(true);
//     const [updating, setUpdating] = useState(false);

//     useEffect(() => {
//         async function fetchProfile() {
//         if (!user) return;
//         try {
//             const token = localStorage.getItem("token");
//             const profile = await authService.getProfile(token);

//             setFormData({
//             profileImage: profile.profileImage || "",
//             firstName: profile.firstName || "",
//             lastName: profile.lastName || "",
//             bio: profile.bio || "",
//             occupation: profile.occupation || "",
//             education: profile.education || "",
//             canHelpWith: profile.canHelpWith?.join(", ") || "",
//             needHelpWith: profile.needHelpWith?.join(", ") || "",
//             });
//         } catch (err) {
//             console.error("Failed to load profile:", err);
//             alert("Failed to load profile.");
//         } finally {
//             setLoading(false);
//         }
//         }
//         fetchProfile();
//     }, [user]);

//     function handleChange(e) {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     }

//     async function handleSubmit(e) {
//         e.preventDefault();
//         setUpdating(true);

//         try {
//         const token = localStorage.getItem("token");
//         const updated = await authService.updateProfile(
//             {
//             ...formData,
//             canHelpWith: formData.canHelpWith.split(",").map((s) => s.trim()),
//             needHelpWith: formData.needHelpWith.split(",").map((s) => s.trim()),
//             },
//             token
//         );

//         login(updated, token);
//         alert("Profile updated!");
//         } catch (err) {
//         console.error("Failed to update profile:", err);
//         alert(err.message);
//         } finally {
//         setUpdating(false);
//         }
//     }

//     if (!user || loading) return <p>Loading form...</p>;

//     return (
//         <form className="profile-form" onSubmit={handleSubmit}>
//             <label>Profile Image URL</label>
//             <input
//             type="text"
//             name="profileImage"
//             placeholder="Profile image URL"
//             value={formData.profileImage}
//             onChange={handleChange}
//             />

//             <label>First Name</label>
//             <input
//             type="text"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleChange}
//             />

//             <label>Last Name</label>
//             <input
//             type="text"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleChange}
//             />

//             <label>Bio</label>
//             <textarea name="bio" value={formData.bio} onChange={handleChange} />

//             <label>Occupation</label>
//             <input
//             type="text"
//             name="occupation"
//             value={formData.occupation}
//             onChange={handleChange}
//             />

//             <label>Education</label>
//             <input
//             type="text"
//             name="education"
//             value={formData.education}
//             onChange={handleChange}
//             />

//             <label>I can help with (comma separated)</label>
//             <input
//             type="text"
//             name="canHelpWith"
//             value={formData.canHelpWith}
//             onChange={handleChange}
//             />

//             <label>I need help with (comma separated)</label>
//             <input
//             type="text"
//             name="needHelpWith"
//             value={formData.needHelpWith}
//             onChange={handleChange}
//             />

//             <button type="submit" className="save-button" disabled={updating}>
//             {updating ? "Saving..." : "Save Profile"}
//             </button>
//         </form>
//     );
// }

// import React, { useState, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
// import * as authService from "../../services/authService";
// import { useNavigate } from "react-router-dom";

// export default function EditProfilePage() {
//     const { user } = useAuth();
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         avatar: "",
//         firstName: "",
//         lastName: "",
//         bio: "",
//         occupation: "",
//         education: "",
//     });

    

//     useEffect(() => {
//         async function fetchProfile() {
//         try {
//             const token = localStorage.getItem("token");
//             const profileData = await authService.getProfile(token);
//             if (profileData) {
//             setFormData({
//                 profileImage: profileData.profileImage || "",
//                 firstName: profileData.firstName || "",
//                 lastName: profileData.lastName || "",
//                 bio: profileData.bio || "",
//                 occupation: profileData.occupation || "",
//                 education: profileData.education || "",
//             });
//             }
//         } catch (err) {
//             console.error("Error loading profile:", err);
//         }
//         }
//         fetchProfile();
//     }, []);

//     const handleChange = (e) => {
//         setFormData({
//         ...formData,
//         [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//         const token = localStorage.getItem("token");
//         await authService.updateProfile(token, formData);
//         navigate("/profile"); // go back to profile after saving
//         } catch (err) {
//         console.error("Failed to update profile:", err);
//         alert("Failed to update profile. Try again.");
//         }
//     };

//     return (
//         <div>
//             <h2>Edit Profile</h2>
//             <form onSubmit={handleSubmit}>
//             <div>
//                 <label>Profile Image URL</label>
//                 <input
//                 type="text"
//                 name="avatar"
//                 value={formData.avatar || ""}
//                 onChange={handleChange}
//                 />
//                 {formData.profileImage && (
//                 <img
//                     src={formData.profileImage}
//                     alt="Preview"
//                     style={{ width: "100px", height: "100px", marginTop: "10px" }}
//                 />
//                 )}
//             </div>
//             <div>
//                 <label>First Name</label>
//                 <input
//                 type="text"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 />
//             </div>
//             <div>
//                 <label>Last Name</label>
//                 <input
//                 type="text"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 />
//             </div>
//             <div>
//                 <label>Bio</label>
//                 <textarea name="bio" value={formData.bio} onChange={handleChange} />
//             </div>
//             <div>
//                 <label>Occupation</label>
//                 <input
//                 type="text"
//                 name="occupation"
//                 value={formData.occupation}
//                 onChange={handleChange}
//                 />
//             </div>
//             <div>
//                 <label>Education</label>
//                 <input
//                 type="text"
//                 name="education"
//                 value={formData.education}
//                 onChange={handleChange}
//                 />
//             </div>
//             <button type="submit">Save Profile</button>
//             </form>
//         </div>
//     );
// }

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import * as authService from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function EditProfilePage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    avatar: "",
    firstName: "",
    lastName: "",
    bio: "",
    occupation: "",
    education: "",
    canHelpWith: "",
    needHelpWith: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      try {
        const token = localStorage.getItem("token");
        const profile = await authService.getProfile(token);

        setFormData({
          avatar: profile.avatar || "",
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          bio: profile.bio || "",
          occupation: profile.occupation || "",
          education: profile.education || "",
          canHelpWith: Array.isArray(profile.canHelpWith)
            ? profile.canHelpWith.join(", ")
            : "",
          needHelpWith: Array.isArray(profile.needHelpWith)
            ? profile.needHelpWith.join(", ")
            : "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      // Cleanly convert comma-separated strings into arrays, ignoring empty strings
      const updatedProfile = {
        ...formData,
        canHelpWith: formData.canHelpWith
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        needHelpWith: formData.needHelpWith
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const updatedUser = await authService.updateProfile(updatedProfile);

      // Ensure _id exists for posts context
      if (!updatedUser._id && updatedUser.id) {
        updatedUser._id = updatedUser.id;
      }

      login(updatedUser, token); // update AuthContext
      navigate("/profile");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile. Try again.");
    }
  };

  if (!user || loading) return <p>Loading form...</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Profile Image URL</label>
          <input
            type="text"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="Enter image URL"
          />
          {formData.avatar && (
            <img
              src={formData.avatar}
              alt="Preview"
              style={{
                width: "100px",
                height: "100px",
                marginTop: "10px",
                borderRadius: "50%",
              }}
            />
          )}
        </div>

        <div>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>
            Bio:
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
            />
          </label>
        </div>

        <div>
          <label>Occupation</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Education</label>
          <input
            type="text"
            name="education"
            value={formData.education}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>I can help with (comma separated)</label>
          <input
            type="text"
            name="canHelpWith"
            value={formData.canHelpWith}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>I need help with (comma separated)</label>
          <input
            type="text"
            name="needHelpWith"
            value={formData.needHelpWith}
            onChange={handleChange}
          />
        </div>

        <button type="submit" style={{ marginTop: "20px" }}>
          Save Profile
        </button>
      </form>
    </div>
  );
}


