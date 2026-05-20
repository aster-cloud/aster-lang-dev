# How to Contribute

<!-- glossary:block id=contribute-how-to-contribute-blockquote-1 -->
> 15-minute tutorial to add your language to Aster Lang.
<!-- /glossary:block -->

## TL;DR

```bash
# 1. Fork the template
git clone https://github.com/aster-cloud/aster-lang-template aster-lang-ja
cd aster-lang-ja

# 2. Translate the JSON
$EDITOR src/main/resources/lexicons/template-XX-XX.json
# → rename to ja-JP.json, replace TODO_TRANSLATE_* with Japanese terms

# 3. Validate
./gradlew validateLexicon

# 4. Test
./gradlew test

# 5. Open a PR to aster-cloud/aster-lang-ja
```

## Detailed tutorial

See [aster-lang-template/README.md](https://github.com/aster-cloud/aster-lang-template/blob/main/README.md).

## Code of Conduct & DCO

<!-- glossary:block id=contribute-code-of-conduct-dco-paragraph-2 -->
See [aster-lang-en/CONTRIBUTING.md](https://github.com/aster-cloud/aster-lang-en/blob/main/CONTRIBUTING.md) — the authoritative contribution guide.
<!-- /glossary:block -->

Translations:
<!-- glossary:block id=contribute-code-of-conduct-dco-list-item-3 -->
- [中文](https://github.com/aster-cloud/aster-lang-zh/blob/main/CONTRIBUTING.md)
<!-- /glossary:block -->
<!-- glossary:block id=contribute-code-of-conduct-dco-list-item-4 -->
- [Deutsch](https://github.com/aster-cloud/aster-lang-de/blob/main/CONTRIBUTING.md)
<!-- /glossary:block -->

## Rewards

<!-- glossary:block id=contribute-rewards-list-item-5 -->
- ✅ Apache 2.0 license — you retain attribution
<!-- /glossary:block -->
<!-- glossary:block id=contribute-rewards-list-item-6 -->
- 🏷️ **Aster Language Steward** badge (merge ≥ 2 lexicons or maintain 1 for ≥ 12 months)
<!-- /glossary:block -->
<!-- glossary:block id=contribute-rewards-list-item-7 -->
- 💰 **¥3,000 / year platform credit** (Steward-exclusive)
<!-- /glossary:block -->
<!-- glossary:block id=contribute-rewards-list-item-8 -->
- 📝 Listed publicly in contributor roster
<!-- /glossary:block -->
<!-- glossary:block id=contribute-rewards-list-item-9 -->
- 🎙️ Priority participation in new SPI ABI design discussions
<!-- /glossary:block -->

## Need help?

<!-- glossary:block id=contribute-need-help-list-item-10 -->
- [GitHub Discussions](https://github.com/aster-cloud/aster-lang-core/discussions) — public Q&A
<!-- /glossary:block -->
<!-- glossary:block id=contribute-need-help-list-item-11 -->
- [discord.aster-lang.cloud](https://aster-lang.cloud/community) — real-time chat (planned)
<!-- /glossary:block -->
