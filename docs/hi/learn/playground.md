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
    <h1>प्लेग्राउंड</h1>
    <p>Aster CNL नीतियाँ रीयल-टाइम में लिखें और संकलित करें। कोई सर्वर आवश्यक नहीं — पूरा कंपाइलर आपके ब्राउज़र में चलता है।</p>
  </div>
  <AsterPlayground initialLexicon="HI_IN" />
  <div class="playground-hints">
    <div class="hint-card">
      <strong>भाषा</strong>
      <span>English, 中文, Deutsch और हिन्दी locale के बीच स्विच करें। सभी एक ही Core IR में संकलित होते हैं।</span>
    </div>
    <div class="hint-card">
      <strong>टेम्पलेट</strong>
      <span>पूर्व-निर्मित उदाहरण लोड करें: मूल नियम, पात्रता जाँच, अंकगणित।</span>
    </div>
    <div class="hint-card">
      <strong>आउटपुट टैब</strong>
      <span>डायग्नोस्टिक्स, स्कीमा, Core IR और नमूना इनपुट — सभी टाइप करते ही अपडेट होते हैं।</span>
    </div>
    <div class="hint-card">
      <strong>दो इंजन</strong>
      <span>ब्राउज़र का TypeScript इंजन और सर्वर का Java/Truffle इंजन बाइट-दर-बाइट समान परिणाम देते हैं।</span>
    </div>
  </div>
</div>
