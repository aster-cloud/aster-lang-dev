---
title: Blog
description: Product updates, deep dives, and design notes from the Aster Lang team.
aside: false
---

# Blog

Product updates, language deep dives, and design notes. **[RSS feed](/blog/feed.xml)**.

<script setup>
import { data as posts } from './posts.data'
</script>

<div v-for="post in posts" :key="post.url" class="blog-entry">
  <h2 class="blog-title"><a :href="post.url">{{ post.title }}</a></h2>
  <p class="blog-meta">
    <time :datetime="post.date">{{ post.dateText }}</time>
    <span v-if="post.author"> · {{ post.author }}</span>
    <span v-if="post.tags && post.tags.length"> · {{ post.tags.join(' · ') }}</span>
  </p>
  <p class="blog-description">{{ post.description }}</p>
</div>

<div v-if="!posts || posts.length === 0" class="blog-empty">
  <p>No posts yet. Subscribe to the <a href="/blog/feed.xml">RSS feed</a> to know when the first one ships.</p>
</div>

<style scoped>
.blog-entry {
  padding: 24px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
.blog-entry:last-child {
  border-bottom: none;
}
.blog-title {
  margin: 0 0 8px;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.blog-title a {
  text-decoration: none;
  color: var(--vp-c-text-1);
}
.blog-title a:hover {
  color: var(--vp-c-brand-1);
}
.blog-meta {
  margin: 0 0 12px;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
}
.blog-description {
  margin: 0;
  color: var(--vp-c-text-2);
}
.blog-empty {
  padding: 48px 0;
  text-align: center;
  color: var(--vp-c-text-3);
}
</style>
