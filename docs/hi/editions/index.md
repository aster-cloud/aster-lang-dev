---
title: संस्करण तुलना
description: Aster Lang Open Source, Aster Lang Cloud (प्रबंधित SaaS) और Aster Lang Enterprise (स्व-होस्टेड) के बीच चुनें।
---

# संस्करण तुलना

Aster Lang तीन संस्करणों में आता है। तीनों **एक ही इंजन और एक ही भाषा** चलाते हैं — अंतर इसमें है कि इंफ्रास्ट्रक्चर कौन चलाता है और डेटा कहाँ रहता है।

::: tip मूल्य-निर्धारण
सेल्फ-सर्व टीमों के लिए, Cloud में Free और Pro प्लान हैं, सार्वजनिक मूल्य **[aster-lang.cloud/pricing](https://aster-lang.cloud/pricing)** पर। Enterprise (स्व-होस्टेड) मूल्य tenancy आकार, मूल्यांकन मात्रा और डेटा निवास पर निर्भर करता है — कोटेशन के लिए **[बिक्री से बात करें](mailto:sales@aster-lang.cloud)**।
:::

## एक नज़र में

| | Open Source | Cloud (SaaS) | Enterprise (स्व-होस्टेड) |
|---|---|---|---|
| **कौन चलाता है** | आप — अपनी मशीन पर | हम — `aster-lang.cloud` पर | आप — अपने VPC/cluster में |
| **लाइसेंस** | Apache-2.0 | सब्सक्रिप्शन | सब्सक्रिप्शन + स्थायी fallback |
| **किसके लिए सर्वोत्तम** | निर्माण, सीखना, parser एम्बेड करना | प्रबंधित multi-tenant चाहने वाली टीमें | विनियमित उद्योग, डेटा निवास, एयर-गैप्ड |
| **शुरू करें** | `npm i @aster-cloud/aster-lang-ts` | [aster-lang.cloud](https://aster-lang.cloud) | [बिक्री से संपर्क करें](mailto:sales@aster-lang.cloud) |

## विशेषता तुलना

### भाषा और इंजन

| | Open Source | Cloud | Enterprise |
|---|:---:|:---:|:---:|
| बहु-भाषा CNL (English / 中文 / Deutsch / हिन्दी) | ✅ | ✅ | ✅ |
| Java/Truffle संदर्भ इंजन | ✅ | ✅ | ✅ |
| ब्राउज़र/Node के लिए TypeScript इंजन | ✅ | ✅ | ✅ |
| LSP / VS Code एक्सटेंशन | ✅ | ✅ | ✅ |
| कस्टम language pack लेखन | ✅ | ✅ | ✅ |

### Policy निष्पादन

| | Open Source | Cloud | Enterprise |
|---|:---:|:---:|:---:|
| REST `/evaluate` endpoint | स्व-होस्ट | ✅ | ✅ |
| GraphQL endpoint | स्व-होस्ट | ✅ | ✅ |
| हैश-शृंखलित ऑडिट + decision replay | स्व-होस्ट | ✅ | ✅ |
| AI ड्राफ्ट + मानव अनुमोदन | — | ✅ | ✅ |

## कौन सा संस्करण?

- **सीख रहे हैं या एम्बेड कर रहे हैं?** Open Source से शुरू करें — `@aster-cloud/aster-lang-ts`।
- **एक प्रबंधित टीम चाहिए?** Cloud — होस्टेड, multi-tenant, उपयोग-आधारित।
- **विनियमित / डेटा-निवास बाध्यताएँ?** Enterprise — अपने cluster में स्व-होस्ट।
