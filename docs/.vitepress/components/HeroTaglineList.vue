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
          <!--
            Each illustration uses a shared 256×256 viewBox and pulls
            tone colors from the parent .tagline-hero--<tone> CSS vars
            (--tone-fg / --tone-accent / --tone-soft) so light/dark mode
            inverts correctly without per-SVG palette code.

            CSS custom properties are NOT animatable inside SVG via
            currentColor magic alone, so each illustration repeats the
            tone classes on its <g> elements; the parent CSS sets the
            three vars and the SVG paths fill/stroke from them.
          -->

          <!-- 0: Multilingual CNL — three speech bubbles (EN / 中 / DE)
               converge into code braces { }, showing that natural-
               language input compiles to a single executable form. -->
          <svg
            v-if="i === 0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="none"
          >
            <!-- soft background blob -->
            <ellipse cx="128" cy="140" rx="110" ry="80" class="bg-soft" />
            <!-- code braces in the middle -->
            <path d="M118 95 q-22 0 -22 22 v15 q0 8 -8 12 q8 4 8 12 v15 q0 22 22 22" class="stroke-fg" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M138 95 q22 0 22 22 v15 q0 8 8 12 q-8 4 -8 12 v15 q0 22 -22 22" class="stroke-fg" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
            <!-- bubble 1: EN, top-left -->
            <path d="M22 64 h64 q10 0 10 10 v32 q0 10 -10 10 h-12 l-14 12 v-12 h-38 q-10 0 -10 -10 v-32 q0 -10 10 -10 z" class="fill-soft stroke-fg" stroke-width="4" />
            <text x="54" y="96" text-anchor="middle" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="20" font-weight="600">EN</text>
            <!-- bubble 2: 中, top-right -->
            <path d="M168 50 h64 q10 0 10 10 v32 q0 10 -10 10 h-38 v12 l-14 -12 h-12 q-10 0 -10 -10 v-32 q0 -10 10 -10 z" class="fill-accent stroke-fg" stroke-width="4" />
            <text x="200" y="82" text-anchor="middle" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="22" font-weight="700">中</text>
            <!-- bubble 3: DE, bottom -->
            <path d="M82 184 h92 q10 0 10 10 v28 q0 10 -10 10 h-50 l-14 12 v-12 h-28 q-10 0 -10 -10 v-28 q0 -10 10 -10 z" class="fill-soft stroke-fg" stroke-width="4" />
            <text x="128" y="216" text-anchor="middle" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="20" font-weight="600">DE</text>
          </svg>

          <!-- 1: Three sources → one engine — three colored streams
               flow into a central hexagonal engine core with a gear,
               showing semantic equivalence across locales. -->
          <svg
            v-else-if="i === 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="none"
          >
            <ellipse cx="128" cy="140" rx="110" ry="80" class="bg-soft" />
            <!-- three source streams entering from left -->
            <path d="M20 70 Q80 70 100 110" class="stroke-fg" stroke-width="6" stroke-linecap="round" />
            <path d="M20 130 Q80 130 100 130" class="stroke-accent" stroke-width="6" stroke-linecap="round" />
            <path d="M20 190 Q80 190 100 150" class="stroke-fg" stroke-width="6" stroke-linecap="round" />
            <!-- source labels -->
            <circle cx="20" cy="70" r="10" class="fill-fg" />
            <circle cx="20" cy="130" r="10" class="fill-accent" />
            <circle cx="20" cy="190" r="10" class="fill-fg" />
            <!-- hexagonal engine core -->
            <path d="M128 70 L188 100 L188 160 L128 190 L68 160 L68 100 Z" transform="translate(40,0)" class="fill-soft stroke-fg" stroke-width="6" stroke-linejoin="round" />
            <!-- gear in the middle -->
            <circle cx="168" cy="130" r="22" class="stroke-fg" stroke-width="5" />
            <circle cx="168" cy="130" r="8" class="fill-fg" />
            <g class="stroke-fg" stroke-width="5" stroke-linecap="round">
              <line x1="168" y1="100" x2="168" y2="108" />
              <line x1="168" y1="152" x2="168" y2="160" />
              <line x1="138" y1="130" x2="146" y2="130" />
              <line x1="190" y1="130" x2="198" y2="130" />
              <line x1="148" y1="110" x2="153" y2="115" />
              <line x1="183" y1="145" x2="188" y2="150" />
              <line x1="148" y1="150" x2="153" y2="145" />
              <line x1="183" y1="115" x2="188" y2="110" />
            </g>
            <!-- output stream right -->
            <path d="M210 130 L240 130" class="stroke-fg" stroke-width="6" stroke-linecap="round" />
            <polygon points="240,124 252,130 240,136" class="fill-fg" />
          </svg>

          <!-- 2: Dual implementations cross-verified — two code blocks
               (Java + TypeScript) face each other with bidirectional
               arrows, a green ✓ between them confirms equivalence. -->
          <svg
            v-else-if="i === 2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="none"
          >
            <ellipse cx="128" cy="140" rx="110" ry="80" class="bg-soft" />
            <!-- left code block: Java -->
            <rect x="20" y="80" width="80" height="100" rx="10" class="fill-soft stroke-fg" stroke-width="5" />
            <text x="60" y="105" text-anchor="middle" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="12" font-weight="700">Java</text>
            <g class="stroke-fg" stroke-width="3" stroke-linecap="round">
              <line x1="32" y1="125" x2="68" y2="125" />
              <line x1="32" y1="140" x2="78" y2="140" />
              <line x1="32" y1="155" x2="60" y2="155" />
              <line x1="32" y1="170" x2="72" y2="170" />
            </g>
            <!-- right code block: TypeScript -->
            <rect x="156" y="80" width="80" height="100" rx="10" class="fill-soft stroke-fg" stroke-width="5" />
            <text x="196" y="105" text-anchor="middle" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="12" font-weight="700">TS</text>
            <g class="stroke-fg" stroke-width="3" stroke-linecap="round">
              <line x1="168" y1="125" x2="216" y2="125" />
              <line x1="168" y1="140" x2="208" y2="140" />
              <line x1="168" y1="155" x2="220" y2="155" />
              <line x1="168" y1="170" x2="204" y2="170" />
            </g>
            <!-- bidirectional arrows -->
            <path d="M104 116 L152 116" class="stroke-fg" stroke-width="4" stroke-linecap="round" />
            <polygon points="148,110 156,116 148,122" class="fill-fg" />
            <path d="M152 164 L104 164" class="stroke-fg" stroke-width="4" stroke-linecap="round" />
            <polygon points="108,158 100,164 108,170" class="fill-fg" />
            <!-- center checkmark circle (success-coded so it pops) -->
            <circle cx="128" cy="140" r="20" class="fill-accent stroke-fg" stroke-width="4" />
            <path d="M117 140 L125 148 L139 134" class="stroke-bg" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          </svg>

          <!-- 3: Lexicon packs — stack of language packs (cubes) with
               a "+" slot waiting for the next one to drop in. -->
          <svg
            v-else-if="i === 3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="none"
          >
            <ellipse cx="128" cy="160" rx="110" ry="70" class="bg-soft" />
            <!-- shelf line -->
            <line x1="20" y1="200" x2="236" y2="200" class="stroke-fg" stroke-width="4" stroke-linecap="round" />
            <!-- pack 1 (EN) — front-left -->
            <g transform="translate(36, 130)">
              <path d="M0 50 L0 20 L30 5 L60 20 L60 50 L30 65 Z" class="fill-soft stroke-fg" stroke-width="4" stroke-linejoin="round" />
              <path d="M0 20 L30 35 L60 20" class="stroke-fg" stroke-width="3" fill="none" />
              <path d="M30 35 L30 65" class="stroke-fg" stroke-width="3" />
              <text x="30" y="55" text-anchor="middle" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="11" font-weight="700">EN</text>
            </g>
            <!-- pack 2 (中) — middle-back, slightly higher -->
            <g transform="translate(104, 110)">
              <path d="M0 50 L0 20 L30 5 L60 20 L60 50 L30 65 Z" class="fill-accent stroke-fg" stroke-width="4" stroke-linejoin="round" />
              <path d="M0 20 L30 35 L60 20" class="stroke-fg" stroke-width="3" fill="none" />
              <path d="M30 35 L30 65" class="stroke-fg" stroke-width="3" />
              <text x="30" y="55" text-anchor="middle" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="13" font-weight="700">中</text>
            </g>
            <!-- pack 3 (DE) — front-right -->
            <g transform="translate(160, 130)">
              <path d="M0 50 L0 20 L30 5 L60 20 L60 50 L30 65 Z" class="fill-soft stroke-fg" stroke-width="4" stroke-linejoin="round" />
              <path d="M0 20 L30 35 L60 20" class="stroke-fg" stroke-width="3" fill="none" />
              <path d="M30 35 L30 65" class="stroke-fg" stroke-width="3" />
              <text x="30" y="55" text-anchor="middle" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="11" font-weight="700">DE</text>
            </g>
            <!-- dashed slot for the "fourth" pack with a + sign hovering -->
            <g transform="translate(96, 35)">
              <path d="M0 50 L0 20 L30 5 L60 20 L60 50 L30 65 Z" class="stroke-fg" stroke-width="4" stroke-dasharray="6 4" stroke-linejoin="round" fill="none" />
              <line x1="30" y1="24" x2="30" y2="46" class="stroke-fg" stroke-width="4" stroke-linecap="round" />
              <line x1="19" y1="35" x2="41" y2="35" class="stroke-fg" stroke-width="4" stroke-linecap="round" />
            </g>
          </svg>

          <!-- 4: Drop-in transports — central engine chip with three
               connector cables (REST / GraphQL / WebSocket) plugged in. -->
          <svg
            v-else-if="i === 4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="none"
          >
            <ellipse cx="128" cy="140" rx="110" ry="80" class="bg-soft" />
            <!-- central chip -->
            <rect x="88" y="100" width="80" height="80" rx="12" class="fill-soft stroke-fg" stroke-width="5" />
            <!-- chip pins (decoration) -->
            <g class="stroke-fg" stroke-width="3" stroke-linecap="round">
              <line x1="100" y1="100" x2="100" y2="92" />
              <line x1="118" y1="100" x2="118" y2="92" />
              <line x1="138" y1="100" x2="138" y2="92" />
              <line x1="156" y1="100" x2="156" y2="92" />
              <line x1="100" y1="188" x2="100" y2="180" />
              <line x1="118" y1="188" x2="118" y2="180" />
              <line x1="138" y1="188" x2="138" y2="180" />
              <line x1="156" y1="188" x2="156" y2="180" />
            </g>
            <!-- inner core -->
            <rect x="108" y="120" width="40" height="40" rx="6" class="fill-fg" />
            <!-- left cable: REST -->
            <path d="M12 60 Q60 60 60 120 L88 120" class="stroke-fg" stroke-width="6" stroke-linecap="round" fill="none" />
            <rect x="6" y="50" width="12" height="20" rx="2" class="fill-fg" />
            <text x="22" y="46" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="14" font-weight="700">REST</text>
            <!-- right cable: GraphQL -->
            <path d="M244 60 Q196 60 196 120 L168 120" class="stroke-accent" stroke-width="6" stroke-linecap="round" fill="none" />
            <rect x="238" y="50" width="12" height="20" rx="2" class="fill-accent" />
            <text x="234" y="46" text-anchor="end" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="14" font-weight="700">GraphQL</text>
            <!-- bottom cable: WebSocket -->
            <path d="M128 240 L128 180" class="stroke-fg" stroke-width="6" stroke-linecap="round" />
            <rect x="122" y="240" width="12" height="14" rx="2" class="fill-fg" />
            <text x="128" y="232" text-anchor="middle" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="14" font-weight="700">WS</text>
          </svg>

          <!-- 5: Apache-2.0 license — official-looking document with
               a license seal and a shield watermark behind it. -->
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="none"
          >
            <ellipse cx="128" cy="140" rx="110" ry="80" class="bg-soft" />
            <!-- shield watermark behind the document -->
            <path d="M128 36 L188 56 V120 Q188 180 128 220 Q68 180 68 120 V56 Z" class="fill-soft stroke-fg" stroke-width="4" />
            <!-- document, tilted slightly -->
            <g transform="rotate(-4, 128, 130)">
              <path d="M70 60 H160 L186 86 V210 H70 Z" class="fill-bg stroke-fg" stroke-width="5" stroke-linejoin="round" />
              <!-- folded corner -->
              <path d="M160 60 V86 H186" class="stroke-fg" stroke-width="5" fill="none" stroke-linejoin="round" />
              <!-- title line -->
              <text x="128" y="106" text-anchor="middle" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="12" font-weight="700">APACHE 2.0</text>
              <!-- body lines -->
              <g class="stroke-fg" stroke-width="3" stroke-linecap="round">
                <line x1="82" y1="128" x2="170" y2="128" />
                <line x1="82" y1="144" x2="158" y2="144" />
                <line x1="82" y1="160" x2="164" y2="160" />
                <line x1="82" y1="176" x2="148" y2="176" />
              </g>
            </g>
            <!-- official seal (bottom-right) -->
            <circle cx="180" cy="200" r="24" class="fill-accent stroke-fg" stroke-width="4" />
            <path d="M168 200 L177 209 L192 192" class="stroke-bg" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
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
 * accounts for: 11rem illustration + 1.25rem gap + ~3 lines text. */
