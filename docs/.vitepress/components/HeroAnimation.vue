<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useUiStrings } from '../i18n/ui'

interface CodeLine {
  text: string
  cls: string
  indent?: number
}

interface Card {
  label: string
  subtitle: string
  lines: CodeLine[]
}

const cards: Card[] = [
  {
    label: 'Policy',
    subtitle: 'POST /api/v1/policies/evaluate',
    lines: [
      { text: 'POST', cls: 'kw', indent: 0 },
      { text: '/api/v1/policies/evaluate', cls: 'str', indent: 0 },
      { text: '', cls: '', indent: 0 },
      { text: '{ "context": {', cls: 'punc', indent: 0 },
      { text: '"applicant": "Alice",', cls: 'val', indent: 2 },
      { text: '"creditScore": 720', cls: 'val', indent: 2 },
      { text: '} }', cls: 'punc', indent: 0 },
      { text: '', cls: '', indent: 0 },
      { text: '// => { "approved": true }', cls: 'comment', indent: 0 },
    ],
  },
  {
    label: 'Workflow',
    subtitle: 'GET /api/v1/workflows/{id}/events',
    lines: [
      { text: 'GET', cls: 'kw', indent: 0 },
      { text: '/api/v1/workflows/wf-2401/events', cls: 'str', indent: 0 },
      { text: '', cls: '', indent: 0 },
      { text: '// => [', cls: 'punc', indent: 0 },
      { text: '{ "type": "started",  "at": "T+0s" },', cls: 'val', indent: 1 },
      { text: '{ "type": "approved", "at": "T+42s" },', cls: 'val', indent: 1 },
      { text: '{ "type": "deployed", "at": "T+45s" }', cls: 'val', indent: 1 },
      { text: ']', cls: 'punc', indent: 0 },
    ],
  },
  {
    label: 'Decision',
    subtitle: 'POST /api/v1/policies/evaluate/batch',
    lines: [
      { text: 'POST', cls: 'kw', indent: 0 },
      { text: '/api/v1/policies/evaluate/batch', cls: 'str', indent: 0 },
      { text: '', cls: '', indent: 0 },
      { text: '{ "policyId": "routing-v3",', cls: 'punc', indent: 0 },
      { text: '"requests": [', cls: 'key', indent: 1 },
      { text: '{ "tier": "gold" },', cls: 'val', indent: 2 },
      { text: '{ "tier": "silver" },', cls: 'val', indent: 2 },
      { text: '{ "tier": "bronze" } ] }', cls: 'val', indent: 2 },
      { text: '', cls: '', indent: 0 },
      { text: '// => ["queue-A", "queue-B", "queue-C"]', cls: 'comment', indent: 0 },
    ],
  },
]

const strings = useUiStrings()
const badges = computed(() => strings.value.hero.badges)
const requestLabel = computed(() => strings.value.hero.requestLabel)
const animationLabel = computed(() => strings.value.hero.animationLabel)

const active = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

// 守卫:mobile 不轮播(屏幕太小,卡片切换视觉噪音);reduced-motion
// 不轮播(WCAG 2.3.3 — 用户系统级关闭动画意图)。两个守卫 OR 组合,
// 任一触发即停。
const mql = typeof window !== 'undefined'
  ? window.matchMedia('(max-width: 960px)')
  : null
const reducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null

