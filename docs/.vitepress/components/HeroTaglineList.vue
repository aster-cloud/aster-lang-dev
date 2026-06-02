<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useUiStrings } from '../i18n/ui'

// Carousel version of the hero tagline. 6 technical claims rotate one
// at a time. Each card is illustrated with a large tone-coordinated
// SVG hero image (5rem) above the text — giving the landing visual
// weight that HeroAnimation used to provide before being moved to
// the REST API doc page.
//
// Tone mapping (positional, one per claim):
//   0. Languages       → primary (violet)  — brand identity / CNL
//   1. GitMerge        → accent  (sky)     — three sources → one engine
//   2. Shuffle         → success (emerald) — verification passes
//   3. Package         → warning (amber)   — extension hot-zone
//   4. Plug            → primary (violet)  — drop-in integration
//   5. FileText        → neutral (zinc)    — legal artifact
//
// Cycle: 4500ms per card (slightly slower than HeroAnimation's 3200ms
// so the two motion families don't snap in sync). Mobile + reduced-
// motion freeze on card 0 (WCAG 2.3.3).

const strings = useUiStrings()
const items = computed(() => strings.value.hero.taglineItems)

const activeIdx = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

const mql = typeof window !== 'undefined'
  ? window.matchMedia('(max-width: 960px)')
  : null
const reducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null

function startCycle() {
  if (mql?.matches || reducedMotion?.matches) return
  timer = setInterval(() => {
    activeIdx.value = (activeIdx.value + 1) % items.value.length
  }, 4500)
}

function stopCycle() {
  if (timer !== undefined) {
    clearInterval(timer)
    timer = undefined
  }
}

function onMediaChange() {
  stopCycle()
  startCycle()
}

function setActive(idx: number) {
  activeIdx.value = idx
  stopCycle()
  startCycle()
}

onMounted(() => {
  startCycle()
  mql?.addEventListener('change', onMediaChange)
  reducedMotion?.addEventListener('change', onMediaChange)
})

onBeforeUnmount(() => {
  stopCycle()
  mql?.removeEventListener('change', onMediaChange)
  reducedMotion?.removeEventListener('change', onMediaChange)
})

const TONES = ['primary', 'accent', 'success', 'warning', 'primary', 'neutral'] as const
</script>

<template>
  <div
    class="hero-tagline-carousel"
    role="region"
    aria-label="Aster Lang capabilities"
  >
    <div
      class="tagline-stage"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        v-for="(item, i) in items"
        :key="i"
        class="tagline-card"
        :class="{ active: i === activeIdx }"
      >
        <div class="tagline-hero" :class="`tagline-hero--${TONES[i]}`" aria-hidden="true">
          <!-- 0: Languages — multilingual / CNL -->
          <svg
            v-if="i === 0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m5 8 6 6" />
            <path d="m4 14 6-6 2-3" />
            <path d="M2 5h12" />
            <path d="M7 2h1" />
            <path d="m22 22-5-10-5 10" />
            <path d="M14 18h6" />
          </svg>
          <!-- 1: GitMerge — 3 sources compile to 1 engine -->
          <svg
            v-else-if="i === 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="18" cy="18" r="3" />
            <circle cx="6" cy="6" r="3" />
            <path d="M6 21V9a9 9 0 0 0 9 9" />
          </svg>
          <!-- 2: Shuffle — dual impl cross-verified -->
          <svg
            v-else-if="i === 2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
            <path d="m18 2 4 4-4 4" />
            <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
            <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
            <path d="m18 14 4 4-4 4" />
          </svg>
          <!-- 3: Package — lexicon packs -->
          <svg
            v-else-if="i === 3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
            <path d="M12 22V12" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="m7.5 4.27 9 5.15" />
          </svg>
          <!-- 4: Plug — drop-in via transports -->
          <svg
            v-else-if="i === 4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 22v-5" />
            <path d="M9 7V2" />
            <path d="M15 7V2" />
            <path d="M6 13V8h12v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4Z" />
          </svg>
          <!-- 5: FileText — license -->
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
          </svg>
        </div>
        <p class="tagline-text">{{ item }}</p>
      </div>
    </div>
    <div class="tagline-dots" role="tablist" :aria-label="`Tagline ${activeIdx + 1} of ${items.length}`">
      <button
        v-for="(_, i) in items"
        :key="i"
        type="button"
        class="tagline-dot"
        :class="{ active: i === activeIdx }"
        role="tab"
        :aria-selected="i === activeIdx"
        :aria-label="`Show tagline ${i + 1}`"
        @click="setActive(i)"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.hero-tagline-carousel {
  width: 100%;
  max-width: 560px;
  margin: 2rem auto 0;
}

