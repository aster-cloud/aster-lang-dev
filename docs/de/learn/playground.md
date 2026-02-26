---
layout: page
sidebar: false
aside: false
---

<script setup>
import { defineAsyncComponent } from 'vue'
const AsterPlayground = defineAsyncComponent(() =>
  import('../../.vitepress/components/AsterPlayground.vue')
)
</script>

<div class="playground-page">
  <div class="playground-hero">
    <h1>Spielplatz</h1>
    <p>Schreiben und kompilieren Sie Aster-CNL-Richtlinien in Echtzeit. Kein Server erforderlich — der vollständige Compiler läuft in Ihrem Browser.</p>
  </div>
  <AsterPlayground />
  <div class="playground-hints">
    <div class="hint-card">
      <strong>Sprache</strong>
      <span>Wechseln Sie zwischen English-, 中文- und Deutsch-Locales. Alle kompilieren zur selben Kerndarstellung.</span>
    </div>
    <div class="hint-card">
      <strong>Vorlagen</strong>
      <span>Laden Sie vorgefertigte Beispiele: Grundregeln, Berechtigungsprüfungen, Struct-Typen.</span>
    </div>
    <div class="hint-card">
      <strong>Ausgabe-Tabs</strong>
      <span>Diagnose, Schema, Core IR und Beispiel-Eingaben — alle aktualisieren sich während der Eingabe.</span>
    </div>
    <div class="hint-card">
      <strong>Browser-API</strong>
      <span>Alle Funktionen programmatisch verfügbar. Siehe <a href="./browser-api">Browser-API-Referenz</a>.</span>
    </div>
  </div>
</div>