function startCycle() {
  if (mql?.matches || reducedMotion?.matches) return
  timer = setInterval(() => {
    active.value = (active.value + 1) % cards.length
  }, 3200)
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

function setActive(index: number) {
  active.value = index
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
</script>

<template>
  <div
    class="hero-animation"
    role="img"
    :aria-label="animationLabel"
  >
    <div class="card-wrapper">
      <div class="main-card">
        <div class="card-inner">
          <div class="window-dots" aria-hidden="true">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>

          <div class="tabs" role="tablist">
            <button
              v-for="(card, i) in cards"
              :key="i"
              class="tab"
              :class="{ active: active === i }"
              role="tab"
              :aria-selected="active === i"
              @click="setActive(i)"
            >
              {{ card.label }}
            </button>
          </div>

          <div class="code-container">
            <div
              v-for="(card, ci) in cards"
              :key="ci"
              class="code-card"
              :class="{ visible: active === ci, hidden: active !== ci, active: active === ci }"
            >
              <div class="code-subtitle">
                {{ requestLabel }} <span class="subtitle-accent">— {{ card.subtitle }}</span>
              </div>
              <div class="code-lines">
                <div
                  v-for="(line, li) in card.lines"
                  :key="li"
                  class="code-line"
                  :style="{ paddingLeft: (line.indent || 0) * 16 + 'px' }"
                >
                  <span :class="['token', line.cls]">{{ line.text }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="badge-row">
            <span v-for="badge in badges" :key="badge" class="badge">{{ badge }}</span>
          </div>

          <div class="progress-row" aria-hidden="true">
            <span
              v-for="(_, i) in cards"
              :key="i"
              class="progress-dot"
              :class="{ active: active === i }"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Placed via CustomLayout #home-hero-after slot — sits below VPHero,
 * full-width container, centered and capped at 720px (matches cloud's
 * CnlDemo max-w-2xl). No aspect-ratio constraint; height drives off
 * content.
 *
 * margin: 2.5rem top separates from hero CTAs; 4rem bottom gives the
 * dark zinc card breathing room before DevTrustBand starts (DevTrustBand
 * has its own border-top + 3.5rem padding-top, so this combines to
 * ~7.5rem of vertical rhythm — matches cloud's hero → trust band gap). */
.hero-animation {
  width: 100%;
  max-width: 720px;
  margin: 2.5rem auto 4rem;
  padding: 0 1.5rem;
  user-select: none;
}

.card-wrapper {
  position: relative;
  width: 100%;
}

/* 主卡 — cloud-aligned dark zinc-950 窗 + 12px 圆角 + 紫色阴影 */
.main-card {
  position: relative;
  background: #0a0a0a;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgb(139 92 246 / 0.25);
  border: 1px solid var(--aster-color-zinc-800, #27272a);
  overflow: hidden;
}

.card-inner {
  padding: 24px 24px 18px;
  display: flex;
  flex-direction: column;
}

/* macOS window dots — rose-500 / amber-500 / emerald-500 @ 70% opacity
 * 用 -500 step(所有色阶都存在;不使用 -400 因为 tokens.css 不暴露) */
.window-dots {
  display: flex;
  gap: 6px;
  margin-bottom: 14px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  opacity: 0.7;
}
.dot.red    { background: var(--aster-color-rose-500, #f43f5e); }
.dot.yellow { background: var(--aster-color-amber-500, #f59e0b); }
.dot.green  { background: var(--aster-color-emerald-500, #10b981); }

/* Tabs */
.tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 14px;
}

.tab {
  padding: 4px 12px;
  font-size: 12px;
  font-family: var(--vp-font-family-mono);
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  background: transparent;
  color: var(--aster-color-zinc-400, #a1a1aa);
}

.tab:hover {
  color: var(--aster-color-zinc-100, #f4f4f5);
}

.tab.active {
  background: var(--aster-color-violet-900, #4c1d95);
  color: var(--aster-color-violet-200, #ddd6fe);
  font-weight: 500;
}

/* Code 区域 — content-driven height (no aspect-ratio constraint).
 * Cards share the same vertical slot using grid layered children
 * (all in row/col 1), only the active card has opacity:1 so transitions
 * cross-fade in place. min-height keeps the slot stable when swapping
 * cards with different line counts. */
.code-container {
  position: relative;
  display: grid;
  min-height: 14rem;
  overflow: hidden;
}

.code-card {
  grid-area: 1 / 1;
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.code-card.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.code-card.hidden {
  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;
}

.code-subtitle {
  font-size: 11px;
  color: var(--aster-color-zinc-500, #71717a);
  font-family: var(--vp-font-family-mono);
  margin-bottom: 12px;
}

.subtitle-accent {
  color: var(--aster-color-violet-400, #a78bfa);
}

.code-lines {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.7;
  color: var(--aster-color-zinc-100, #f4f4f5);
}

.code-line {
  white-space: pre;
  min-height: 1.7em;
}

/* 语法高亮 token (token step 全部验证存在 tokens.css):
 * kw / key / str / val / punc / comment + 默认 zinc-100 */
.token.kw      { color: var(--aster-color-violet-400, #a78bfa); font-weight: 600; }
.token.str     { color: var(--aster-color-emerald-500, #10b981); }
.token.key     { color: var(--aster-color-sky-300, #7dd3fc); }
.token.val     { color: var(--aster-color-amber-500, #f59e0b); }
.token.punc    { color: var(--aster-color-zinc-300, #d4d4d8); }
/* zinc-400 (#a1a1aa) lands at ~5.5:1 on the zinc-950 code-card bg;
 * zinc-500 was ~3.5:1 (WCAG 1.4.3 fail for ≥4.5:1 normal text). */
.token.comment { color: var(--aster-color-zinc-400, #a1a1aa); font-style: italic; }

/* Badges */
.badge-row {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.badge {
  padding: 3px 12px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 999px;
  background: var(--aster-color-violet-900, #4c1d95);
  color: var(--aster-color-violet-200, #ddd6fe);
}

.badge:nth-child(2) {
  background: rgb(16 185 129 / 0.18);
  color: var(--aster-color-emerald-500, #10b981);
}

.badge:nth-child(3) {
  background: rgb(125 211 252 / 0.18);
  color: var(--aster-color-sky-300, #7dd3fc);
}

/* Progress */
.progress-row {
  display: flex;
  gap: 5px;
  margin-top: 12px;
}

.progress-dot {
  height: 3px;
  border-radius: 999px;
  background: var(--aster-color-zinc-800, #27272a);
  width: 16px;
  transition: all 0.3s;
}

.progress-dot.active {
  width: 32px;
  background: var(--aster-color-violet-400, #a78bfa);
}

/* Focus-visible (PR-5 polish — 提前 inline) */
.tab:focus-visible {
  outline: none;
  box-shadow: var(--aster-shadow-ring);
}

/* Mobile 简化版:不再 display:none(与 cloud 一致,保留视觉钩子)
 * 隐藏 tabs / badge-row / progress-row,只显示当前 active code card.
 * JS guards (mql + reducedMotion) already disable the JS cycle at
 * <=960px so `active` is always the first card here. */
@media (max-width: 960px) {
  .hero-animation {
    max-width: 100%;
    margin-top: 1.5rem;
    padding: 0 1rem;
  }
  .code-container {
    min-height: 12rem;
  }
  .tabs,
  .badge-row,
  .progress-row {
    display: none;
  }
  .code-card:not(.active) {
    display: none;
  }
}
</style>
