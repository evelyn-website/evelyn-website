export const blogPosts = [
  {
    id: "chat-app-encryption",
    date: "February 2026",
    title: "How encryption works for my group messaging app",
    excerpt: "A technical walkthrough of envelope encryption in my app.",
    file: "/blog/chat-app-encryption.md",
  },
];

export function getBlogPostById(postId) {
  return blogPosts.find((post) => post.id === postId);
}
