import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listLeafletPosts, getRkey, formatDate } from "../services/atproto";

function Blog() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listLeafletPosts()
      .then((records) => {
        setPosts(records);
        setLoading(false);
      })
      .catch(() => {
        setError("Couldn't load posts right now.");
        setLoading(false);
      });
  }, []);

  const goToPost = (postId) => {
    navigate(`/blog/${postId}`);
  };

  const handleCardKeyDown = (event, postId) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToPost(postId);
    }
  };

  return (
    <div className="blog-container">
      <section className="section blog-header">
        <h2>blog posts</h2>
        <p className="blog-description">
          mostly things i&apos;m writing about technology
        </p>
      </section>

      <section className="blog-posts-section">
        {loading ? (
          <p style={{ color: "var(--color-muted)" }}>loading...</p>
        ) : error ? (
          <p style={{ color: "var(--color-muted)" }}>{error}</p>
        ) : posts.length === 0 ? (
          <p style={{ color: "var(--color-muted)" }}>no posts yet</p>
        ) : (
          <div className="blog-grid">
            {posts.map((record) => {
              const rkey = getRkey(record.uri);
              const value = record.value ?? {};
              const title = value.title ?? "untitled";
              const description = value.description ?? "";
              const date = value.publishedAt ? formatDate(value.publishedAt) : "";

              return (
                <article
                  key={record.uri}
                  className="blog-post"
                  role="button"
                  tabIndex={0}
                  onClick={() => goToPost(rkey)}
                  onKeyDown={(event) => handleCardKeyDown(event, rkey)}
                  aria-label={`Open post: ${title}`}
                >
                  <div className="post-header">
                    <div className="post-meta">
                      <span className="post-date">{date}</span>
                    </div>
                    <h3 className="post-title">{title}</h3>
                    {description && (
                      <p className="post-excerpt">{description}</p>
                    )}
                    <div className="post-link-row">
                      <button
                        className="post-link"
                        type="button"
                        aria-label={`Read ${title}`}
                        onClick={() => goToPost(rkey)}
                      >
                        read post
                      </button>
                      <span className="post-link-hint">shareable url</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Blog;
