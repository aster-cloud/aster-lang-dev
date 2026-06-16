---
outline: deep
---

# Browser API संदर्भ

`@aster-cloud/aster-lang-ts` पूरा Aster कंपाइलर ब्राउज़र (और Node) में चलाता है — कोई सर्वर आवश्यक नहीं। यह पृष्ठ मुख्य API सतह का सारांश देता है। पूर्ण विवरण के लिए [English browser API](/learn/browser-api) देखें।

## स्थापना

```bash
npm i @aster-cloud/aster-lang-ts
```

## Imports

```ts
import { compile, evaluate } from '@aster-cloud/aster-lang-ts/browser';
import { EN_US, ZH_CN, DE_DE, HI_IN } from '@aster-cloud/aster-lang-ts/lexicons';
```

> **नोट:** `HI_IN` (हिन्दी) वर्तमान में `./lexicons` barrel से उपलब्ध है। `EN_US`/`ZH_CN`/`DE_DE` के पास समर्पित उप-पथ भी हैं (`@aster-cloud/aster-lang-ts/lexicons/en-US` आदि)।

## Lexicons

चार भाषाएँ उपलब्ध हैं: `EN_US`, `ZH_CN`, `DE_DE`, `HI_IN`। हर एक एक `Lexicon` ऑब्जेक्ट है जिसे `compile()` को पास किया जा सकता है।

```ts
const source = `मॉड्यूल pricing।

नियम discountedPrice दिया गया amount रूप में पूर्णांक, उत्पन्न पूर्णांक:
  यदि amount से अधिक 100
    लौटाएं amount गुणा 80 भाग 100।
  लौटाएं amount।`;

const result = compile(source, { lexicon: HI_IN });
if (result.success) {
  console.log(result.core); // Core IR
}
```

## मुख्य फ़ंक्शन

| फ़ंक्शन | विवरण |
|--------|--------|
| `compile(source, { lexicon })` | स्रोत को Core IR में संकलित करता है; `{ success, core, parseErrors }` लौटाता है |
| `evaluate(core, inputs)` | संकलित Core IR को इनपुट के साथ निष्पादित करता है |
| `extractSchema(source, { lexicon })` | इनपुट पैरामीटर स्कीमा निकालता है (UI फ़ॉर्म जनरेशन के लिए) |
| `validateSyntaxWithSpan(source, lexicon)` | स्थिति-जागरूक डायग्नोस्टिक्स लौटाता है (एडिटर रेखांकन के लिए) |

## कब Browser API बनाम REST/GraphQL

- **Browser API** — क्लाइंट-साइड मूल्यांकन, लाइव एडिटर पूर्वावलोकन, ऑफ़लाइन। डेटा डिवाइस नहीं छोड़ता।
- **REST / GraphQL** — सर्वर-साइड निष्पादन, हैश-शृंखलित ऑडिट, बहु-उपयोगकर्ता शासन। [Aster Cloud](https://aster-lang.cloud) देखें।

## संबंधित पृष्ठ

- [प्लेग्राउंड](/hi/learn/playground) — यही API एक लाइव UI में।
- [CNL त्वरित संदर्भ](/hi/learn/cnl-quick-reference) — भाषा syntax।
