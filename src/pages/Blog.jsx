import { useNavigate } from "react-router-dom";
import { blogPosts } from "../data/blogPosts";

function Blog() {
  const navigate = useNavigate();

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
          mostly things i'm wrting about technology
        </p>
      </section>

      <section className="blog-posts-section">
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="blog-post"
              role="button"
              tabIndex={0}
              onClick={() => goToPost(post.id)}
              onKeyDown={(event) => handleCardKeyDown(event, post.id)}
              aria-label={`Open post: ${post.title}`}
            >
              <div className="post-header">
                <div className="post-meta">
                  <span className="post-date">{post.date}</span>
                </div>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{post.excerpt}</p>
                <div className="post-link-row">
                  <button
                    className="post-link"
                    type="button"
                    aria-label={`Read ${post.title}`}
                    onClick={() => goToPost(post.id)}
                  >
                    read post
                  </button>
                  <span className="post-link-hint">shareable url</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Blog;