.tagline-stage {
  position: relative;
  display: grid;
  min-height: 17rem;
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
  transform: translateY(10px) scale(0.98);
  /* visibility hides text from layout (and screen readers) during the
   * fade so two rotating claims never visually overlap. transition-
   * delay on visibility makes it stick around long enough for the
   * opacity fade-out to finish (0.3s = transition duration). */
  visibility: hidden;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease,
    visibility 0s linear 0.3s;
  pointer-events: none;
}

.tagline-card.active {
  opacity: 1;
  transform: translateY(0) scale(1);
  visibility: visible;
  /* On the way IN, flip visibility immediately so the fade-in begins
   * at the same time the previous card starts fading out. */
  transition:
    opacity 0.3s ease,
    transform 0.3s ease,
    visibility 0s linear 0s;
  pointer-events: auto;
}

/* Large hero illustration — 11rem square (was 7rem icon).
 * Multi-element SVG scenes drawn with stroke/fill semantic classes
 * (.fill-soft / .stroke-fg / .fill-accent etc.) so each tone variant
 * remaps the same illustration to a different palette via parent
 * CSS custom properties. The SVGs themselves carry no hex codes. */
.tagline-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 11rem;
  height: 11rem;
  filter: drop-shadow(0 6px 18px var(--tone-shadow));
}

