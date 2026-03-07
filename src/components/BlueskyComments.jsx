import { useEffect, useState } from "react";
import { findBlueskyThread, getPostThread } from "../services/atproto";

function relativeTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function atUriToUrl(atUri) {
  // at://did:plc:.../app.bsky.feed.post/rkey -> https://bsky.app/profile/did/post/rkey
  const parts = atUri.replace("at://", "").split("/");
  const did = parts[0];
  const rkey = parts[parts.length - 1];
  return `https://bsky.app/profile/${did}/post/${rkey}`;
}

function Reply({ reply, depth = 0 }) {
  const post = reply?.post;
  if (!post) return null;

  const author = post.author ?? {};
  const record = post.record ?? {};
  const text = record.text ?? "";
  const postUrl = atUriToUrl(post.uri);
  const timestamp = record.createdAt ?? "";
  const nestedReplies = reply.replies ?? [];

  if (!text && nestedReplies.length === 0) return null;

  return (
    <div className={`bsky-reply${depth > 0 ? " bsky-reply--nested" : ""}`}>
      <div className="bsky-reply-header">
        {author.avatar && (
          <img
            className="bsky-avatar"
            src={author.avatar}
            alt={author.displayName ?? author.handle ?? ""}
            width={36}
            height={36}
          />
        )}
        <div className="bsky-author-info">
          <span className="bsky-display-name">
            {author.displayName ?? author.handle}
          </span>
          <span className="bsky-handle">@{author.handle}</span>
        </div>
        <a
          className="bsky-timestamp"
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {relativeTime(timestamp)}
        </a>
      </div>
      {text && <p className="bsky-reply-text">{text}</p>}
      {nestedReplies.length > 0 && (
        <div className="bsky-nested-replies">
          {nestedReplies.map((nested, i) => (
            <Reply key={nested?.post?.uri ?? i} reply={nested} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function BlueskyComments({ postRkey }) {
  const [replies, setReplies] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const uri = await findBlueskyThread(postRkey);
        if (!uri || cancelled) {
          if (!cancelled) setLoading(false);
          return;
        }
        const thread = await getPostThread(uri);
        if (cancelled) return;
        const threadReplies = thread.thread?.replies ?? [];
        setReplies(threadReplies);
      } catch {
        // silently hide on error
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [postRkey]);

  if (loading || !replies || replies.length === 0) return null;

  return (
    <div className="bsky-comments">
      <h3 className="bsky-comments-heading">comments from bluesky</h3>
      <div className="bsky-replies-list">
        {replies.map((reply, i) => (
          <Reply key={reply?.post?.uri ?? i} reply={reply} />
        ))}
      </div>
    </div>
  );
}

export default BlueskyComments;
