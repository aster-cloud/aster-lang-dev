<script setup lang="ts">
import { computed } from 'vue'
import { useUiStrings } from '../i18n/ui'

const strings = useUiStrings()
const apiRefLink = computed(() => strings.value.hero.apiRefLink)
const siblingLink = computed(() => strings.value.hero.siblingLink)
</script>

<template>
  <div class="hero-subtle-links">
    <a :href="apiRefLink.href" class="hero-link-secondary">
      {{ apiRefLink.text }} →
    </a>
    <span class="hero-link-divider" aria-hidden="true">·</span>
    <a :href="siblingLink.href" class="hero-link-sibling">
      {{ siblingLink.text }} →
    </a>
  </div>
</template>
