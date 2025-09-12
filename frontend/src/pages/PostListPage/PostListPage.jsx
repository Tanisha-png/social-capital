
// import React, { useState, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";

// export default function PostListPage() {
//   const { user } = useAuth();
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     async function fetchPosts() {
//       if (!user) return;
//       const token = localStorage.getItem("token");
//       const res = await fetch("/api/posts", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setPosts(data);
//     }
//     fetchPosts();
//   }, [user]);

//   if (!user) return <p>Loading posts...</p>;

//   const handleDelete = async (postId) => {
//     const token = localStorage.getItem("token");
//     await fetch(`/api/posts/${postId}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setPosts(posts.filter((p) => p._id !== postId));
//   };

//   return (
//     <div>
//       <h2>Posts</h2>
//       {posts.map((post) => (
//         <div key={post._id} className="p-3 border-b">
//           <p>{post.content}</p>

//           {post.user === user.id && (
//             <div className="mt-2 flex gap-2">
//               <button
//                 className="px-2 py-1 bg-yellow-400 text-white rounded"
//                 onClick={() => console.log("Edit post", post._id)}
//               >
//                 Edit
//               </button>
//               <button
//                 className="px-2 py-1 bg-red-500 text-white rounded"
//                 onClick={() => handleDelete(post._id)}
//               >
//                 Delete
//               </button>
//             </div>
//           )}
//           {/* Reply button */}
//           <button
//             className="px-2 py-1 bg-green-500 text-white rounded"
//             onClick={() => handleReply(post._id)}
//           >
//             Reply
//           </button>

//           {/* Like button */}
//           <button
//             className="px-2 py-1 bg-blue-500 text-white rounded"
//             onClick={() => handleLike(post._id)}
//           >
//             Like ({post.likes.length})
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// const token = localStorage.getItem("token");

// const res = await fetch("http://localhost:3000/api/posts", {
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   },
// });

// if (!res.ok) {
//   const text = await res.text();
//   throw new Error(`Failed to fetch posts: ${text}`);
// }

// const data = await res.json();
// setPosts(data);

// export default function PostListPage() {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const res = await fetch("/api/posts");
//         const data = await res.json();
//         setPosts(data);
//       } catch (err) {
//         console.error("Error fetching posts:", err);
//       }
//     };
//     fetchPosts();
//   }, []);

//   return (
//     <div className="post-list">
//       <h2>Posts</h2>
//       {posts.length === 0 ? (
//         <p>No posts yet.</p>
//       ) : (
//         <ul>
//           {posts.map((post) => (
//             <li key={post._id} className="post-card">
//               <p>{post.content}</p>
//               <small>
//                 By {post.author?.firstName} {post.author?.lastName}
//               </small>
//               <br />
//               {/* ✅ Link to PostDetailPage */}
//               <Link to={`/posts/${post._id}`} className="post-link">
//                 View Details
//               </Link>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NewPostPage from "../NewPostPage/NewPostPage";
import "./PostListPage.css";

export default function PostListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch all posts
  const fetchPosts = async () => {
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/posts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch posts: ${text}`);
      }

      const data = await res.json();

      // Ensure author exists
      const postsWithAuthor = data.map((post) => ({
        ...post,
        author: post.author || { firstName: "Unknown", lastName: "" },
      }));

      setPosts(postsWithAuthor);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handler to prepend new post
  const handleNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="post-list">
      <h2 className="feed-title">Posts</h2>

      {/* New post form */}
      <NewPostPage onNewPost={handleNewPost} />

      {posts.length === 0 ? (
        <p className="no-posts">No posts yet.</p>
      ) : (
        <ul className="posts-feed">
          {posts.map((post) => (
            <li key={post._id} className="post-card">
              <p className="post-content">{post.content}</p>
              <small className="post-author">
                By {post.author.firstName} {post.author.lastName}
              </small>
              <Link to={`/posts/${post._id}`} className="post-link">
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
