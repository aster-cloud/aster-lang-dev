<script setup lang="ts">
import { computed } from 'vue'
import { useUiStrings } from '../i18n/ui'

const strings = useUiStrings()
const features = computed(() => strings.value.features)
</script>

<template>
  <section
    class="dev-features"
    :aria-label="features.ariaLabel"
  >
    <div class="container">
      <div class="grid">
        <article
          v-for="item in features.items"
          :key="item.key"
          class="card"
        >
          <span
            class="icon-chip"
            :class="`icon-chip--${item.tone}`"
            aria-hidden="true"
          >
            <!-- The emoji in title already conveys the icon meaning;
                 the chip is the colored block behind it that matches
                 the cloud landing TONE_BG semantic system. Inline a
                 simple bullet to anchor the chip without duplicating
                 the title's emoji. -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="12" cy="12" r="4" />
            </svg>
          </span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dev-features {
  padding: 4.5rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (max-width: 960px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background: var(--aster-bg);
  border: 1px solid var(--aster-border);
  border-radius: 12px;
  padding: 1.5rem;
  transition: box-shadow 0.2s, transform 0.2s;
}

.card:hover {
  box-shadow: 0 10px 30px -10px rgb(0 0 0 / 0.1);
}

.icon-chip {
  display: inline-flex;
  width: 2.5rem;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

/* TONE_BG mapping — matches cloud landing's icon chip color system.
 * All tokens verified to exist in @aster-cloud/tokens. */
.icon-chip--accent  { background: var(--aster-accent-subtle);  color: var(--aster-accent); }
.icon-chip--primary { background: var(--aster-primary-subtle); color: var(--aster-primary); }
.icon-chip--warning { background: var(--aster-warning-subtle); color: var(--aster-warning); }
.icon-chip--danger  { background: var(--aster-danger-subtle);  color: var(--aster-danger); }
.icon-chip--success { background: var(--aster-success-subtle); color: var(--aster-success); }
.icon-chip--neutral { background: var(--aster-bg-subtle);      color: var(--aster-fg-muted); }

h3 {
  font-family: var(--aster-font-display);
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--aster-fg);
}

p {
  color: var(--aster-fg-muted);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}
</style>
