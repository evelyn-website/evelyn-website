import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBlogPostById } from "../data/blogPosts";

function isSafeHref(href) {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("/") ||
    href.startsWith("#")
  );
}

function renderInlineMarkdown(text, keyPrefix) {
  const nodes = [];
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;
  let partIndex = 0;

  while ((match = linkPattern.exec(text)) !== null) {
    const [fullMatch, label, rawHref] = match;
    const matchIndex = match.index;

    if (matchIndex > lastIndex) {
      nodes.push(text.slice(lastIndex, matchIndex));
    }

    const href = rawHref.trim();
    if (isSafeHref(href)) {
      const isExternal = href.startsWith("http://") || href.startsWith("https://");
      nodes.push(
        <a
          key={`${keyPrefix}-link-${partIndex}`}
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {label}
        </a>
      );
    } else {
      nodes.push(fullMatch);
    }

    lastIndex = matchIndex + fullMatch.length;
    partIndex += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function renderMarkdownBlocks(text) {
  const lines = text.split("\n");
  const blocks = [];
  let paragraphLines = [];
  let listItems = [];

  const flushParagraph = () => {
    if (!paragraphLines.length) {
      return;
    }
    blocks.push({
      type: "paragraph",
      content: paragraphLines.join(" ").trim(),
    });
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listItems.length) {
      return;
    }
    blocks.push({ type: "list", items: [...listItems] });
    listItems = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }

    if (trimmed.startsWith("# ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h1", content: trimmed.replace(/^# /, "") });
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h2", content: trimmed.replace(/^## /, "") });
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h3", content: trimmed.replace(/^### /, "") });
      return;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph();
      listItems.push(trimmed.replace(/^- /, ""));
      return;
    }

    flushList();
    paragraphLines.push(trimmed);
  });

  flushParagraph();
  flushList();

  return blocks.map((block, index) => {
    if (block.type === "h1") {
      return (
        <h1 key={`${block.type}-${index}`}>
          {renderInlineMarkdown(block.content, `${block.type}-${index}`)}
        </h1>
      );
    }
    if (block.type === "h2") {
      return (
        <h2 key={`${block.type}-${index}`}>
          {renderInlineMarkdown(block.content, `${block.type}-${index}`)}
        </h2>
      );
    }
    if (block.type === "h3") {
      return (
        <h3 key={`${block.type}-${index}`}>
          {renderInlineMarkdown(block.content, `${block.type}-${index}`)}
        </h3>
      );
    }
    if (block.type === "list") {
      return (
        <ul key={`${block.type}-${index}`}>
          {block.items.map((item, itemIndex) => (
            <li key={`item-${itemIndex}`}>
              {renderInlineMarkdown(item, `${block.type}-${index}-${itemIndex}`)}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={`${block.type}-${index}`}>
        {renderInlineMarkdown(block.content, `${block.type}-${index}`)}
      </p>
    );
  });
}

function BlogPost() {
  const { postId } = useParams();
  const [postBody, setPostBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState("idle");

  const post = useMemo(() => getBlogPostById(postId), [postId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [postId]);

  useEffect(() => {
    if (!post) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    fetch(post.file)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Could not load blog post.");
        }
        return res.text();
      })
      .then((text) => {
        if (!cancelled) {
          setPostBody(text);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load this post right now.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [post]);

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

  if (!post) {
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
        <h2>{post.title}</h2>
        <p className="post-date">{post.date}</p>
        <div className="article-content">
          {loading ? (
            <p>loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            renderMarkdownBlocks(postBody)
          )}
        </div>
      </section>
    </div>
  );
}

export default BlogPost;
