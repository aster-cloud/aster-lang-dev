# Beitragen

> 15-Minuten-Tutorial, um Ihre Sprache zu Aster Lang hinzuzufügen.

## TL;DR

```bash
# 1. Template forken
git clone https://github.com/aster-cloud/aster-lang-template aster-lang-ja
cd aster-lang-ja

# 2. JSON übersetzen
$EDITOR src/main/resources/lexicons/template-XX-XX.json
# → in ja-JP.json umbenennen, TODO_TRANSLATE_* durch japanische Begriffe ersetzen

# 3. Validieren
./gradlew validateLexicon

# 4. Testen
./gradlew test

# 5. PR an aster-cloud/aster-lang-ja öffnen
```

## Ausführliches Tutorial

Siehe [aster-lang-template/README.md](https://github.com/aster-cloud/aster-lang-template/blob/main/README.md).

## Verhaltenskodex & DCO

Maßgebliche Version: [aster-lang-en/CONTRIBUTING.md](https://github.com/aster-cloud/aster-lang-en/blob/main/CONTRIBUTING.md) (deutsche Übersetzung: [aster-lang-de/CONTRIBUTING.md](https://github.com/aster-cloud/aster-lang-de/blob/main/CONTRIBUTING.md)).

## Belohnungen

- ✅ Apache 2.0 Lizenz — Sie behalten Ihre Mitwirkungs-Attribution
- 🏷️ **Aster Language Steward**-Abzeichen (≥ 2 Lexika mergen oder 1 ≥ 12 Monate pflegen)
- 💰 **¥3.000 / Jahr Plattform-Guthaben** (Steward-exklusiv)
- 📝 Öffentliche Mitwirkenden-Liste
- 🎙️ Priorisierte Teilnahme an neuen SPI ABI-Designdiskussionen

## Hilfe benötigt?

- [GitHub Discussions](https://github.com/aster-cloud/aster-lang-core/discussions) — öffentliche Q&A
- [Discord (geplant)](https://aster-lang.cloud/community) — Echtzeit-Chat folgt
