const HANDLE = "evelynwebsite.com";
const PDS = "https://bsky.social";
const BSKY = "https://public.api.bsky.app";

export function getRkey(atUri) {
  return atUri.split("/").pop();
}

export function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export async function listLeafletPosts() {
  const url = `${PDS}/xrpc/com.atproto.repo.listRecords?repo=${HANDLE}&collection=site.standard.document&limit=50`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`listLeafletPosts failed: ${res.status}`);
  const data = await res.json();
  const records = data.records ?? [];
  return records.sort((a, b) => {
    const aDate = a.value?.publishedAt ?? "";
    const bDate = b.value?.publishedAt ?? "";
    return bDate.localeCompare(aDate);
  });
}

export async function getLeafletPost(rkey) {
  const url = `${PDS}/xrpc/com.atproto.repo.getRecord?repo=${HANDLE}&collection=site.standard.document&rkey=${encodeURIComponent(rkey)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = new Error(`getLeafletPost failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

const MAX_FEED_PAGES = 60; // 60 × 100 = 6000 posts

async function fetchWithBackoff(url, retries = 3) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url);
    if (res.status !== 429) return res;
    if (attempt === retries) return res;
    const retryAfter = parseInt(res.headers.get("Retry-After") ?? "0", 10);
    const delay = retryAfter > 0 ? retryAfter * 1000 : 1000 * 2 ** attempt;
    await new Promise((r) => setTimeout(r, delay));
  }
}

export async function findBlueskyThread(rkey) {
  const targetPath = `evelynwebsite.com/blog/${rkey}`;
  let cursor;
  let page = 0;

  do {
    const params = new URLSearchParams({ actor: HANDLE, limit: "100" });
    if (cursor) params.set("cursor", cursor);
    const url = `${BSKY}/xrpc/app.bsky.feed.getAuthorFeed?${params}`;
    const res = await fetchWithBackoff(url);
    if (!res.ok) return null;
    const data = await res.json();
    const feed = data.feed ?? [];

    for (const item of feed) {
      const post = item.post;
      if (!post) continue;
      for (const facet of post.record?.facets ?? []) {
        for (const feature of facet.features ?? []) {
          if (
            feature.$type === "app.bsky.richtext.facet#link" &&
            feature.uri?.includes(targetPath)
          ) {
            return post.uri;
          }
        }
      }
    }

    cursor = data.cursor;
    page++;
  } while (cursor && page < MAX_FEED_PAGES);

  return null;
}

export async function getPostThread(atUri) {
  const url = `${BSKY}/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(atUri)}&depth=10`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`getPostThread failed: ${res.status}`);
  return res.json();
}
