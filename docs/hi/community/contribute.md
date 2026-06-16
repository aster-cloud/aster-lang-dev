# योगदान कैसे करें

> Aster Lang में अपनी भाषा जोड़ने का 15-मिनट ट्यूटोरियल।

## संक्षेप में (TL;DR)

```bash
# 1. टेम्पलेट fork करें
git clone https://github.com/aster-cloud/aster-lang-template aster-lang-ja
cd aster-lang-ja

# 2. JSON अनुवाद करें
$EDITOR src/main/resources/lexicons/template-XX-XX.json

# 3. बनाएँ और सत्यापित करें
./gradlew build

# 4. PR खोलें
```

## चरण

1. **टेम्पलेट fork करें** — `aster-lang-template` में एक खाली lexicon JSON है।
2. **78 कीवर्ड अनुवाद करें** — `Module`, `Rule`, `If`, `Return` आदि के अपनी भाषा के समतुल्य।
3. **विराम-चिह्न सेट करें** — वाक्य-अंत चिह्न, सूची-विभाजक, ब्लॉक-आरंभ।
4. **whitespace मोड चुनें** — स्थान-विभाजित लिपियाँ (Latin/Devanagari) `ENGLISH`, बिना-स्थान (CJK) `CHINESE`।
5. **बनाएँ और परीक्षण करें** — `./gradlew build` lexicon की पूर्णता जाँचता है।
6. **dual-engine parity जोड़ें** — आपके नमूने दोनों इंजनों (Java + TypeScript) में समान Core IR उत्पन्न करने चाहिए।

## गैर-लैटिन लिपियाँ

हिन्दी (Devanagari) abugida लिपि के लिए दो छोटे lexer परिवर्तन पर्याप्त थे: संयोजक चिह्न (matra/virama) को पहचानने वाली वर्ण-श्रेणी, और danda `।` को वाक्य-अंत चिह्न के रूप में। यदि आपकी लिपि गैर-लैटिन है, तो [GitHub Discussions](https://github.com/aster-cloud/aster-lang-core/discussions) पर पहले चर्चा करें।

## मदद चाहिए?

[GitHub Discussions](https://github.com/aster-cloud/aster-lang-core/discussions) पर पूछें या एक issue खोलें।
