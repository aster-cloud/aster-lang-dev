<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const lines = [
  { text: 'Module Pricing.', cls: 'kw' },
  { text: '', cls: '' },
  { text: 'Rule approve given order:', cls: 'kw' },
  { text: '  order.total < 1000', cls: 'expr' },
  { text: '  order.region = "US"', cls: 'expr' },
]

const requestLines = [
  'POST /api/v1/evaluate',
  'Content-Type: application/json',
  '',
  '{ "context": {',
  '    "total": 500,',
  '    "region": "US"',
  '  }',
  '}',
]

const responseLines = [
  '200 OK',
  '',
  '{ "result": true,',
  '  "matched": "approve",',
  '  "durationMs": 3',
  '}',
]

const phase = ref(0) // 0=typing policy, 1=sending request, 2=showing response, 3=pause
const visibleLines = ref(0)
const requestVisible = ref(0)
const responseVisible = ref(0)
const showCursor = ref(true)
const showArrow = ref(false)
const showResponseArrow = ref(false)

let timer: ReturnType<typeof setTimeout> | null = null
let cursorTimer: ReturnType<typeof setInterval> | null = null

function step() {
  if (phase.value === 0) {
    if (visibleLines.value < lines.length) {
      visibleLines.value++
      timer = setTimeout(step, 280)
    } else {
      showArrow.value = true
      phase.value = 1
      timer = setTimeout(step, 600)
    }
  } else if (phase.value === 1) {
    if (requestVisible.value < requestLines.length) {
      requestVisible.value++
      timer = setTimeout(step, 180)
    } else {
      showResponseArrow.value = true
      phase.value = 2
      timer = setTimeout(step, 500)
    }
  } else if (phase.value === 2) {
    if (responseVisible.value < responseLines.length) {
      responseVisible.value++
      timer = setTimeout(step, 180)
    } else {
      phase.value = 3
      timer = setTimeout(step, 3000)
    }
  } else {
    // 重置循环
    visibleLines.value = 0
    requestVisible.value = 0
    responseVisible.value = 0
    showArrow.value = false
    showResponseArrow.value = false
    phase.value = 0
    timer = setTimeout(step, 500)
  }
}

onMounted(() => {
  timer = setTimeout(step, 800)
  cursorTimer = setInterval(() => {
    showCursor.value = !showCursor.value
  }, 530)
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
  if (cursorTimer) clearInterval(cursorTimer)
})
</script>

<template>
  <div class="hero-animation">
    <!-- 策略编辑器 -->
    <div class="anim-card editor-card">
      <div class="card-header">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
        <span class="card-title">policy.aster</span>
      </div>
      <div class="card-body code">
        <div
          v-for="(line, i) in lines"
          :key="i"
          class="code-line"
          :class="{ visible: i < visibleLines, [line.cls]: true }"
        >
          <span class="line-num">{{ i + 1 }}</span>
          <span class="line-text">{{ line.text }}</span>
        </div>
        <span v-if="phase === 0" class="cursor" :class="{ blink: showCursor }">|</span>
      </div>
    </div>

    <!-- 箭头: 策略 → API -->
    <div class="arrow-row">
      <svg class="arrow-svg" :class="{ visible: showArrow }" viewBox="0 0 40 24" fill="none">
        <path d="M4 12h28m0 0l-6-5m6 5l-6 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <!-- API 请求 -->
    <div class="anim-card request-card">
      <div class="card-header">
        <span class="badge post">POST</span>
        <span class="card-title">/api/v1/evaluate</span>
      </div>
      <div class="card-body code small">
        <div
          v-for="(line, i) in requestLines"
          :key="'r' + i"
          class="code-line"
          :class="{ visible: i < requestVisible }"
        >
          <span class="line-text">{{ line }}</span>
        </div>
      </div>
    </div>

    <!-- 箭头: API → 响应 -->
    <div class="arrow-row">
      <svg class="arrow-svg" :class="{ visible: showResponseArrow }" viewBox="0 0 40 24" fill="none">
        <path d="M4 12h28m0 0l-6-5m6 5l-6 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <!-- API 响应 -->
    <div class="anim-card response-card">
      <div class="card-header">
        <span class="badge ok">200</span>
        <span class="card-title">Response</span>
      </div>
      <div class="card-body code small">
        <div
          v-for="(line, i) in responseLines"
          :key="'s' + i"
          class="code-line"
          :class="{ visible: i < responseVisible }"
        >
          <span class="line-text">{{ line }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-animation {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 340px;
  font-family: 'SF Mono', 'Fira Code', Menlo, Consolas, monospace;
  user-select: none;
}

.anim-card {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 12px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.dot.red { background: #ef4444; }
.dot.yellow { background: #f59e0b; }
.dot.green { background: #22c55e; }

.card-title {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.badge {
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.badge.post {
  background: #dbeafe;
  color: #2563eb;
}
.badge.ok {
  background: #dcfce7;
  color: #16a34a;
}

.dark .badge.post {
  background: #1e3a5f;
  color: #60a5fa;
}
.dark .badge.ok {
  background: #14532d;
  color: #4ade80;
}

.card-body {
  padding: 10px 12px;
  min-height: 40px;
}

.card-body.code {
  font-size: 13px;
  line-height: 1.6;
}

.card-body.small {
  font-size: 11.5px;
  line-height: 1.5;
}

.code-line {
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.25s ease, transform 0.25s ease;
  white-space: pre;
  display: flex;
  gap: 8px;
}

.code-line.visible {
  opacity: 1;
  transform: translateY(0);
}

.line-num {
  color: var(--vp-c-text-3);
  width: 16px;
  text-align: right;
  flex-shrink: 0;
  font-size: 11px;
}

.line-text {
  color: var(--vp-c-text-1);
}

.code-line.kw .line-text {
  color: #6366f1;
}

.dark .code-line.kw .line-text {
  color: #a5b4fc;
}

.code-line.expr .line-text {
  color: var(--vp-c-text-1);
}

.cursor {
  color: #6366f1;
  font-weight: 700;
  opacity: 0;
  transition: opacity 0.1s;
}
.cursor.blink {
  opacity: 1;
}

.arrow-row {
  display: flex;
  justify-content: center;
  height: 24px;
}

.arrow-svg {
  width: 40px;
  height: 24px;
  color: var(--vp-c-text-3);
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.arrow-svg.visible {
  opacity: 1;
  transform: translateY(0);
}

/* 响应式：在小屏幕隐藏 */
@media (max-width: 960px) {
  .hero-animation {
    display: none;
  }
}
</style>
