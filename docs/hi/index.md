---
layout: home
# VPFooter छिपाएँ (home पर DevFooter, CustomLayout के layout-bottom slot से)
footer: false

hero:
  name: "Policy · Workflow · Decision"
  text: "English, 中文, Deutsch, हिन्दी में — सभी समान"
  actions:
    - theme: brand
      text: प्लेग्राउंड में शुरू करें
      link: /hi/learn/playground
    - theme: alt
      text: 5-मिनट क्विकस्टार्ट
      link: /hi/getting-started/quickstart
---

<div class="vp-doc" style="max-width: 960px; margin: 4rem auto; padding: 0 24px;">

## अपना रास्ता चुनें

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-top: 24px;">

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 👤 मैं डोमेन विशेषज्ञ हूँ

Compliance अधिकारी, जोखिम विश्लेषक या policy लेखक। आप नियम **अपनी** भाषा में लिखना चाहते हैं — AI पहला मसौदा बनाती है।

→ [**Cloud पर मुफ़्त शुरू करें**](https://aster-lang.cloud)
→ [पढ़ें: CNL त्वरित संदर्भ](/hi/learn/cnl-quick-reference)

</div>

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 👤 मैं डेवलपर हूँ

आप CNL नियम लिखना और चलाना चाहते हैं। ब्राउज़र प्लेग्राउंड से शुरू करें; `@aster-cloud/aster-lang-ts` के ज़रिए एकीकृत करें। प्रबंधित इंजन चाहिए? Aster Cloud होस्टेड REST / GraphQL / WS देता है।

→ [**प्लेग्राउंड में शुरू करें**](/hi/learn/playground)
→ [Browser SDK गाइड](/hi/learn/browser-api)
→ [Cloud API दस्तावेज़ ↗](https://aster-lang.cloud)

</div>

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 👤 मैं IT निर्णयकर्ता हूँ

आपको डेटा संप्रभुता, GDPR/PII नियंत्रण और स्पष्ट परिनियोजन पथ चाहिए। सेल्फ-होस्टिंग एक प्रथम-श्रेणी विकल्प है।

→ [परिनियोजन गाइड](/hi/learn/deployment-guide)
→ [Compliance संसाधन](/community/compliance/)

</div>

</div>

---

## Aster Lang क्या है?

Aster Lang एक **बहुभाषी Controlled Natural Language (CNL)** है जिससे निष्पादन-योग्य व्यावसायिक तर्क लिखा जाता है — ऋण-पात्रता policy, अनुमोदन-गेट workflow, रूटिंग decision, मूल्य-निर्धारण नियम, और हर वह जगह जहाँ नियम **मनुष्यों के लिए पठनीय और मशीनों के लिए निष्पादन-योग्य** हों।

भाषा **Policy**, **Workflow** और **Decision** को प्रथम-श्रेणी अवधारणाएँ मानती है: वही syntax एक पात्रता जाँच, एक अनुमोदन प्रवाह या एक रूटिंग नियम व्यक्त करता है। इंजन तीनों को एक ही ऑडिट-प्रूफ निष्पादन पथ में संकलित करता है।

```aster ignore
मॉड्यूल loan।

परिभाषित Applicant रखता है creditScore रूप में पूर्णांक, income रूप में पूर्णांक।

नियम checkEligibility दिया गया applicant रूप में Applicant, उत्पन्न पाठ:
  यदि applicant.creditScore से अधिक 700
    यदि applicant.income से अधिक 50000
      लौटाएं "स्वीकृत"।
  लौटाएं "अस्वीकृत"।
```

वही नियम अंग्रेज़ी में भी काम करता है:

```aster ignore
Module aster.finance.loan.

Define Applicant has creditScore as Int, income as Int.

Rule checkEligibility given applicant as Applicant, produce Text:
  If applicant.creditScore is at least 700
    If applicant.income is at least 50000
      Return "approved".
  Return "rejected".
```

दोनों को **एक ही इंजन** द्वारा parse, type-check और निष्पादित किया जाता है।

---

## हमने यह क्यों बनाया

व्यावसायिक नियम आज तीन जगह रहते हैं:

1. **कोड में दबे** — केवल डेवलपर बदल सकते हैं; कानूनी टीम पढ़ नहीं सकती।
2. **Excel/Word में** — पठनीय, पर कभी निष्पादित नहीं; drift तय है।
3. **Low-code टूल में** — किसी के लिए पठनीय नहीं और केवल एक vendor के runtime में निष्पादन-योग्य।

Aster Lang चौथा विकल्प है: **ऐसे नियम जो ज्ञापन की तरह पढ़े जाते हैं और संकलित कोड की तरह चलते हैं**।

---

## Open Source और समुदाय

- [**aster-lang-ts**](https://github.com/aster-cloud/aster-lang-ts) — TypeScript कंपाइलर और LSP (npm: `@aster-cloud/aster-lang-ts`)
- [**aster-lang-core**](https://github.com/aster-cloud/aster-lang-core) — Java/ANTLR संदर्भ कंपाइलर
- [**Language packs**](https://github.com/aster-cloud) — `aster-lang-en` / `-zh` / `-de` / `-hi`

बग मिला? Issue खोलें। नई भाषा जोड़नी है? Lexicon पैक गाइड देखें।

</div>
