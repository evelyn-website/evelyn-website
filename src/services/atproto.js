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

export async function findBlueskyThread(rkey) {
  const targetPath = `evelynwebsite.com/blog/${rkey}`;
  const url = `${BSKY}/xrpc/app.bsky.feed.getAuthorFeed?actor=${HANDLE}&limit=50`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const feed = data.feed ?? [];

  for (const item of feed) {
    const post = item.post;
    if (!post) continue;
    const facets = post.record?.facets ?? [];
    for (const facet of facets) {
      const features = facet.features ?? [];
      for (const feature of features) {
        if (
          feature.$type === "app.bsky.richtext.facet#link" &&
          feature.uri?.includes(targetPath)
        ) {
          return post.uri;
        }
      }
    }
  }
  return null;
}

export async function getPostThread(atUri) {
  const url = `${BSKY}/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(atUri)}&depth=10`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`getPostThread failed: ${res.status}`);
  return res.json();
}
