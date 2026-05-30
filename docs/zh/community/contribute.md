# 如何贡献

> 15 分钟教程把您的语种加入 Aster Lang。

## TL;DR

```bash
# 1. Fork template
git clone https://github.com/aster-cloud/aster-lang-template aster-lang-ja
cd aster-lang-ja

# 2. 翻译 JSON
$EDITOR src/main/resources/lexicons/template-XX-XX.json
# → 重命名为 ja-JP.json，把 TODO_TRANSLATE_* 替换为日语术语

# 3. 校验
./gradlew validateLexicon

# 4. 测试
./gradlew test

# 5. 提 PR 到 aster-cloud/aster-lang-ja
```

## 详细教程

见 [aster-lang-template/README.md](https://github.com/aster-cloud/aster-lang-template/blob/main/README.md)。

## 行为准则 & DCO

权威版：[aster-lang-en/CONTRIBUTING.md](https://github.com/aster-cloud/aster-lang-en/blob/main/CONTRIBUTING.md)（中文译本：[aster-lang-zh/CONTRIBUTING.md](https://github.com/aster-cloud/aster-lang-zh/blob/main/CONTRIBUTING.md)）。

## 奖励

- ✅ Apache 2.0 license — 您保留贡献者署名
- 🏷️ **Aster Language Steward** 标签（合并 ≥ 2 lexicon 或维护 1 个 ≥ 12 月）
- 💰 **¥3,000 / 年 platform credit**（Steward 限定）
- 📝 公开 contributor 名录
- 🎙️ 优先参与新 SPI ABI 设计讨论

## 需要帮助？

- [GitHub Discussions](https://github.com/aster-cloud/aster-lang-core/discussions) — 公开 Q&A
- [Discord（规划中）](https://aster-lang.cloud/community) — 实时聊天即将上线
