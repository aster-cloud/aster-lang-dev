# How to Contribute

> 15-minute tutorial to add your language to Aster Lang.

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

See [aster-lang-en/CONTRIBUTING.md](https://github.com/aster-cloud/aster-lang-en/blob/main/CONTRIBUTING.md) — the authoritative contribution guide.

Translations:
- [中文](https://github.com/aster-cloud/aster-lang-zh/blob/main/CONTRIBUTING.md)
- [Deutsch](https://github.com/aster-cloud/aster-lang-de/blob/main/CONTRIBUTING.md)

## Rewards

- ✅ Apache 2.0 license — you retain attribution
- 🏷️ **Aster Language Steward** badge (merge ≥ 2 lexicons or maintain 1 for ≥ 12 months)
- 💰 **¥3,000 / year platform credit** (Steward-exclusive)
- 📝 Listed publicly in contributor roster
- 🎙️ Priority participation in new SPI ABI design discussions

## Need help?

- [GitHub Discussions](https://github.com/aster-cloud/aster-lang-core/discussions) — public Q&A
- [discord.aster-lang.cloud](https://aster-lang.cloud/community) — real-time chat (planned)
