<script setup lang="ts">
import { computed } from 'vue'
import { useUiStrings } from '../i18n/ui'

// Bullet-list version of the hero tagline. Renders six technical claims
// as a scannable list — sits in #home-hero-info-after slot above the
// existing HeroSubtleLinks. Picking SFC + i18n strings (not raw VitePress
// frontmatter tagline) because frontmatter tagline only accepts a single
// string, and the project's six claims read better as bullets.
const strings = useUiStrings()
const items = computed(() => strings.value.hero.taglineItems)
</script>

<template>
  <ul class="hero-tagline-list">
    <li v-for="(item, i) in items" :key="i">{{ item }}</li>
  </ul>
</template>

<style scoped>
.hero-tagline-list {
  /* Centered in the hero column (which is text-center via custom.css's
   * .VPHome .VPHero .container override) but the bullets themselves are
   * left-aligned inside an inline-block so the list reads as a coherent
   * paragraph rather than six dancing centered lines. */
  display: inline-block;
  margin: 1.25rem auto 0;
  padding: 0;
  list-style: none;
  text-align: left;
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--vp-c-text-2);
  max-width: 640px;
}

.hero-tagline-list li {
  position: relative;
  padding-left: 1.25rem;
  margin: 0.25rem 0;
}

.hero-tagline-list li::before {
  /* Token-driven bullet (no raw hex). Filled circle ½em above text
   * baseline so it reads as a tight bullet rather than a discordant
   * dot. */
  content: '';
  position: absolute;
  left: 0.25rem;
  top: 0.65em;
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  background: var(--aster-primary);
}
</style>
