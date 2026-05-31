<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HeroAnimation from '../components/HeroAnimation.vue'
import HeroSubtleLinks from '../components/HeroSubtleLinks.vue'
import DevTrustBand from '../components/DevTrustBand.vue'
import DevFeatures from '../components/DevFeatures.vue'
import DevBottomCta from '../components/DevBottomCta.vue'
import DevFooter from '../components/DevFooter.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()

// Slots render in this order (verified against vitepress 1.6.4 VPHome.vue
// and Layout.vue):
//   home-hero-info-after  → inside hero column under tagline
//   home-features-before  → above VPFeatures
//   home-features-after   → below VPFeatures, BEFORE markdown body
//   layout-bottom         → below markdown body (last thing in <main>)
//
// VPFooter is rendered by Layout.vue directly (conditional on
// theme.footer && frontmatter.footer !== false). On home we set
// frontmatter.footer: false so VPFooter is suppressed natively, and our
// DevFooter takes over via layout-bottom.
const isHome = computed(() => frontmatter.value.layout === 'home')
</script>

<template>
  <Layout>
    <template #home-hero-image>
      <HeroAnimation />
    </template>
    <template #home-hero-info-after>
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
