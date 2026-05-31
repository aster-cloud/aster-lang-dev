<script setup lang="ts">
import { computed } from 'vue'
import { useUiStrings } from '../i18n/ui'

const strings = useUiStrings()
const trustBand = computed(() => strings.value.trustBand)
</script>

<template>
  <section
    class="dev-trust-band"
    :aria-label="trustBand.ariaLabel"
  >
    <div class="container">
      <p class="eyebrow">{{ trustBand.eyebrow }}</p>
      <div class="grid">
        <article
          v-for="item in trustBand.items"
          :key="item.key"
          class="card"
        >
          <span class="icon-chip" aria-hidden="true">
            <!-- Compiled: Cpu icon (lucide) -->
            <svg
              v-if="item.key === 'compiled'"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <rect x="9" y="9" width="6" height="6" />
              <path d="M15 2v2" />
              <path d="M15 20v2" />
              <path d="M2 15h2" />
              <path d="M2 9h2" />
              <path d="M20 15h2" />
              <path d="M20 9h2" />
              <path d="M9 2v2" />
              <path d="M9 20v2" />
            </svg>
            <!-- Audit: FileLock icon (lucide) -->
            <svg
              v-else-if="item.key === 'audit'"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <rect x="8" y="12" width="8" height="6" rx="1" />
              <path d="M10 12V10a2 2 0 0 1 4 0v2" />
            </svg>
            <!-- Lexicons: Globe icon (lucide) -->
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </span>
          <h3 class="title">{{ item.title }}</h3>
          <p class="desc">{{ item.desc }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dev-trust-band {
  border-top: 1px solid var(--aster-border);
  border-bottom: 1px solid var(--aster-border);
  background: var(--aster-bg-subtle);
  padding: 3.5rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.eyebrow {
  font-family: var(--aster-font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--aster-primary);
  text-align: center;
  margin: 0;
}

.grid {
  margin-top: 2rem;
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.card {
  text-align: center;
}

.icon-chip {
  display: inline-flex;
  width: 2.75rem;
  height: 2.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background: var(--aster-primary-subtle);
  color: var(--aster-primary);
  margin-bottom: 0.75rem;
}

.title {
  font-family: var(--aster-font-display);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--aster-fg);
  margin: 0 0 0.5rem 0;
}

.desc {
  font-size: 0.95rem;
  color: var(--aster-fg-muted);
  line-height: 1.5;
  margin: 0;
}
</style>