/* Stage uses grid layering so all cards share the same slot — only
 * the active one is visible. Min-height freezes the layout so cards
 * with different text lengths don't jank-resize the hero. The min
 * accounts for: 8rem hero image + 1rem gap + ~3 lines text + dots. */
.tagline-stage {
  position: relative;
  display: grid;
  min-height: 13rem;
  align-items: center;
  justify-items: center;
}

.tagline-card {
  grid-area: 1 / 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  padding: 0 1rem;
  opacity: 0;
  transform: translateY(12px) scale(0.98);
  transition: opacity 0.5s ease, transform 0.5s ease;
  pointer-events: none;
}

.tagline-card.active {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

/* Large hero image — 7rem square with a soft gradient backdrop
 * that fades into the page so the icon "blooms" rather than sitting
 * inside a hard box. radial-gradient creates the soft fade; the icon
 * SVG sits on top in its tone color. */
.tagline-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 7rem;
  height: 7rem;
  border-radius: 9999px;
}

.tagline-hero::before {
  content: '';
  position: absolute;
  inset: -1rem;
  border-radius: 9999px;
  background: radial-gradient(
    circle at center,
    var(--tone-glow) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.tagline-hero svg {
  position: relative;
  width: 100%;
  height: 100%;
  color: var(--tone-fg);
  filter: drop-shadow(0 4px 12px var(--tone-shadow));
}

/* Tone variants — semantic tokens, all reverse correctly between
 * light/dark via html:not(.dark):root / html.dark:root in
 * aster-brand.css. */
.tagline-hero--primary {
  --tone-glow: var(--aster-primary-subtle);
  --tone-fg: var(--aster-primary);
  --tone-shadow: rgb(139 92 246 / 0.25);
}
.tagline-hero--accent {
  --tone-glow: var(--aster-accent-subtle);
  --tone-fg: var(--aster-accent);
  --tone-shadow: rgb(56 189 248 / 0.25);
}
.tagline-hero--success {
  --tone-glow: var(--aster-success-subtle);
  --tone-fg: var(--aster-success);
  --tone-shadow: rgb(16 185 129 / 0.25);
}
.tagline-hero--warning {
  --tone-glow: var(--aster-warning-subtle);
  --tone-fg: var(--aster-warning);
  --tone-shadow: rgb(245 158 11 / 0.25);
}
.tagline-hero--neutral {
  --tone-glow: var(--aster-bg-muted);
  --tone-fg: var(--aster-fg-muted);
  --tone-shadow: rgb(0 0 0 / 0.15);
}

.tagline-text {
  margin: 0;
  max-width: 480px;
  font-size: 1.05rem;
  line-height: 1.55;
  color: var(--vp-c-text-1);
  text-align: center;
  font-weight: 500;
}

/* Progress dots — same visual language as HeroAnimation progress row */
.tagline-dots {
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 1.25rem;
}

.tagline-dot {
  display: inline-block;
  width: 0.4rem;
  height: 0.4rem;
  border: 0;
  border-radius: 9999px;
  background: var(--vp-c-text-3);
  opacity: 0.4;
  cursor: pointer;
  transition: width 0.25s ease, opacity 0.25s ease, background 0.25s ease;
  padding: 0;
}

.tagline-dot:hover {
  opacity: 0.7;
}

.tagline-dot.active {
  width: 1.25rem;
  background: var(--aster-primary);
  opacity: 1;
}

.tagline-dot:focus-visible {
  outline: none;
  box-shadow: var(--aster-shadow-ring);
}

@media (prefers-reduced-motion: reduce) {
  .tagline-card {
    transition: none;
  }
}

/* Mobile: shrink the hero so the card fits comfortably without
 * pushing CTAs below the fold. */
@media (max-width: 640px) {
  .tagline-hero {
    width: 5rem;
    height: 5rem;
  }
  .tagline-text {
    font-size: 0.95rem;
  }
  .tagline-stage {
    min-height: 11rem;
  }
}
</style>
