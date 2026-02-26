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
    <h1>演练场</h1>
    <p>实时编写和编译 Aster CNL 策略。无需服务器 — 完整编译器在浏览器中运行。</p>
  </div>
  <AsterPlayground />
  <div class="playground-hints">
    <div class="hint-card">
      <strong>语言</strong>
      <span>在 English、中文和 Deutsch 区域设置之间切换。所有语言编译为相同的核心表示。</span>
    </div>
    <div class="hint-card">
      <strong>模板</strong>
      <span>加载预构建示例：基本规则、资格检查、结构体类型。</span>
    </div>
    <div class="hint-card">
      <strong>输出标签页</strong>
      <span>诊断、Schema、核心 IR 和示例输入 — 随输入实时更新。</span>
    </div>
    <div class="hint-card">
      <strong>浏览器 API</strong>
      <span>所有函数均可编程调用。参阅 <a href="./browser-api">浏览器 API 参考</a>。</span>
    </div>
  </div>
</div>
