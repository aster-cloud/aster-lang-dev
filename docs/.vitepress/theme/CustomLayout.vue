<script setup lang="ts">
import { computed, nextTick, onMounted, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HeroSubtleLinks from '../components/HeroSubtleLinks.vue'
import HeroTaglineList from '../components/HeroTaglineList.vue'
import HeroAnimationTeaser from '../components/HeroAnimationTeaser.vue'
import DevTrustBand from '../components/DevTrustBand.vue'
import DevFeatures from '../components/DevFeatures.vue'
import DevBottomCta from '../components/DevBottomCta.vue'
import DevFooter from '../components/DevFooter.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
const route = useRoute()

// VitePress's default Layout wraps page content in `.VPContent`, a
// plain <div>. WCAG 1.3.1 / 4.1.2 expects a `main` landmark so AT can
// jump straight to primary content. We patch `role="main"` onto
// `.VPContent` after each route change (the original element is
// re-created on SPA navigation, so a one-shot onMounted is not enough).
function patchMainLandmark() {
  if (typeof document === 'undefined') return
  const el = document.querySelector('.VPContent')
  if (el && !el.hasAttribute('role')) {
    el.setAttribute('role', 'main')
  }
}

onMounted(() => {
  patchMainLandmark()
  // Re-apply on route change — VitePress re-mounts .VPContent.
  watch(() => route.path, () => nextTick(patchMainLandmark))
})

// Slots render in this order (verified against vitepress 1.6.4 VPHome.vue
// and Layout.vue):
//   home-hero-info-after  → inside hero column under tagline
//   home-hero-after       → below the full VPHero block (full-width)
//   home-features-before  → above VPFeatures
//   home-features-after   → below VPFeatures, BEFORE markdown body
//   layout-bottom         → below markdown body (last thing in <main>)
//
// HeroAnimationTeaser (Policy / Workflow / Decision cards + "Aster
// Cloud" framing) lands at #home-features-after. The application-layer
// API docs themselves moved off this site to aster-lang.cloud/docs/* —
// the teaser advertises that move + funnels readers to the right place.
//
// VPFooter is rendered by Layout.vue directly (conditional on
// theme.footer && frontmatter.footer !== false). On home we set
// frontmatter.footer: false so VPFooter is suppressed natively, and our
// DevFooter takes over via layout-bottom.
const isHome = computed(() => frontmatter.value.layout === 'home')
</script>

<template>
  <Layout>
    <template #home-hero-info-after>
      <!-- Tagline as a bullet list (replaces the frontmatter `tagline:`
           string which only supports a single line). HeroSubtleLinks
           sits below so the reading order is: name → text → tagline
           bullets → secondary links → CTAs. -->
      <HeroTaglineList />
      <HeroSubtleLinks />
    </template>

    <template #home-features-before>
      <DevTrustBand />
    </template>

    <template #home-features-after>
      <DevFeatures />
      <HeroAnimationTeaser />
    </template>

    <template v-if="isHome" #layout-bottom>
      <DevBottomCta />
      <DevFooter />
    </template>
  </Layout>
</template>
