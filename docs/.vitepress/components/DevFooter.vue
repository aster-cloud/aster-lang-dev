<script setup lang="ts">
import { computed } from 'vue'
import { useUiStrings } from '../i18n/ui'

const strings = useUiStrings()
const footer = computed(() => strings.value.footer)
</script>

<template>
  <footer class="dev-footer">
    <div class="container">
      <div class="brand-row">
        <span class="wordmark">{{ footer.brand }}</span>
        <p class="tagline">{{ footer.tagline }}</p>
      </div>
      <nav class="link-columns" aria-label="Footer">
        <div
          v-for="col in footer.columns"
          :key="col.heading"
          class="column"
        >
          <h4>{{ col.heading }}</h4>
          <ul>
            <li v-for="link in col.links" :key="link.href">
              <a :href="link.href">{{ link.text }}</a>
            </li>
          </ul>
        </div>
      </nav>
      <div class="meta-row">
        <span class="license">{{ footer.license }}</span>
        <span class="copyright">{{ footer.copyright }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Always-dark footer block (matches cloud landing). Uses raw zinc steps
 * since these don't reverse on light/dark toggle — the footer should
 * stay dark in both modes (intentional design choice; the dark band
 * provides closing contrast at the end of the page). */
.dev-footer {
  background: var(--aster-color-zinc-900, #18181b);
  color: var(--aster-color-zinc-400, #a1a1aa);
  padding: 4rem 1.5rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.brand-row {
  margin-bottom: 2.5rem;
}

.wordmark {
  font-family: var(--aster-font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.02em;
}

.tagline {
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
  color: var(--aster-color-zinc-500, #71717a);
}

.link-columns {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2.5rem;
  margin-bottom: 3rem;
}

@media (max-width: 960px) {
  .link-columns {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .link-columns {
    grid-template-columns: 1fr;
  }
}

h4 {
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1rem 0;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 0.5rem;
}

a {
  color: var(--aster-color-zinc-400, #a1a1aa);
  text-decoration: none;
  transition: color 0.15s;
}

a:hover {
  color: #ffffff;
}

a:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
  border-radius: 2px;
}

.meta-row {
  border-top: 1px solid var(--aster-color-zinc-800, #27272a);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--aster-color-zinc-500, #71717a);
}

@media (max-width: 640px) {
  .meta-row {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
