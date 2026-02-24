---
layout: page
sidebar: false
aside: false
---

<script setup>
import { defineAsyncComponent } from 'vue'
const AsterPlayground = defineAsyncComponent(() =>
  import('../.vitepress/components/AsterPlayground.vue')
)
</script>

<div class="playground-page">
  <div class="playground-hero">
    <h1>Playground</h1>
    <p>Write and compile Aster CNL policies in real time. No server required — the full compiler runs in your browser.</p>
  </div>
  <AsterPlayground />
  <div class="playground-hints">
    <div class="hint-card">
      <strong>Language</strong>
      <span>Switch between English, 中文, and Deutsch locales. All compile to the same core representation.</span>
    </div>
    <div class="hint-card">
      <strong>Templates</strong>
      <span>Load pre-built examples: basic rules, eligibility checks, struct types.</span>
    </div>
    <div class="hint-card">
      <strong>Output Tabs</strong>
      <span>Diagnostics, Schema, Core IR, and Sample Inputs — all update as you type.</span>
    </div>
    <div class="hint-card">
      <strong>Browser API</strong>
      <span>All functions available programmatically. See <a href="./browser-api">Browser API Reference</a>.</span>
    </div>
  </div>
</div>