.tagline-hero svg {
  position: relative;
  width: 100%;
  height: 100%;
}

/* SVG semantic class scheme — paths inside the illustrations use
 * these classes; the parent .tagline-hero--<tone> sets the three
 * tone vars and these classes read them. */
.tagline-hero .bg-soft       { fill: var(--tone-soft);   }
.tagline-hero .fill-soft     { fill: var(--tone-soft);   }
.tagline-hero .fill-fg       { fill: var(--tone-fg);     }
.tagline-hero .fill-accent   { fill: var(--tone-accent); }
.tagline-hero .fill-bg       { fill: var(--tone-bg);     }
.tagline-hero .stroke-fg     { stroke: var(--tone-fg);   }
.tagline-hero .stroke-accent { stroke: var(--tone-accent);}
.tagline-hero .stroke-bg     { stroke: var(--tone-bg);   }
.tagline-hero .label-fg      { fill: var(--tone-fg);     }

/* Tone variants — semantic tokens; all reverse correctly between
 * light/dark via html:not(.dark):root / html.dark:root in
 * aster-brand.css. Each tone defines:
 *   --tone-fg     primary lines / labels / strong shapes
 *   --tone-soft   inner fills + the background blob behind the scene
 *   --tone-accent secondary highlight (e.g. the green checkmark in
 *                 the "dual impl" illustration sits on this color
 *                 regardless of the card's main tone)
 *   --tone-bg     base paper / inverse fill for stamps + carved text
 *   --tone-shadow soft drop shadow under the whole illustration */
