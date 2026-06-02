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

          <!-- 0: Multilingual CNL — three speech bubbles (EN / 中 / DE
               + ES placeholder bubble) flow as particle streams into
               a central code-brace assembly with body lines visible
               inside (representing the compiled rule). -->
          <svg
            v-if="i === 0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="none"
          >
            <!-- soft background blob -->
            <ellipse cx="128" cy="140" rx="120" ry="100" class="bg-soft" />
            <!-- particle flows from bubbles to center (decoration) -->
            <g class="fill-fg" opacity="0.45">
              <circle cx="68" cy="88" r="2" />
              <circle cx="82" cy="100" r="2.5" />
              <circle cx="96" cy="110" r="2" />
              <circle cx="186" cy="78" r="2.5" />
              <circle cx="170" cy="92" r="2" />
              <circle cx="155" cy="105" r="2.5" />
              <circle cx="115" cy="186" r="2" />
              <circle cx="125" cy="172" r="2.5" />
              <circle cx="135" cy="158" r="2" />
            </g>
            <!-- compile pipeline central code-block (rounded card) -->
            <rect x="86" y="100" width="84" height="80" rx="10" class="fill-bg stroke-fg" stroke-width="5" />
            <!-- code braces inside the block -->
            <path d="M108 118 q-8 0 -8 8 v8 q0 4 -4 6 q4 2 4 6 v8 q0 8 8 8" class="stroke-fg" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M148 118 q8 0 8 8 v8 q0 4 4 6 q-4 2 -4 6 v8 q0 8 -8 8" class="stroke-fg" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
            <!-- code lines inside braces -->
            <g class="stroke-fg" stroke-width="2.5" stroke-linecap="round">
              <line x1="116" y1="132" x2="140" y2="132" />
              <line x1="120" y1="140" x2="144" y2="140" />
              <line x1="116" y1="148" x2="136" y2="148" />
            </g>
            <!-- "compile" arrow indicator on top of card -->
            <path d="M122 90 L128 96 L134 90" class="stroke-fg" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            <!-- bubble 1: EN, top-left -->
            <path d="M14 50 h70 q10 0 10 10 v34 q0 10 -10 10 h-14 l-14 14 v-14 h-42 q-10 0 -10 -10 v-34 q0 -10 10 -10 z" class="fill-soft stroke-fg" stroke-width="4" />
            <text x="49" y="84" text-anchor="middle" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="22" font-weight="700">EN</text>
            <!-- 3 dots indicating speech under EN label -->
            <g class="fill-fg" opacity="0.65">
              <circle cx="38" cy="92" r="1.5" />
              <circle cx="49" cy="92" r="1.5" />
              <circle cx="60" cy="92" r="1.5" />
            </g>
            <!-- bubble 2: 中, top-right (accent color → emphasized) -->
            <path d="M172 38 h70 q10 0 10 10 v34 q0 10 -10 10 h-42 v14 l-14 -14 h-14 q-10 0 -10 -10 v-34 q0 -10 10 -10 z" class="fill-accent stroke-fg" stroke-width="4" />
            <text x="207" y="72" text-anchor="middle" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="26" font-weight="700">中</text>
            <g class="fill-fg" opacity="0.65">
              <circle cx="196" cy="80" r="1.5" />
              <circle cx="207" cy="80" r="1.5" />
              <circle cx="218" cy="80" r="1.5" />
            </g>
            <!-- bubble 3: DE, bottom-left -->
            <path d="M40 200 h78 q10 0 10 10 v30 q0 10 -10 10 h-44 l-14 14 v-14 h-20 q-10 0 -10 -10 v-30 q0 -10 10 -10 z" class="fill-soft stroke-fg" stroke-width="4" />
            <text x="79" y="234" text-anchor="middle" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="22" font-weight="700">DE</text>
            <g class="fill-fg" opacity="0.65">
              <circle cx="68" cy="242" r="1.5" />
              <circle cx="79" cy="242" r="1.5" />
              <circle cx="90" cy="242" r="1.5" />
            </g>
            <!-- bubble 4: + placeholder (dashed), bottom-right — "add a fourth" -->
            <path d="M156 200 h70 q10 0 10 10 v30 q0 10 -10 10 h-30 l-14 14 v-14 h-26 q-10 0 -10 -10 v-30 q0 -10 10 -10 z" class="stroke-fg" stroke-width="3" stroke-dasharray="5 4" fill="none" />
            <line x1="191" y1="216" x2="191" y2="240" class="stroke-fg" stroke-width="3.5" stroke-linecap="round" />
            <line x1="179" y1="228" x2="203" y2="228" class="stroke-fg" stroke-width="3.5" stroke-linecap="round" />
          </svg>

          <!-- 1: Three sources → one engine — three labeled source
               pills (EN/中/DE) emit colored streams with data-packet
               dots flowing into a hexagonal engine with two
               interlocking gears, and a labeled output "1 AST" stream
               to the right. -->
          <svg
            v-else-if="i === 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="none"
          >
            <ellipse cx="128" cy="140" rx="120" ry="100" class="bg-soft" />
            <!-- three source pills (left) -->
            <g>
              <rect x="6" y="48" width="48" height="22" rx="11" class="fill-fg" />
              <text x="30" y="63" text-anchor="middle" class="label-fg fill-bg" font-family="-apple-system, system-ui, sans-serif" font-size="11" font-weight="700">EN.aster</text>
              <rect x="6" y="120" width="48" height="22" rx="11" class="fill-accent" />
              <text x="30" y="135" text-anchor="middle" class="label-fg fill-bg" font-family="-apple-system, system-ui, sans-serif" font-size="11" font-weight="700">中文.aster</text>
              <rect x="6" y="192" width="48" height="22" rx="11" class="fill-fg" />
              <text x="30" y="207" text-anchor="middle" class="label-fg fill-bg" font-family="-apple-system, system-ui, sans-serif" font-size="11" font-weight="700">DE.aster</text>
            </g>
            <!-- three source streams entering hex from left -->
            <path d="M54 59 Q100 60 110 95" class="stroke-fg" stroke-width="5" stroke-linecap="round" />
            <path d="M54 131 Q90 131 105 131" class="stroke-accent" stroke-width="5" stroke-linecap="round" />
            <path d="M54 203 Q100 200 110 167" class="stroke-fg" stroke-width="5" stroke-linecap="round" />
            <!-- packet dots flowing along streams -->
            <g class="fill-fg">
              <circle cx="78" cy="68" r="2.5" />
              <circle cx="94" cy="80" r="2.5" />
            </g>
            <g class="fill-accent">
              <circle cx="78" cy="131" r="2.5" />
              <circle cx="94" cy="131" r="2.5" />
            </g>
            <g class="fill-fg">
              <circle cx="78" cy="194" r="2.5" />
              <circle cx="94" cy="182" r="2.5" />
            </g>
            <!-- hexagonal engine core -->
            <path d="M128 80 L184 110 L184 170 L128 200 L72 170 L72 110 Z" transform="translate(40,-10)" class="fill-bg stroke-fg" stroke-width="5" stroke-linejoin="round" />
            <!-- big gear -->
            <circle cx="148" cy="116" r="18" class="stroke-fg" stroke-width="4" />
            <circle cx="148" cy="116" r="6" class="fill-fg" />
            <g class="stroke-fg" stroke-width="4" stroke-linecap="round">
              <line x1="148" y1="92" x2="148" y2="100" />
              <line x1="148" y1="132" x2="148" y2="140" />
              <line x1="124" y1="116" x2="132" y2="116" />
              <line x1="164" y1="116" x2="172" y2="116" />
              <line x1="131" y1="99" x2="136" y2="104" />
              <line x1="160" y1="128" x2="165" y2="133" />
              <line x1="131" y1="133" x2="136" y2="128" />
              <line x1="160" y1="104" x2="165" y2="99" />
            </g>
            <!-- small interlocking gear (lower-right of big gear) -->
            <circle cx="184" cy="150" r="11" class="stroke-fg" stroke-width="3.5" />
            <circle cx="184" cy="150" r="3" class="fill-fg" />
            <g class="stroke-fg" stroke-width="3" stroke-linecap="round">
              <line x1="184" y1="135" x2="184" y2="140" />
              <line x1="184" y1="160" x2="184" y2="165" />
              <line x1="169" y1="150" x2="174" y2="150" />
              <line x1="194" y1="150" x2="199" y2="150" />
            </g>
            <!-- output stream + AST label -->
            <path d="M220 140 L244 140" class="stroke-fg" stroke-width="5" stroke-linecap="round" />
            <polygon points="244,134 254,140 244,146" class="fill-fg" />
            <rect x="204" y="160" width="50" height="22" rx="11" class="fill-fg" />
            <text x="229" y="175" text-anchor="middle" class="label-fg fill-bg" font-family="-apple-system, system-ui, sans-serif" font-size="11" font-weight="700">1 Core IR</text>
          </svg>

          <!-- 2: Dual implementations cross-verified — two code editor
               panes (Java + TypeScript) with title bars, line numbers,
               commit hash + file name, syntax-color lines; central
               equivalence test panel with ✓ stamp and "==" / "all
               tests pass" indicator. -->
          <svg
            v-else-if="i === 2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="none"
          >
            <ellipse cx="128" cy="140" rx="120" ry="100" class="bg-soft" />
            <!-- left code editor: Java -->
            <rect x="6" y="42" width="96" height="138" rx="8" class="fill-bg stroke-fg" stroke-width="4" />
            <!-- title bar -->
            <path d="M6 56 v-6 q0-8 8-8 h80 q8 0 8 8 v6 z" class="fill-soft" />
            <text x="20" y="54" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="9" font-weight="700">Eval.java</text>
            <!-- 3 traffic-light dots -->
            <g>
              <circle cx="92" cy="49" r="2" class="fill-fg" opacity="0.4" />
              <circle cx="86" cy="49" r="2" class="fill-fg" opacity="0.4" />
              <circle cx="80" cy="49" r="2" class="fill-fg" opacity="0.4" />
            </g>
            <!-- line numbers + code lines -->
            <g class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="7" opacity="0.5">
              <text x="13" y="74">1</text>
              <text x="13" y="86">2</text>
              <text x="13" y="98">3</text>
              <text x="13" y="110">4</text>
              <text x="13" y="122">5</text>
              <text x="13" y="134">6</text>
              <text x="13" y="146">7</text>
              <text x="13" y="158">8</text>
            </g>
            <g class="stroke-fg" stroke-width="2.5" stroke-linecap="round">
              <line x1="24" y1="72" x2="60" y2="72" />
              <line x1="30" y1="84" x2="80" y2="84" opacity="0.7" />
              <line x1="30" y1="96" x2="70" y2="96" opacity="0.7" />
              <line x1="36" y1="108" x2="84" y2="108" opacity="0.7" />
              <line x1="36" y1="120" x2="68" y2="120" opacity="0.7" />
              <line x1="30" y1="132" x2="76" y2="132" opacity="0.7" />
              <line x1="30" y1="144" x2="62" y2="144" opacity="0.7" />
              <line x1="24" y1="156" x2="44" y2="156" />
            </g>
            <!-- commit hash bar -->
            <rect x="6" y="166" width="96" height="14" rx="0" class="fill-soft" />
            <text x="13" y="176" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="8">⎇ a3f8c2e ✓</text>
            <!-- right code editor: TypeScript -->
            <rect x="154" y="42" width="96" height="138" rx="8" class="fill-bg stroke-fg" stroke-width="4" />
            <path d="M154 56 v-6 q0-8 8-8 h80 q8 0 8 8 v6 z" class="fill-soft" />
            <text x="168" y="54" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="9" font-weight="700">eval.ts</text>
            <g>
              <circle cx="240" cy="49" r="2" class="fill-fg" opacity="0.4" />
              <circle cx="234" cy="49" r="2" class="fill-fg" opacity="0.4" />
              <circle cx="228" cy="49" r="2" class="fill-fg" opacity="0.4" />
            </g>
            <g class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="7" opacity="0.5">
              <text x="161" y="74">1</text>
              <text x="161" y="86">2</text>
              <text x="161" y="98">3</text>
              <text x="161" y="110">4</text>
              <text x="161" y="122">5</text>
              <text x="161" y="134">6</text>
              <text x="161" y="146">7</text>
              <text x="161" y="158">8</text>
            </g>
            <g class="stroke-fg" stroke-width="2.5" stroke-linecap="round">
              <line x1="172" y1="72" x2="208" y2="72" />
              <line x1="178" y1="84" x2="228" y2="84" opacity="0.7" />
              <line x1="178" y1="96" x2="218" y2="96" opacity="0.7" />
              <line x1="184" y1="108" x2="232" y2="108" opacity="0.7" />
              <line x1="184" y1="120" x2="216" y2="120" opacity="0.7" />
              <line x1="178" y1="132" x2="224" y2="132" opacity="0.7" />
              <line x1="178" y1="144" x2="210" y2="144" opacity="0.7" />
              <line x1="172" y1="156" x2="192" y2="156" />
            </g>
            <rect x="154" y="166" width="96" height="14" rx="0" class="fill-soft" />
            <text x="161" y="176" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="8">⎇ a3f8c2e ✓</text>
            <!-- bidirectional arrows between editors -->
            <g class="stroke-fg" stroke-width="3" stroke-linecap="round">
              <line x1="104" y1="92" x2="118" y2="92" />
              <line x1="138" y1="146" x2="152" y2="146" />
            </g>
            <polygon points="118,87 124,92 118,97" class="fill-fg" />
            <polygon points="138,141 132,146 138,151" class="fill-fg" />
            <!-- central equivalence stamp -->
            <circle cx="128" cy="120" r="22" class="fill-accent stroke-fg" stroke-width="4" />
            <path d="M116 120 L125 129 L141 113" class="stroke-bg" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            <!-- "X tests pass" label below stamp -->
            <rect x="92" y="206" width="72" height="22" rx="11" class="fill-fg" />
            <text x="128" y="221" text-anchor="middle" class="label-fg fill-bg" font-family="-apple-system, system-ui, sans-serif" font-size="10" font-weight="700">≡ tests pass</text>
          </svg>

          <!-- 3: Lexicon packs — three solid 3D packs on a shelf with
               labels and version tags, a floating dashed 4th slot with
               "+", motion arrows showing it dropping in, and a side
               panel showing "lexicon.yaml" config file. -->
          <svg
            v-else-if="i === 3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="none"
          >
            <ellipse cx="128" cy="160" rx="125" ry="90" class="bg-soft" />
            <!-- shelf with thickness -->
            <line x1="14" y1="220" x2="242" y2="220" class="stroke-fg" stroke-width="5" stroke-linecap="round" />
            <line x1="14" y1="224" x2="242" y2="224" class="stroke-fg" stroke-width="2" stroke-linecap="round" opacity="0.4" />
            <!-- pack 1 (EN) — front-left -->
            <g transform="translate(20, 140)">
              <path d="M0 60 L0 24 L36 6 L72 24 L72 60 L36 78 Z" class="fill-soft stroke-fg" stroke-width="4" stroke-linejoin="round" />
              <path d="M0 24 L36 42 L72 24" class="stroke-fg" stroke-width="3" fill="none" />
              <path d="M36 42 L36 78" class="stroke-fg" stroke-width="3" />
              <text x="36" y="64" text-anchor="middle" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="14" font-weight="700">EN</text>
              <!-- version tag -->
              <rect x="6" y="68" width="28" height="10" rx="4" class="fill-fg" />
              <text x="20" y="76" text-anchor="middle" class="label-fg fill-bg" font-family="-apple-system, system-ui, sans-serif" font-size="7" font-weight="700">v3.1</text>
            </g>
            <!-- pack 2 (中) — middle, accent-coded -->
            <g transform="translate(92, 130)">
              <path d="M0 60 L0 24 L36 6 L72 24 L72 60 L36 78 Z" class="fill-accent stroke-fg" stroke-width="4" stroke-linejoin="round" />
              <path d="M0 24 L36 42 L72 24" class="stroke-fg" stroke-width="3" fill="none" />
              <path d="M36 42 L36 78" class="stroke-fg" stroke-width="3" />
              <text x="36" y="64" text-anchor="middle" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="16" font-weight="700">中</text>
              <rect x="6" y="68" width="28" height="10" rx="4" class="fill-fg" />
              <text x="20" y="76" text-anchor="middle" class="label-fg fill-bg" font-family="-apple-system, system-ui, sans-serif" font-size="7" font-weight="700">v2.4</text>
            </g>
            <!-- pack 3 (DE) — right -->
            <g transform="translate(164, 140)">
              <path d="M0 60 L0 24 L36 6 L72 24 L72 60 L36 78 Z" class="fill-soft stroke-fg" stroke-width="4" stroke-linejoin="round" />
              <path d="M0 24 L36 42 L72 24" class="stroke-fg" stroke-width="3" fill="none" />
              <path d="M36 42 L36 78" class="stroke-fg" stroke-width="3" />
              <text x="36" y="64" text-anchor="middle" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="14" font-weight="700">DE</text>
              <rect x="6" y="68" width="28" height="10" rx="4" class="fill-fg" />
              <text x="20" y="76" text-anchor="middle" class="label-fg fill-bg" font-family="-apple-system, system-ui, sans-serif" font-size="7" font-weight="700">v1.7</text>
            </g>
            <!-- floating "fourth" pack slot (dashed) with + and motion lines -->
            <g transform="translate(92, 20)">
              <path d="M0 60 L0 24 L36 6 L72 24 L72 60 L36 78 Z" class="stroke-fg" stroke-width="4" stroke-dasharray="6 5" stroke-linejoin="round" fill="none" />
              <line x1="36" y1="28" x2="36" y2="58" class="stroke-fg" stroke-width="5" stroke-linecap="round" />
              <line x1="21" y1="43" x2="51" y2="43" class="stroke-fg" stroke-width="5" stroke-linecap="round" />
            </g>
            <!-- motion arrows (showing pack dropping in) -->
            <g class="stroke-fg" stroke-width="2.5" stroke-linecap="round" opacity="0.6">
              <line x1="128" y1="100" x2="128" y2="112" />
              <line x1="124" y1="108" x2="128" y2="116" />
              <line x1="132" y1="108" x2="128" y2="116" />
            </g>
            <!-- config file panel (right side) -->
            <g transform="translate(208, 60)">
              <rect x="0" y="0" width="42" height="56" rx="4" class="fill-bg stroke-fg" stroke-width="3" />
              <path d="M30 0 L42 12 L30 12 Z" class="fill-soft stroke-fg" stroke-width="2" />
              <text x="6" y="22" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="6" font-weight="700">lexicon</text>
              <text x="6" y="29" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="6" font-weight="700">.yaml</text>
              <g class="stroke-fg" stroke-width="1.5" stroke-linecap="round">
                <line x1="4" y1="36" x2="34" y2="36" />
                <line x1="4" y1="42" x2="28" y2="42" />
                <line x1="4" y1="48" x2="36" y2="48" />
              </g>
            </g>
            <!-- connector line from yaml to "+" slot -->
            <path d="M208 75 Q180 65 168 50" class="stroke-fg" stroke-width="2" stroke-dasharray="3 3" fill="none" />
          </svg>

          <!-- 4: Drop-in transports — chip with inner circuit lines
               and "Aster" label, three labeled connector cables
               (REST/GraphQL/WebSocket) with HTTP-method badges and
               data-packet dots flowing along each cable. -->
          <svg
            v-else-if="i === 4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="none"
          >
            <ellipse cx="128" cy="140" rx="120" ry="100" class="bg-soft" />
            <!-- chip outer rect -->
            <rect x="84" y="100" width="88" height="88" rx="12" class="fill-bg stroke-fg" stroke-width="5" />
            <!-- chip pins (top + bottom) -->
            <g class="stroke-fg" stroke-width="3" stroke-linecap="round">
              <line x1="96" y1="100" x2="96" y2="90" />
              <line x1="112" y1="100" x2="112" y2="90" />
              <line x1="128" y1="100" x2="128" y2="90" />
              <line x1="144" y1="100" x2="144" y2="90" />
              <line x1="160" y1="100" x2="160" y2="90" />
              <line x1="96" y1="198" x2="96" y2="188" />
              <line x1="112" y1="198" x2="112" y2="188" />
              <line x1="128" y1="198" x2="128" y2="188" />
              <line x1="144" y1="198" x2="144" y2="188" />
              <line x1="160" y1="198" x2="160" y2="188" />
            </g>
            <!-- chip inner core -->
            <rect x="100" y="116" width="56" height="56" rx="6" class="fill-soft" />
            <!-- circuit lines inside core -->
            <g class="stroke-fg" stroke-width="2" stroke-linecap="round" opacity="0.7">
              <line x1="108" y1="128" x2="148" y2="128" />
              <line x1="108" y1="140" x2="132" y2="140" />
              <line x1="138" y1="140" x2="148" y2="140" />
              <line x1="108" y1="152" x2="124" y2="152" />
              <line x1="130" y1="152" x2="148" y2="152" />
              <line x1="120" y1="160" x2="148" y2="160" />
            </g>
            <!-- "Aster" label centered on core -->
            <text x="128" y="148" text-anchor="middle" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="9" font-weight="700" opacity="0.5">Aster</text>
            <!-- left cable: REST + GET/POST badge -->
            <path d="M10 50 Q56 50 56 120 L84 120" class="stroke-fg" stroke-width="5" stroke-linecap="round" fill="none" />
            <rect x="4" y="42" width="14" height="20" rx="2" class="fill-fg" />
            <text x="22" y="40" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="12" font-weight="700">REST</text>
            <text x="22" y="56" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="8" opacity="0.6">/api/v1</text>
            <!-- data packet dots on REST cable -->
            <g class="fill-fg">
              <circle cx="42" cy="56" r="2.5" />
              <circle cx="56" cy="84" r="2.5" />
              <circle cx="72" cy="118" r="2.5" />
            </g>
            <!-- right cable: GraphQL + schema indicator -->
            <path d="M246 50 Q200 50 200 120 L172 120" class="stroke-accent" stroke-width="5" stroke-linecap="round" fill="none" />
            <rect x="238" y="42" width="14" height="20" rx="2" class="fill-accent" />
            <text x="234" y="40" text-anchor="end" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="12" font-weight="700">GraphQL</text>
            <text x="234" y="56" text-anchor="end" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="8" opacity="0.6">/schema</text>
            <g class="fill-accent">
              <circle cx="214" cy="56" r="2.5" />
              <circle cx="200" cy="84" r="2.5" />
              <circle cx="184" cy="118" r="2.5" />
            </g>
            <!-- bottom cable: WebSocket + bidirectional indicator -->
            <path d="M128 250 L128 188" class="stroke-fg" stroke-width="5" stroke-linecap="round" />
            <rect x="121" y="248" width="14" height="14" rx="2" class="fill-fg" />
            <text x="148" y="238" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="12" font-weight="700">WS</text>
            <text x="148" y="252" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="8" opacity="0.6">stream</text>
            <!-- bidirectional WS dots (up + down) -->
            <g class="fill-fg">
              <circle cx="128" cy="210" r="2.5" />
              <circle cx="128" cy="228" r="2.5" />
            </g>
            <!-- bidirectional arrows next to WS cable -->
            <g class="stroke-fg" stroke-width="2" stroke-linecap="round" opacity="0.6">
              <path d="M116 218 L116 210" />
              <path d="M114 212 L116 210 L118 212" fill="none" />
              <path d="M140 218 L140 226" />
              <path d="M138 224 L140 226 L142 224" fill="none" />
            </g>
          </svg>

          <!-- 5: Apache-2.0 license — layered shield watermark, tilted
               document with title block + body paragraphs + signature
               + date line + serrated official seal with ✓, small "MIT
               compatible" sub-badge. -->
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="none"
          >
            <ellipse cx="128" cy="140" rx="120" ry="100" class="bg-soft" />
            <!-- outer shield watermark -->
            <path d="M128 16 L196 40 V120 Q196 188 128 232 Q60 188 60 120 V40 Z" class="fill-soft stroke-fg" stroke-width="4" />
            <!-- inner shield outline (layered effect) -->
            <path d="M128 32 L184 52 V120 Q184 176 128 214 Q72 176 72 120 V52 Z" class="stroke-fg" stroke-width="2" opacity="0.4" fill="none" />
            <!-- document, tilted slightly -->
            <g transform="rotate(-4, 128, 130)">
              <path d="M62 48 H158 L190 80 V222 H62 Z" class="fill-bg stroke-fg" stroke-width="5" stroke-linejoin="round" />
              <!-- folded corner shadow -->
              <path d="M158 48 V80 H190" class="stroke-fg" stroke-width="5" fill="none" stroke-linejoin="round" />
              <path d="M158 48 L190 80" class="stroke-fg" stroke-width="2" opacity="0.3" />
              <!-- title block bar -->
              <rect x="74" y="92" width="100" height="20" rx="4" class="fill-fg" />
              <text x="124" y="106" text-anchor="middle" class="label-fg fill-bg" font-family="-apple-system, system-ui, sans-serif" font-size="11" font-weight="700">APACHE 2.0</text>
              <!-- "Version 2.0, January 2004" subtitle -->
              <text x="124" y="124" text-anchor="middle" class="label-fg" font-family="-apple-system, system-ui, sans-serif" font-size="7" opacity="0.5">Version 2.0 · January 2004</text>
              <!-- body paragraphs (multiple aligned lines) -->
              <g class="stroke-fg" stroke-width="2" stroke-linecap="round">
                <line x1="74" y1="138" x2="170" y2="138" />
                <line x1="74" y1="146" x2="164" y2="146" />
                <line x1="74" y1="154" x2="170" y2="154" />
                <line x1="74" y1="162" x2="150" y2="162" />
                <!-- paragraph break -->
                <line x1="74" y1="176" x2="170" y2="176" />
                <line x1="74" y1="184" x2="158" y2="184" />
                <line x1="74" y1="192" x2="170" y2="192" />
                <line x1="74" y1="200" x2="140" y2="200" />
              </g>
              <!-- signature line -->
              <path d="M74 214 q10 -6 18 0 q10 4 16 -2 q8 -4 14 2 q8 4 16 -3" class="stroke-fg" stroke-width="2" fill="none" stroke-linecap="round" />
            </g>
            <!-- "OSS compatible" sub-badge (top-left of document) -->
            <rect x="10" y="48" width="44" height="16" rx="8" class="fill-fg" />
            <text x="32" y="59" text-anchor="middle" class="label-fg fill-bg" font-family="-apple-system, system-ui, sans-serif" font-size="8" font-weight="700">OSI ✓</text>
            <!-- official seal — serrated edge ring + ✓ stamp -->
            <g transform="translate(192, 192)">
              <!-- serrated outer (12 teeth on a circle) -->
              <g class="fill-accent">
                <circle cx="0" cy="0" r="32" />
              </g>
              <!-- serrations: small triangles around -->
              <g class="fill-accent">
                <polygon points="0,-36 -4,-30 4,-30" />
                <polygon points="18,-31 14,-26 22,-25" />
                <polygon points="31,-18 25,-14 26,-22" />
                <polygon points="36,0 30,-4 30,4" />
                <polygon points="31,18 25,14 26,22" />
                <polygon points="18,31 14,26 22,25" />
                <polygon points="0,36 -4,30 4,30" />
                <polygon points="-18,31 -14,26 -22,25" />
                <polygon points="-31,18 -25,14 -26,22" />
                <polygon points="-36,0 -30,-4 -30,4" />
                <polygon points="-31,-18 -25,-14 -26,-22" />
                <polygon points="-18,-31 -14,-26 -22,-25" />
              </g>
              <!-- inner ring -->
              <circle cx="0" cy="0" r="24" class="stroke-bg" stroke-width="2" fill="none" />
              <!-- ✓ checkmark -->
              <path d="M-12 0 L-3 9 L13 -8" class="stroke-bg" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              <!-- text around inner ring (top arc) -->
              <text class="label-fg fill-bg" font-family="-apple-system, system-ui, sans-serif" font-size="6" font-weight="700">
                <textPath href="#sealArcTop" startOffset="50%" text-anchor="middle">CERTIFIED</textPath>
              </text>
              <defs>
                <path id="sealArcTop" d="M-18 0 A18 18 0 0 1 18 0" fill="none" />
              </defs>
            </g>
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
  min-height: 22rem;
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
  width: 16rem;
  height: 16rem;
  filter: drop-shadow(0 8px 24px var(--tone-shadow));
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
    width: 11rem;
    height: 11rem;
  }
  .tagline-text {
    font-size: 0.95rem;
  }
  .tagline-stage {
    min-height: 17rem;
  }
}
</style>
