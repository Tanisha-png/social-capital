// import { useState } from 'react';
// import { useNavigate } from 'react-router';
// import { useAuth } from "../../context/AuthContext";
// import * as postService from '../../services/postService';

// export default function NewPostPage() {
//   const [content, setContent] = useState('');

//   const navigate = useNavigate();

//   async function handleSubmit(evt) {
//     evt.preventDefault();
//     try {
//       const post = await postService.create(content);
//       navigate('/posts');
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   return (
//     <>
//       <h2>New Post</h2>
//       <form autoComplete="off" onSubmit={handleSubmit}>
//         <label>Post Content</label>
//         <input
//           type="text"
//           value={content}
//           onChange={(evt) => setContent(evt.target.value)}
//           required
//         />
//         <button type="submit">ADD POST</button>
//       </form>
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function NewPostPage() {
  const { user } = useAuth();
  const [content, setContent] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;

    const token = localStorage.getItem("token");
    await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    setContent(""); // clear form
    alert("Post created!");
  }

  if (!user) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post..."
      />
      <button type="submit">Post</button>
    </form>
  );
}

