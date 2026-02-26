<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

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
    label: 'Evaluate',
    subtitle: 'POST /api/v1/policies/evaluate',
    lines: [
      { text: 'POST', cls: 'kw', indent: 0 },
      { text: '/api/v1/policies/{id}/evaluate', cls: 'str', indent: 0 },
      { text: '', cls: '', indent: 0 },
      { text: '{', cls: 'punc', indent: 0 },
      { text: '"context":', cls: 'key', indent: 1 },
      { text: '{ "total": 500,', cls: 'val', indent: 2 },
      { text: '"region": "US" }', cls: 'val', indent: 2 },
      { text: '}', cls: 'punc', indent: 0 },
      { text: '', cls: '', indent: 0 },
      { text: '// Response', cls: 'comment', indent: 0 },
      { text: '{ "result": true,', cls: 'res', indent: 0 },
      { text: '  "durationMs": 3 }', cls: 'res', indent: 0 },
    ],
  },
  {
    label: 'Source',
    subtitle: 'POST /api/v1/policies/evaluate-source',
    lines: [
      { text: 'POST', cls: 'kw', indent: 0 },
      { text: '/api/v1/policies/evaluate-source', cls: 'str', indent: 0 },
      { text: '', cls: '', indent: 0 },
      { text: '{', cls: 'punc', indent: 0 },
      { text: '"source":', cls: 'key', indent: 1 },
      { text: '"Module Pricing.\\n', cls: 'val', indent: 2 },
      { text: ' Rule approve given order:\\n', cls: 'val', indent: 2 },
      { text: '   order.total < 1000"', cls: 'val', indent: 2 },
      { text: '"context": { "total": 200 }', cls: 'key', indent: 1 },
      { text: '}', cls: 'punc', indent: 0 },
      { text: '', cls: '', indent: 0 },
      { text: '// => { "result": true }', cls: 'comment', indent: 0 },
    ],
  },
  {
    label: 'Batch',
    subtitle: 'POST /api/v1/policies/batch',
    lines: [
      { text: 'POST', cls: 'kw', indent: 0 },
      { text: '/api/v1/policies/batch', cls: 'str', indent: 0 },
      { text: '', cls: '', indent: 0 },
      { text: '{', cls: 'punc', indent: 0 },
      { text: '"policyId": "pricing-v2",', cls: 'key', indent: 1 },
      { text: '"requests": [', cls: 'key', indent: 1 },
      { text: '{ "total": 500 },', cls: 'val', indent: 2 },
      { text: '{ "total": 2000 },', cls: 'val', indent: 2 },
      { text: '{ "total": 100 }', cls: 'val', indent: 2 },
      { text: ']', cls: 'punc', indent: 1 },
      { text: '}', cls: 'punc', indent: 0 },
      { text: '// => [true, false, true]', cls: 'comment', indent: 0 },
    ],
  },
]

const badges = ['REST API', 'Type-Safe', 'Multi-tenant']

const active = ref(0)
let interval: ReturnType<typeof setInterval> | null = null

function setActive(index: number) {
  active.value = index
  restartInterval()
}

function restartInterval() {
  if (interval) clearInterval(interval)
  interval = setInterval(() => {
    active.value = (active.value + 1) % cards.length
  }, 3000)
}

