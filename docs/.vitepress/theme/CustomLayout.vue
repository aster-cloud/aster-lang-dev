<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HeroSubtleLinks from '../components/HeroSubtleLinks.vue'
import HeroTaglineList from '../components/HeroTaglineList.vue'
import DevTrustBand from '../components/DevTrustBand.vue'
import DevFeatures from '../components/DevFeatures.vue'
import DevBottomCta from '../components/DevBottomCta.vue'
import DevFooter from '../components/DevFooter.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()

// Slots render in this order (verified against vitepress 1.6.4 VPHome.vue
// and Layout.vue):
//   home-hero-info-after  → inside hero column under tagline
//   home-hero-after       → below the full VPHero block (full-width)
//   home-features-before  → above VPFeatures
//   home-features-after   → below VPFeatures, BEFORE markdown body
//   layout-bottom         → below markdown body (last thing in <main>)
//
// HeroAnimation removed from landing — the tagline carousel
// (HeroTaglineList) now carries the visual rotation. The animation
// is embedded directly into the REST API reference page
// (docs/api/policies/evaluate.md) where its three cards (Policy /
// Workflow / Decision) match the page's native subject matter.
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
    </template>

    <template v-if="isHome" #layout-bottom>
      <DevBottomCta />
      <DevFooter />
    </template>
  </Layout>
</template>
