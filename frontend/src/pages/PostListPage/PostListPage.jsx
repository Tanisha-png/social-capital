import { useState, useEffect } from 'react';
import * as postService from '../../services/postService';
import './PostListPage.css';
import PostItem from '../../components/PostItem/PostItem';
import { useAuth } from "../../context/AuthContext";

export default function PostListPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  // useEffect(() => {
  //   async function fetchPosts() {
  //     const posts = await postService.index();
  //     setPosts(posts);
  //   }
  //   fetchPosts();
  // }, []);

  useEffect(() => {
    fetch("/api/posts", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ content }),
    });
    const newPost = await res.json();
    setPosts([newPost, ...posts]);
    setContent("");
  };

  const postItems = posts.map((p) => <PostItem key={p._id} post={p} />);

  //   return (
  //     <>
  //       <h1>Post List</h1>
  //       <section className="post-item-container">{postItems}</section>
  //     </>
  //   );
  // }

  return (
    <div>
      <h2>Posts</h2>
      <form onSubmit={handleSubmit}>
        <input value={content} onChange={(e) => setContent(e.target.value)} />
        <button type="submit">Post</button>
      </form>
      <ul>
        {posts.map((p) => (
          <li key={p._id}>
            <b>{p.author?.name}</b>: {p.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
