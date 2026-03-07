import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getLeafletPost, formatDate } from "../services/atproto";
import LeafletRenderer from "../components/LeafletRenderer";
import BlueskyComments from "../components/BlueskyComments";

function BlogPost() {
  const { postId } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copyState, setCopyState] = useState("idle");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [postId]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setRecord(null);

    getLeafletPost(postId)
      .then((data) => {
        if (!cancelled) {
          setRecord(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          if (err.status === 400 || err.status === 404) {
            setNotFound(true);
          }
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [postId]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  if (loading) {
    return (
      <div className="blog-container">
        <section className="section blog-article">
          <p>loading...</p>
        </section>
      </div>
    );
  }

  if (notFound || !record) {
    return (
      <section className="section blog-article">
        <h2>post not found</h2>
        <p>That post does not exist yet.</p>
        <Link to="/blog" className="post-link">
          back to blog list
        </Link>
      </section>
    );
  }

  const value = record.value ?? {};
  const title = value.title ?? "untitled";
  const date = value.publishedAt ? formatDate(value.publishedAt) : "";

  return (
    <div className="blog-container">
      <section className="section blog-article">
        <div className="blog-post-actions">
          <Link to="/blog" className="post-link">
            ← all posts
          </Link>
          <button className="post-link post-link-button" onClick={copyLink}>
            {copyState === "copied"
              ? "link copied"
              : copyState === "error"
              ? "copy failed"
              : "copy link"}
          </button>
        </div>
        <h2>{title}</h2>
        {date && <p className="post-date">{date}</p>}
        <div className="article-content">
          <LeafletRenderer doc={value} />
        </div>
        <BlueskyComments postRkey={postId} />
      </section>
    </div>
  );
}

export default BlogPost;
