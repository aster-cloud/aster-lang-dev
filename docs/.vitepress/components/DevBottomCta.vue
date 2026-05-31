<script setup lang="ts">
import { computed } from 'vue'
import { useUiStrings } from '../i18n/ui'

const strings = useUiStrings()
const bottomCta = computed(() => strings.value.bottomCta)
</script>

<template>
  <section class="dev-bottom-cta">
    <div class="container">
      <h2>{{ bottomCta.title }}</h2>
      <p>{{ bottomCta.body }}</p>
      <div class="actions">
        <a :href="bottomCta.primary.href" class="btn-primary">
          {{ bottomCta.primary.text }}
        </a>
        <a :href="bottomCta.secondary.href" class="btn-secondary">
          {{ bottomCta.secondary.text }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* This is a "permanently-bright" segment (violet bg + white text/buttons)
 * that does NOT follow light/dark mode toggle. We deliberately avoid
 * var(--aster-primary-fg) here because that token reverses to zinc-950
 * in dark mode — which would render as black text on a violet background.
 * Literal #ffffff is the correct choice for an always-violet block. */
.dev-bottom-cta {
  background: var(--aster-primary);
  color: #ffffff;
  padding: 5rem 1.5rem;
  position: relative;
  overflow: hidden;
}

.dev-bottom-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top, rgb(255 255 255 / 0.1), transparent 60%);
  pointer-events: none;
}

.container {
  position: relative;
  max-width: 768px;
  margin: 0 auto;
  text-align: center;
}

h2 {
  font-family: var(--aster-font-display);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #ffffff;
}

p {
  font-size: 1.05rem;
  line-height: 1.5;
  margin: 0 0 2rem 0;
  opacity: 0.92;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  font-size: 0.95rem;
  min-height: 44px;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.btn-primary {
  background: #ffffff;
  color: var(--aster-primary);
}

.btn-primary:hover {
  background: var(--aster-color-violet-50, #f5f3ff);
}

.btn-secondary {
  background: transparent;
  color: #ffffff;
  border: 1px solid #ffffff;
}

.btn-secondary:hover {
  background: rgb(255 255 255 / 0.1);
}

.btn-primary:focus-visible,
.btn-secondary:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 3px;
}
</style>