onMounted(() => {
  restartInterval()
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<template>
  <div class="hero-animation">
    <div class="card-wrapper">
      <!-- 倾斜背景层 -->
      <div class="bg-tilt"></div>
      <!-- 主卡片 -->
      <div class="main-card">
        <div class="card-inner">
          <!-- 窗口控制按钮 -->
          <div class="window-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>

          <!-- API 标签切换 -->
          <div class="tabs">
            <button
              v-for="(card, i) in cards"
              :key="i"
              class="tab"
              :class="{ active: active === i }"
              @click="setActive(i)"
            >
              {{ card.label }}
            </button>
          </div>

          <!-- 代码卡片容器 -->
          <div class="code-container">
            <div
              v-for="(card, ci) in cards"
              :key="ci"
              class="code-card"
              :class="{ visible: active === ci, hidden: active !== ci }"
            >
              <div class="code-subtitle">
                api-request <span class="subtitle-accent">— {{ card.subtitle }}</span>
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

          <!-- 功能徽章 -->
          <div class="badge-row">
            <span v-for="badge in badges" :key="badge" class="badge">{{ badge }}</span>
          </div>

          <!-- 进度条 -->
          <div class="progress-row">
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
.hero-animation {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  user-select: none;
}

.card-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
}

/* 倾斜背景层 */
.bg-tilt {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #ede9fe, #e0e7ff);
  border-radius: 24px;
  transform: rotate(3deg);
}

.dark .bg-tilt {
  background: linear-gradient(135deg, #2e1065, #1e1b4b);
}

/* 主卡片 */
.main-card {
  position: absolute;
  inset: 0;
  background: var(--vp-c-bg);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--vp-c-divider);
  transform: rotate(-1deg);
  overflow: hidden;
}

.dark .main-card {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2);
}

.card-inner {
  padding: 28px 28px 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 窗口圆点 */
.window-dots {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dot.red { background: #f87171; }
.dot.yellow { background: #fbbf24; }
.dot.green { background: #4ade80; }

/* 标签切换 */
.tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}

.tab {
  padding: 4px 12px;
  font-size: 12px;
  font-family: 'SF Mono', 'Fira Code', Menlo, Consolas, monospace;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-3);
}

.tab.active {
  background: #ede9fe;
  color: #6366f1;
  font-weight: 500;
}

.dark .tab.active {
  background: #2e1065;
  color: #a5b4fc;
}

/* 代码区域 */
.code-container {
  position: relative;
  flex: 1;
  min-height: 0;
}

.code-card {
  position: absolute;
  inset: 0;
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.code-card.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.code-card.hidden {
  opacity: 0;
  transform: translateY(12px);
  pointer-events: none;
}

.code-subtitle {
  font-size: 11px;
  color: var(--vp-c-text-3);
  font-family: 'SF Mono', 'Fira Code', Menlo, Consolas, monospace;
  margin-bottom: 12px;
}

.subtitle-accent {
  color: #6366f1;
}

.dark .subtitle-accent {
  color: #a5b4fc;
}

.code-lines {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-family: 'SF Mono', 'Fira Code', Menlo, Consolas, monospace;
  font-size: 13px;
  line-height: 1.7;
}

.code-line {
  white-space: pre;
  min-height: 1.7em;
}

/* 语法高亮 token */
.token.kw { color: #7c3aed; font-weight: 600; }
.token.str { color: var(--vp-c-text-2); }
.token.key { color: #6366f1; }
.token.val { color: var(--vp-c-text-1); }
.token.punc { color: var(--vp-c-text-2); }
.token.comment { color: var(--vp-c-text-3); font-style: italic; }
.token.res { color: #16a34a; }

.dark .token.kw { color: #a78bfa; }
.dark .token.key { color: #a5b4fc; }
.dark .token.res { color: #4ade80; }

/* 徽章 */
.badge-row {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.badge {
  padding: 3px 12px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 999px;
  background: #ede9fe;
  color: #6d28d9;
}

.dark .badge {
  background: #2e1065;
  color: #c4b5fd;
}

.badge:nth-child(2) {
  background: #dcfce7;
  color: #15803d;
}

.dark .badge:nth-child(2) {
  background: #14532d;
  color: #86efac;
}

.badge:nth-child(3) {
  background: #dbeafe;
  color: #1d4ed8;
}

.dark .badge:nth-child(3) {
  background: #1e3a5f;
  color: #93c5fd;
}

/* 进度条 */
.progress-row {
  display: flex;
  gap: 5px;
  margin-top: 12px;
}

.progress-dot {
  height: 3px;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
  width: 16px;
  transition: all 0.3s;
}

.progress-dot.active {
  width: 32px;
  background: #6366f1;
}

.dark .progress-dot.active {
  background: #a5b4fc;
}

/* 响应式 */
@media (max-width: 960px) {
  .hero-animation {
    display: none;
  }
}
</style>