.tagline-hero--primary {
  --tone-fg: var(--aster-primary);
  --tone-soft: var(--aster-primary-subtle);
  --tone-accent: var(--aster-accent);
  --tone-bg: var(--aster-bg);
  --tone-shadow: rgb(139 92 246 / 0.22);
}
.tagline-hero--accent {
  --tone-fg: var(--aster-accent);
  --tone-soft: var(--aster-accent-subtle);
  --tone-accent: var(--aster-primary);
  --tone-bg: var(--aster-bg);
  --tone-shadow: rgb(56 189 248 / 0.22);
}
.tagline-hero--success {
  --tone-fg: var(--aster-success);
  --tone-soft: var(--aster-success-subtle);
  --tone-accent: var(--aster-success);
  --tone-bg: var(--aster-bg);
  --tone-shadow: rgb(16 185 129 / 0.22);
}
.tagline-hero--warning {
  --tone-fg: var(--aster-warning);
  --tone-soft: var(--aster-warning-subtle);
  --tone-accent: var(--aster-primary);
  --tone-bg: var(--aster-bg);
  --tone-shadow: rgb(245 158 11 / 0.22);
}
.tagline-hero--neutral {
  --tone-fg: var(--aster-fg-muted);
  --tone-soft: var(--aster-bg-muted);
  --tone-accent: var(--aster-success);
  --tone-bg: var(--aster-bg);
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

/* Mobile: shrink the illustration so the card fits comfortably
 * without pushing CTAs below the fold. */
@media (max-width: 640px) {
  .tagline-hero {
    width: 8rem;
    height: 8rem;
  }
  .tagline-text {
    font-size: 0.95rem;
  }
  .tagline-stage {
    min-height: 14rem;
  }
}
</style>
