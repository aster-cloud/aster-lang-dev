<script setup lang="ts">
// Wrapper around <HeroAnimation /> that adds an "Aster Cloud" framing
// + outbound CTA. Used on the landing page (via CustomLayout's
// home-features-after slot) to advertise the application-layer engine
// without putting application API docs on the language site.
//
// The HeroAnimation cards (Policy / Workflow / Decision) are a great
// visual teaser for what Cloud offers — they remain factual examples
// (POST /api/v1/policies/evaluate etc.) but the framing makes it clear
// that they live on aster-lang.cloud, not here.
import HeroAnimation from './HeroAnimation.vue'
import { useUiStrings } from '../i18n/ui'
import { computed } from 'vue'

const strings = useUiStrings()
// Use existing i18n keys where available; fall back to literals for
// the new copy block. A future PR can hoist these into ui.ts.
const heading = computed(() => {
  return {
    en: 'Run them on Aster Cloud',
    zh: '在 Aster Cloud 上运行',
    de: 'Auf Aster Cloud ausführen',
  }
})
const body = computed(() => {
  return {
    en: 'Policy evaluation, workflow audit logs, and batch decisions — all served over REST, GraphQL, and WebSocket by the hosted engine.',
    zh: '策略评估、流程审计日志、批量决策 —— 全部由托管引擎通过 REST、GraphQL、WebSocket 提供。',
    de: 'Policy-Evaluierung, Workflow-Audit-Logs und Batch-Entscheidungen — alles per REST, GraphQL und WebSocket von der gehosteten Engine.',
  }
})
const ctaText = computed(() => {
  return {
    en: 'Read Cloud API docs →',
    zh: '阅读 Cloud API 文档 →',
    de: 'Cloud-API-Docs lesen →',
  }
})

// Derive locale from the URL prefix so the right copy block + CTA URL
// is chosen. matches the locale of the page the teaser is rendered on.
function detectLocale(): 'en' | 'zh' | 'de' {
  if (typeof window === 'undefined') return 'en'
  const p = window.location.pathname
  if (p.startsWith('/zh/')) return 'zh'
  if (p.startsWith('/de/')) return 'de'
  return 'en'
}

const locale = computed(() => detectLocale())
const ctaHref = computed(() => {
  const base = 'https://aster-lang.cloud'
  const lang = locale.value === 'en' ? '' : `/${locale.value}`
  return `${base}${lang}/docs/api/policies/evaluate`
})
</script>

<template>
  <section class="hero-teaser" :aria-label="heading[locale]">
    <div class="hero-teaser-inner">
      <header class="hero-teaser-header">
        <p class="hero-teaser-eyebrow">Aster Cloud</p>
        <h2 class="hero-teaser-title">{{ heading[locale] }}</h2>
        <p class="hero-teaser-body">{{ body[locale] }}</p>
        <a class="hero-teaser-cta" :href="ctaHref" rel="noopener">{{ ctaText[locale] }}</a>
      </header>
      <div class="hero-teaser-stage">
        <HeroAnimation />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-teaser {
  background: var(--aster-color-zinc-50, #fafafa);
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 4rem 1.5rem;
}
:where(html.dark) .hero-teaser {
  background: var(--aster-color-zinc-900, #18181b);
}
.hero-teaser-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;
}
@media (min-width: 960px) {
  .hero-teaser-inner {
    grid-template-columns: 0.85fr 1.15fr;
  }
}
.hero-teaser-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.hero-teaser-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--aster-primary);
  margin: 0;
}
.hero-teaser-title {
  font-family: var(--aster-font-display, serif);
  font-size: clamp(1.5rem, 2.2vw, 2rem);
  margin: 0;
  color: var(--vp-c-text-1);
  letter-spacing: -0.01em;
}
.hero-teaser-body {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.6;
  max-width: 38rem;
}
.hero-teaser-cta {
  align-self: flex-start;
  margin-top: 0.5rem;
  font-weight: 500;
  color: var(--aster-primary);
  text-decoration: none;
  border-radius: 0.25rem;
}
.hero-teaser-cta:hover,
.hero-teaser-cta:focus-visible {
  color: var(--aster-primary-hover, var(--aster-primary));
}
.hero-teaser-cta:focus-visible {
  outline: 2px solid var(--aster-primary);
  outline-offset: 3px;
}
.hero-teaser-stage {
  /* The HeroAnimation component is responsive itself; this is just
   * the container so the grid column has somewhere to expand. */
  min-width: 0;
}
</style>
