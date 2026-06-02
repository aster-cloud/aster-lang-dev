import { computed } from 'vue'
import { useData } from 'vitepress'

interface HeroStrings {
  badges: string[]
  requestLabel: string
  /** Aria label on the HeroAnimation block (read by screen readers). */
  animationLabel: string
  /** Small secondary link under hero tagline pointing at API reference. */
  apiRefLink: { text: string; href: string }
  /** Sibling link to the Cloud product for users that need hosting/teams/audit. */
  siblingLink: { text: string; href: string }
  /** Bullet-list version of the tagline. Rendered by HeroTaglineList via
   *  #home-hero-info-after slot since VitePress's frontmatter tagline is
   *  a single string and the technical claims read better as bullets. */
  taglineItems: string[]
}

interface PlaygroundStrings {
  toolbar: {
    language: string
    template: string
    run: string
    reset: string
    /** Toggle label for "run on backend" vs "in-browser". */
    backendToggle: string
    /** Tooltip / hint shown next to the toggle. */
    backendHint: string
    /** Badge text shown in the console when a run came back from the server. */
    backendBadge: string
    /** Badge text shown in the console when a run was executed in the browser. */
    browserBadge: string
  }
  tabs: { diagnostics: string; schema: string; coreIr: string; inputs: string; console: string }
  status: {
    analyzing: string
    compiled: string
    ready: string
    errors: (count: number) => string
  }
  messages: {
    noErrors: string
    runToSeeSchema: string
    runToSeeCore: string
    compileToEdit: string
    runPrompt: string
    invalidJson: (msg: string) => string
    result: string
    execTime: (ms: number) => string
    /** Pending message shown in the console while a backend run is in flight. */
    awaitingBackend: string
  }
}

/** TrustBand sits between Hero and Features. Three cards reinforce the
 * "Compiled / Audit-trail / Open lexicons" positioning chosen during the
 * cross-site UX convergence with aster-lang.cloud. */
interface TrustBandStrings {
  /** Eyebrow text above the 3-card row (uppercase tracking). */
  eyebrow: string
  /** Aria label on the section (read by screen readers). */
  ariaLabel: string
  items: Array<{ key: 'compiled' | 'audit' | 'lexicons'; title: string; desc: string }>
}

/** DevFeatures replaces VPFeatures (frontmatter features array removed).
 * Six cards with TONE_BG semantic icon chip coloring, matching the cloud
 * landing page's feature grid. `emoji` is kept inline in the title since
 * the original copy used emoji-prefixed titles; `tone` drives the chip. */
interface FeaturesStrings {
  ariaLabel: string
  items: Array<{
    key: string
    tone: 'accent' | 'primary' | 'warning' | 'danger' | 'success' | 'neutral'
    title: string
    desc: string
  }>
}

/** Full-width violet CTA segment near the bottom of the home page,
 * matching the cloud landing page's closing block. */
interface BottomCtaStrings {
  title: string
  body: string
  primary: { text: string; href: string }
  secondary: { text: string; href: string }
}

/** Dark dev footer that replaces VPFooter on the home page only.
 * Other doc pages keep VPFooter (light, with the license line). */
interface FooterStrings {
  brand: string
  tagline: string
  license: string
  copyright: string
  columns: Array<{
    heading: string
    links: Array<{ text: string; href: string }>
  }>
}

interface UiStrings {
  hero: HeroStrings
  playground: PlaygroundStrings
  trustBand: TrustBandStrings
  features: FeaturesStrings
  bottomCta: BottomCtaStrings
  footer: FooterStrings
}

const en: UiStrings = {
  hero: {
    badges: ['REST API', 'Type-Safe', 'Multi-tenant'],
    requestLabel: 'api-request',
    animationLabel: 'Aster Policy Evaluation API examples',
    apiRefLink: { text: 'Cloud API docs', href: 'https://aster-lang.cloud/docs/api/policies/evaluate' },
    siblingLink: {
      text: 'Need hosting, teams, and audit workflows? Open Aster Cloud',
      href: 'https://aster-lang.cloud',
    },
    taglineItems: [
      'Open-source Controlled Natural Language for executable business logic',
      'Source compiles in three languages into the same audit-grade engine',
      'Dual reference implementations (Java/ANTLR + TypeScript/PEG), cross-verified per commit',
      'Lexicon packs ship today — add a fourth with a config file',
      'Drop-in via REST, GraphQL, or WebSocket — see Cloud docs',
      'Apache-2.0 licensed',
    ],
  },
  playground: {
    toolbar: {
      language: 'Language',
      template: 'Template',
      run: 'Run \u25b6',
      reset: 'Reset',
      backendToggle: 'Run on backend',
      backendHint: 'POST source + inputs to aster-api; verifies the cloud engine returns the same answer.',
      backendBadge: 'cloud',
      browserBadge: 'browser',
    },
    tabs: { diagnostics: 'Diagnostics', schema: 'Schema', coreIr: 'Core IR', inputs: 'Inputs', console: 'Console' },
    status: {
      analyzing: 'Analyzing...',
      compiled: 'Compiled successfully',
      ready: 'Ready',
      errors: (n) => `${n} error${n === 1 ? '' : 's'} found`,
    },
    messages: {
      noErrors: 'No errors found.',
      runToSeeSchema: 'Run analysis to see schema.',
      runToSeeCore: 'Run analysis to see Core IR.',
      compileToEdit: 'Compile successfully to edit inputs.',
      runPrompt: 'Click Run \u25b6 to execute the policy and see results here.',
      invalidJson: (msg) => `Invalid JSON input: ${msg}`,
      result: 'Result:',
      execTime: (ms) => `Execution time: ${ms}ms`,
      awaitingBackend: 'Waiting for cloud engine\u2026',
    },
  },
  trustBand: {
    eyebrow: 'BUILT FOR PRODUCTION',
    ariaLabel: 'What makes Aster Lang production-ready',
    items: [
      {
        key: 'compiled',
        title: 'Compiled, not interpreted',
        desc: 'Java + GraalVM Truffle. Native Image boots in milliseconds.',
      },
      {
        key: 'audit',
        title: 'Audit-trail by default',
        desc: 'Every evaluation hash-chained with SHA-256. Tamper-evident replay.',
      },
      {
        key: 'lexicons',
        title: 'Open lexicons, bring your own',
        desc: 'English, \u4e2d\u6587, Deutsch ship today. Add a language with a config file.',
      },
    ],
  },
  features: {
    ariaLabel: 'Aster Lang capabilities',
    items: [
      {
        key: 'multilingual',
        tone: 'accent',
        title: '\ud83c\udf0d Policies, workflows, decisions \u2014 in your own language',
        desc: 'Express loan-eligibility checks, approval-gate workflows, routing decisions, and pricing rules in English, Simplified Chinese, or German. Same semantics, same engine. Adding a fourth language is a configuration task, not an engineering one.',
      },
      {
        key: 'ai-drafts',
        tone: 'primary',
        title: '\ud83e\udd16 AI drafts. You review.',
        desc: 'Built-in LLM assistance generates rule drafts from plain prompts, explains existing rules, and auto-repairs syntax errors. Streaming over SSE, validated before suggested.',
      },
      {
        key: 'execution',
        tone: 'warning',
        title: '\u26a1 Production-grade execution',
        desc: 'Java + GraalVM Truffle interpreter for high-throughput evaluation. Native Image builds boot in milliseconds. P99 latency under 200ms.',
      },
      {
        key: 'audit',
        tone: 'danger',
        title: '\ud83d\udd12 Tamper-evident audit',
        desc: "Every policy evaluation is recorded in the engine's tamper-evident AuditLog, hash-chained with SHA-256. Replay any historical decision deterministically \u2014 clocks and UUIDs are controlled at runtime.",
      },
      {
        key: 'deployment',
        tone: 'success',
        title: '\ud83c\udfe2 SaaS or self-hosted',
        desc: 'Use aster-lang.cloud for managed multi-tenant, or deploy to your own K3S cluster via ArgoCD GitOps. Your data, your jurisdiction.',
      },
      {
        key: 'integration',
        tone: 'neutral',
        title: '\ud83e\uddf0 Drop-in via REST, GraphQL, or WebSocket',
        desc: 'Submit policy source inline or reference a stored policy by ID. Batch evaluate. Stream traces. See Cloud API docs for transports + auth.',
      },
    ],
  },
  bottomCta: {
    title: 'Ready to start writing rules in your own language?',
    body: 'Try the browser playground, then move into the quick start or hosted workflows when you need teams and audit.',
    primary: { text: 'Try in Playground', href: '/learn/playground' },
    secondary: { text: 'Open Cloud', href: 'https://aster-lang.cloud' },
  },
  footer: {
    brand: 'Aster Lang',
    tagline: 'Policy-as-Code in plain English (and \u4e2d\u6587 \u00b7 Deutsch)',
    license: 'Released under the Apache License 2.0.',
    copyright: '\u00a9 2025 Aster Language Team',
    columns: [
      {
        heading: 'Learn',
        links: [
          { text: 'Overview', href: '/learn/overview' },
          { text: 'CNL Reference', href: '/learn/cnl-quick-reference' },
          { text: 'Playground', href: '/learn/playground' },
          { text: 'Deployment', href: '/learn/deployment-guide' },
        ],
      },
      {
        heading: 'Cloud',
        links: [
          { text: 'aster-lang.cloud', href: 'https://aster-lang.cloud' },
          { text: 'API Docs', href: 'https://aster-lang.cloud/docs/api/policies/evaluate' },
          { text: 'Quickstart', href: 'https://aster-lang.cloud/docs/getting-started/quickstart' },
          { text: 'Compliance', href: '/community/compliance/' },
        ],
      },
      {
        heading: 'Community',
        links: [
          { text: 'GitHub', href: 'https://github.com/aster-cloud' },
          { text: 'Blog', href: '/blog/' },
          { text: 'Contribute', href: '/community/' },
        ],
      },
      {
        heading: 'Editions',
        links: [
          { text: 'Compare', href: '/editions/' },
          { text: 'Sales', href: 'mailto:sales@aster-lang.cloud' },
        ],
      },
    ],
  },
}

const zh: UiStrings = {
  hero: {
    badges: ['REST API', '\u7c7b\u578b\u5b89\u5168', '\u591a\u79df\u6237'],
    requestLabel: 'API \u8bf7\u6c42',
    animationLabel: 'Aster \u7b56\u7565\u8bc4\u4f30 API \u793a\u4f8b',
    apiRefLink: { text: 'Cloud API \u6587\u6863', href: 'https://aster-lang.cloud/zh/docs/api/policies/evaluate' },
    siblingLink: {
      text: '\u9700\u8981\u6258\u7ba1\u3001\u56e2\u961f\u534f\u4f5c\u3001\u5ba1\u8ba1\u5de5\u4f5c\u6d41\uff1f\u524d\u5f80 Aster Cloud',
      href: 'https://aster-lang.cloud',
    },
    taglineItems: [
      '\u9762\u5411\u53ef\u6267\u884c\u4e1a\u52a1\u903b\u8f91\u7684\u5f00\u6e90\u53d7\u63a7\u81ea\u7136\u8bed\u8a00\uff08CNL\uff09',
      '\u4e09\u79cd\u8bed\u8a00\u540c\u6e90\uff0c\u7f16\u8bd1\u5230\u540c\u4e00\u53f0\u5ba1\u8ba1\u7ea7\u5f15\u64ce',
      '\u53cc\u53c2\u8003\u5b9e\u73b0\uff08Java/ANTLR + TypeScript/PEG\uff09\uff0c\u6bcf\u6b21\u63d0\u4ea4\u4ea4\u53c9\u9a8c\u8bc1',
      '\u8bcd\u5178\u5305\u968f\u53d1\u5e03\u5373\u7528 \u2014\u2014 \u65b0\u589e\u7b2c\u56db\u79cd\u8bed\u8a00\u53ea\u9700\u4e00\u4e2a\u914d\u7f6e\u6587\u4ef6',
      '\u901a\u8fc7 REST\u3001GraphQL\u3001WebSocket \u5373\u63d2\u5373\u7528',
      'Apache-2.0 \u534f\u8bae',
    ],
  },
  playground: {
    toolbar: {
      language: '\u8bed\u8a00',
      template: '\u6a21\u677f',
      run: '\u8fd0\u884c \u25b6',
      reset: '\u91cd\u7f6e',
      backendToggle: '\u4f7f\u7528\u4e91\u7aef\u5f15\u64ce',
      backendHint: '\u5c06\u6e90\u7801 + \u8f93\u5165\u53d1\u9001\u5230 aster-api\uff0c\u9a8c\u8bc1\u4e91\u7aef\u5f15\u64ce\u662f\u5426\u8fd4\u56de\u4e00\u81f4\u7ed3\u679c\u3002',
      backendBadge: '\u4e91\u7aef',
      browserBadge: '\u6d4f\u89c8\u5668',
    },
    tabs: { diagnostics: '\u8bca\u65ad', schema: 'Schema', coreIr: '\u6838\u5fc3 IR', inputs: '\u8f93\u5165', console: '\u63a7\u5236\u53f0' },
    status: {
      analyzing: '\u5206\u6790\u4e2d...',
      compiled: '\u7f16\u8bd1\u6210\u529f',
      ready: '\u5c31\u7eea',
      errors: (n) => `\u53d1\u73b0 ${n} \u4e2a\u9519\u8bef`,
    },
    messages: {
      noErrors: '\u672a\u53d1\u73b0\u9519\u8bef\u3002',
      runToSeeSchema: '\u8fd0\u884c\u5206\u6790\u4ee5\u67e5\u770b Schema\u3002',
      runToSeeCore: '\u8fd0\u884c\u5206\u6790\u4ee5\u67e5\u770b\u6838\u5fc3 IR\u3002',
      compileToEdit: '\u7f16\u8bd1\u6210\u529f\u540e\u53ef\u7f16\u8f91\u8f93\u5165\u3002',
      runPrompt: '\u70b9\u51fb\u300c\u8fd0\u884c \u25b6\u300d\u6267\u884c\u7b56\u7565\u5e76\u5728\u6b64\u67e5\u770b\u7ed3\u679c\u3002',
      invalidJson: (msg) => `\u65e0\u6548\u7684 JSON \u8f93\u5165\uff1a${msg}`,
      result: '\u7ed3\u679c\uff1a',
      execTime: (ms) => `\u6267\u884c\u65f6\u95f4\uff1a${ms}ms`,
      awaitingBackend: '\u7b49\u5f85\u4e91\u7aef\u5f15\u64ce\u54cd\u5e94\u2026',
    },
  },
  trustBand: {
    eyebrow: '\u9762\u5411\u751f\u4ea7\u73af\u5883',
    ariaLabel: 'Aster Lang \u4e3a\u4f55\u53ef\u7528\u4e8e\u751f\u4ea7',
    items: [
      {
        key: 'compiled',
        title: '\u7f16\u8bd1\u6267\u884c,\u975e\u89e3\u91ca',
        desc: 'Java + GraalVM Truffle\u3002Native Image \u542f\u52a8\u4ee5\u6beb\u79d2\u8ba1\u3002',
      },
      {
        key: 'audit',
        title: '\u9ed8\u8ba4\u5f00\u542f\u5ba1\u8ba1',
        desc: '\u6bcf\u6b21\u8bc4\u4f30\u5747\u7ecf SHA-256 \u54c8\u5e0c\u94fe\u8bb0\u5f55\u3002\u9632\u7be1\u6539\u53ef\u91cd\u653e\u3002',
      },
      {
        key: 'lexicons',
        title: '\u5f00\u653e\u8bcd\u5178,\u81ea\u5e26\u8bed\u8a00',
        desc: 'English\u3001\u4e2d\u6587\u3001Deutsch \u5df2\u5c31\u7eea\u3002\u65b0\u589e\u4e00\u79cd\u8bed\u8a00\u53ea\u9700\u4e00\u4e2a\u914d\u7f6e\u6587\u4ef6\u3002',
      },
    ],
  },
  features: {
    ariaLabel: 'Aster Lang \u80fd\u529b',
    items: [
      {
        key: 'multilingual',
        tone: 'accent',
        title: '\ud83c\udf0d \u7b56\u7565\u3001\u6d41\u7a0b\u3001\u51b3\u7b56 \u2014\u2014 \u7528\u4f60\u7684\u6bcd\u8bed',
        desc: '\u7528 English\u3001\u7b80\u4f53\u4e2d\u6587 \u6216 \u5fb7\u8bed \u8868\u8fbe\u8d37\u6b3e\u8d44\u8d28\u68c0\u67e5\u3001\u5ba1\u6279\u95e8\u7981\u6d41\u7a0b\u3001\u8def\u7531\u51b3\u7b56\u3001\u5b9a\u4ef7\u89c4\u5219\u3002\u76f8\u540c\u8bed\u4e49\u3001\u76f8\u540c\u5f15\u64ce\u3002\u65b0\u589e\u7b2c\u56db\u79cd\u8bed\u8a00\u662f\u914d\u7f6e\u4efb\u52a1,\u4e0d\u662f\u5de5\u7a0b\u4efb\u52a1\u3002',
      },
      {
        key: 'ai-drafts',
        tone: 'primary',
        title: '\ud83e\udd16 AI \u8d77\u8349\u3002\u4f60\u5ba1\u9605\u3002',
        desc: '\u5185\u7f6e LLM \u8f85\u52a9,\u4ece\u81ea\u7136\u8bed\u8a00\u63d0\u793a\u751f\u6210\u89c4\u5219\u8349\u7a3f\u3001\u89e3\u91ca\u73b0\u6709\u89c4\u5219\u3001\u81ea\u52a8\u4fee\u590d\u8bed\u6cd5\u9519\u8bef\u3002SSE \u6d41\u5f0f\u8f93\u51fa,\u5efa\u8bae\u524d\u5148\u6821\u9a8c\u3002',
      },
      {
        key: 'execution',
        tone: 'warning',
        title: '\u26a1 \u751f\u4ea7\u7ea7\u6267\u884c',
        desc: 'Java + GraalVM Truffle \u89e3\u91ca\u5668\u5b9e\u73b0\u9ad8\u541e\u5410\u8bc4\u4f30\u3002Native Image \u542f\u52a8\u4ee5\u6beb\u79d2\u8ba1\u3002P99 \u5ef6\u8fdf\u4f4e\u4e8e 200ms\u3002',
      },
      {
        key: 'audit',
        tone: 'danger',
        title: '\ud83d\udd12 \u9632\u7be1\u6539\u5ba1\u8ba1',
        desc: '\u6bcf\u6b21\u7b56\u7565\u8bc4\u4f30\u90fd\u8bb0\u5f55\u5230\u5f15\u64ce\u7684\u9632\u7be1\u6539\u5ba1\u8ba1\u65e5\u5fd7,\u91c7\u7528 SHA-256 \u54c8\u5e0c\u94fe\u3002\u4efb\u610f\u5386\u53f2\u51b3\u7b56\u53ef\u786e\u5b9a\u6027\u91cd\u653e \u2014\u2014 \u65f6\u949f\u4e0e UUID \u5728\u8fd0\u884c\u65f6\u53d7\u63a7\u3002',
      },
      {
        key: 'deployment',
        tone: 'success',
        title: '\ud83c\udfe2 SaaS \u6216\u81ea\u6258\u7ba1',
        desc: '\u4f7f\u7528 aster-lang.cloud \u4eab\u53d7\u6258\u7ba1\u591a\u79df\u6237,\u6216\u901a\u8fc7 ArgoCD GitOps \u90e8\u7f72\u5230\u81ea\u5df1\u7684 K3S \u96c6\u7fa4\u3002\u4f60\u7684\u6570\u636e,\u4f60\u7684\u53f8\u6cd5\u7ba1\u8f96\u533a\u3002',
      },
      {
        key: 'integration',
        tone: 'neutral',
        title: '\ud83e\uddf0 \u901a\u8fc7 REST\u3001GraphQL \u6216 WebSocket \u63a5\u5165',
        desc: '\u5185\u8054\u63d0\u4ea4\u7b56\u7565\u6e90\u7801,\u6216\u6309 ID \u5f15\u7528\u5df2\u5b58\u50a8\u7684\u7b56\u7565\u3002\u6279\u91cf\u8bc4\u4f30\u3002\u6d41\u5f0f\u8ffd\u8e2a\u3002\u8be6\u89c1 Cloud API \u6587\u6863\u7684\u4f20\u8f93\u4e0e\u9274\u6743\u65b9\u5f0f\u3002',
      },
    ],
  },
  bottomCta: {
    title: '\u51c6\u5907\u597d\u7528\u6bcd\u8bed\u5199\u7b56\u7565\u4e86\u5417\uff1f',
    body: '\u5148\u5728\u6d4f\u89c8\u5668\u6f14\u7ec3\u573a\u8bd5\u8bd5,\u51c6\u5907\u597d\u540e\u8fdb\u5165\u5feb\u901f\u5f00\u59cb,\u6216\u5728\u9700\u8981\u56e2\u961f\u4e0e\u5ba1\u8ba1\u65f6\u5207\u6362\u5230\u6258\u7ba1\u5de5\u4f5c\u6d41\u3002',
    primary: { text: '\u8fdb\u5165\u6f14\u7ec3\u573a', href: '/zh/learn/playground' },
    secondary: { text: '\u6253\u5f00 Cloud', href: 'https://aster-lang.cloud' },
  },
  footer: {
    brand: 'Aster Lang',
    tagline: '\u7b56\u7565\u5373\u4ee3\u7801,\u6bcd\u8bed\u4e66\u5199\uff08English \u00b7 \u4e2d\u6587 \u00b7 Deutsch\uff09',
    license: '\u57fa\u4e8e Apache License 2.0 \u53d1\u5e03\u3002',
    copyright: '\u00a9 2025 Aster Language \u56e2\u961f',
    columns: [
      {
        heading: '\u5b66\u4e60',
        links: [
          { text: '\u6982\u89c8', href: '/zh/learn/overview' },
          { text: 'CNL \u53c2\u8003', href: '/zh/learn/cnl-quick-reference' },
          { text: '\u6f14\u7ec3\u573a', href: '/zh/learn/playground' },
          { text: '\u90e8\u7f72\u6307\u5357', href: '/zh/learn/deployment-guide' },
        ],
      },
      {
        heading: 'Cloud',
        links: [
          { text: 'aster-lang.cloud', href: 'https://aster-lang.cloud' },
          { text: 'API \u6587\u6863', href: 'https://aster-lang.cloud/zh/docs/api/policies/evaluate' },
          { text: '\u5feb\u901f\u5f00\u59cb', href: 'https://aster-lang.cloud/zh/docs/getting-started/quickstart' },
          { text: '\u5408\u89c4', href: '/community/compliance/' },
        ],
      },
      {
        heading: '\u793e\u533a',
        links: [
          { text: 'GitHub', href: 'https://github.com/aster-cloud' },
          { text: '\u535a\u5ba2', href: '/blog/' },
          { text: '\u8d21\u732e', href: '/zh/community/' },
        ],
      },
      {
        heading: '\u7248\u672c\u5bf9\u6bd4',
        links: [
          { text: '\u5bf9\u6bd4', href: '/zh/editions/' },
          { text: '\u8054\u7cfb\u9500\u552e', href: 'mailto:sales@aster-lang.cloud' },
        ],
      },
    ],
  },
}

const de: UiStrings = {
  hero: {
    badges: ['REST API', 'Typsicher', 'Mandantenf\u00e4hig'],
    requestLabel: 'API-Anfrage',
    animationLabel: 'Aster Policy Evaluation API Beispiele',
    apiRefLink: { text: 'Cloud-API-Docs', href: 'https://aster-lang.cloud/de/docs/api/policies/evaluate' },
    siblingLink: {
      text: 'Hosting, Teams oder Audit-Workflows? Aster Cloud \u00f6ffnen',
      href: 'https://aster-lang.cloud',
    },
    taglineItems: [
      'Open-Source Controlled Natural Language f\u00fcr ausf\u00fchrbare Gesch\u00e4ftslogik',
      'Quellcode kompiliert in drei Sprachen in dieselbe audit-feste Engine',
      'Zwei Referenzimplementierungen (Java/ANTLR + TypeScript/PEG), bei jedem Commit gegeneinander verifiziert',
      'Lexicon Packs sind sofort verf\u00fcgbar \u2014 eine vierte Sprache hinzuf\u00fcgen hei\u00dft eine Konfigurationsdatei schreiben',
      'Integration via REST, GraphQL oder WebSocket',
      'Apache-2.0 lizenziert',
    ],
  },
  playground: {
    toolbar: {
      language: 'Sprache',
      template: 'Vorlage',
      run: 'Ausf\u00fchren \u25b6',
      reset: 'Zur\u00fccksetzen',
      backendToggle: 'Cloud-Engine verwenden',
      backendHint: 'Sendet Quelltext + Eingaben an aster-api und pr\u00fcft, ob die Cloud-Engine dasselbe Ergebnis liefert.',
      backendBadge: 'cloud',
      browserBadge: 'browser',
    },
    tabs: { diagnostics: 'Diagnose', schema: 'Schema', coreIr: 'Core IR', inputs: 'Eingaben', console: 'Konsole' },
    status: {
      analyzing: 'Analyse l\u00e4uft...',
      compiled: 'Kompilierung erfolgreich',
      ready: 'Bereit',
      errors: (n) => `${n} Fehler gefunden`,
    },
    messages: {
      noErrors: 'Keine Fehler gefunden.',
      runToSeeSchema: 'Analyse ausf\u00fchren, um Schema anzuzeigen.',
      runToSeeCore: 'Analyse ausf\u00fchren, um Core IR anzuzeigen.',
      compileToEdit: 'Erfolgreich kompilieren, um Eingaben zu bearbeiten.',
      runPrompt: 'Klicken Sie auf \u201eAusf\u00fchren \u25b6\u201c, um die Richtlinie auszuf\u00fchren.',
      invalidJson: (msg) => `Ung\u00fcltige JSON-Eingabe: ${msg}`,
      result: 'Ergebnis:',
      execTime: (ms) => `Ausf\u00fchrungszeit: ${ms}ms`,
      awaitingBackend: 'Warte auf Cloud-Engine\u2026',
    },
  },
  trustBand: {
    eyebrow: 'F\u00dcR DEN PRODUKTIONSEINSATZ GEBAUT',
    ariaLabel: 'Was Aster Lang produktionsreif macht',
    items: [
      {
        key: 'compiled',
        title: 'Kompiliert, nicht interpretiert',
        desc: 'Java + GraalVM Truffle. Native Image bootet in Millisekunden.',
      },
      {
        key: 'audit',
        title: 'Audit-Trail von Haus aus',
        desc: 'Jede Evaluierung wird mit SHA-256 hash-verkettet. Manipulationssichere Wiedergabe.',
      },
      {
        key: 'lexicons',
        title: 'Offene Lexika, eigene Sprache',
        desc: 'English, \u4e2d\u6587, Deutsch sind sofort verf\u00fcgbar. Neue Sprache per Konfigurationsdatei.',
      },
    ],
  },
  features: {
    ariaLabel: 'Aster Lang Funktionen',
    items: [
      {
        key: 'multilingual',
        tone: 'accent',
        title: '\ud83c\udf0d Policies, Workflows, Decisions \u2014 in der eigenen Sprache',
        desc: 'Kreditw\u00fcrdigkeitspr\u00fcfungen, Approval-Gate Workflows, Routing-Decisions und Pricing-Regeln auf English, vereinfachtem Chinesisch oder Deutsch ausdr\u00fccken. Gleiche Semantik, gleiche Engine. Eine vierte Sprache hinzuf\u00fcgen ist eine Konfigurationsaufgabe, keine Entwicklungsaufgabe.',
      },
      {
        key: 'ai-drafts',
        tone: 'primary',
        title: '\ud83e\udd16 KI entwirft. Sie \u00fcberpr\u00fcfen.',
        desc: 'Integrierte LLM-Unterst\u00fctzung erzeugt Regelentw\u00fcrfe aus einfachen Prompts, erkl\u00e4rt bestehende Regeln und repariert Syntaxfehler automatisch. Streaming \u00fcber SSE, validiert vor jedem Vorschlag.',
      },
      {
        key: 'execution',
        tone: 'warning',
        title: '\u26a1 Produktionsreife Ausf\u00fchrung',
        desc: 'Java + GraalVM Truffle Interpreter f\u00fcr hohen Evaluierungsdurchsatz. Native Image bootet in Millisekunden. P99-Latenz unter 200ms.',
      },
      {
        key: 'audit',
        tone: 'danger',
        title: '\ud83d\udd12 Manipulationssicheres Audit',
        desc: 'Jede Policy-Evaluierung wird im manipulationssicheren AuditLog der Engine aufgezeichnet, mit SHA-256 Hash-verkettet. Jede historische Entscheidung kann deterministisch reproduziert werden \u2014 Uhren und UUIDs werden zur Laufzeit kontrolliert.',
      },
      {
        key: 'deployment',
        tone: 'success',
        title: '\ud83c\udfe2 SaaS oder selbst gehostet',
        desc: 'Nutzen Sie aster-lang.cloud f\u00fcr verwaltetes Multi-Tenancy oder deployen Sie \u00fcber ArgoCD GitOps in Ihren eigenen K3S-Cluster. Ihre Daten, Ihre Rechtsordnung.',
      },
      {
        key: 'integration',
        tone: 'neutral',
        title: '\ud83e\uddf0 Integration via REST, GraphQL oder WebSocket',
        desc: 'Policy-Quellcode inline \u00fcbermitteln oder gespeicherte Policy per ID referenzieren. Batch-Evaluierung. Trace-Streaming. Transporte + Auth siehe Cloud-API-Docs.',
      },
    ],
  },
  bottomCta: {
    title: 'Bereit, Regeln in der eigenen Sprache zu schreiben?',
    body: 'Im Browser-Playground starten, dann zum Schnellstart oder zu Hosted-Workflows wechseln, sobald Sie Teams und Audit ben\u00f6tigen.',
    primary: { text: 'Im Playground starten', href: '/de/learn/playground' },
    secondary: { text: 'Cloud \u00f6ffnen', href: 'https://aster-lang.cloud' },
  },
  footer: {
    brand: 'Aster Lang',
    tagline: 'Policy-as-Code in der eigenen Sprache (English \u00b7 \u4e2d\u6587 \u00b7 Deutsch)',
    license: 'Ver\u00f6ffentlicht unter der Apache License 2.0.',
    copyright: '\u00a9 2025 Aster Language Team',
    columns: [
      {
        heading: 'Lernen',
        links: [
          { text: '\u00dcberblick', href: '/de/learn/overview' },
          { text: 'CNL-Referenz', href: '/de/learn/cnl-quick-reference' },
          { text: 'Playground', href: '/de/learn/playground' },
          { text: 'Bereitstellung', href: '/de/learn/deployment-guide' },
        ],
      },
      {
        heading: 'Cloud',
        links: [
          { text: 'aster-lang.cloud', href: 'https://aster-lang.cloud' },
          { text: 'API-Docs', href: 'https://aster-lang.cloud/de/docs/api/policies/evaluate' },
          { text: 'Schnellstart', href: 'https://aster-lang.cloud/de/docs/getting-started/quickstart' },
          { text: 'Compliance', href: '/community/compliance/' },
        ],
      },
      {
        heading: 'Community',
        links: [
          { text: 'GitHub', href: 'https://github.com/aster-cloud' },
          { text: 'Blog', href: '/blog/' },
          { text: 'Mitwirken', href: '/de/community/' },
        ],
      },
      {
        heading: 'Editionen',
        links: [
          { text: 'Vergleich', href: '/de/editions/' },
          { text: 'Vertrieb', href: 'mailto:sales@aster-lang.cloud' },
        ],
      },
    ],
  },
}

const dictionaries: Record<string, UiStrings> = { en, zh, de }

function normalizeLang(lang: string): string {
  if (lang?.startsWith('zh')) return 'zh'
  if (lang?.startsWith('de')) return 'de'
  return 'en'
}

export function useUiStrings() {
  const { lang } = useData()
  return computed<UiStrings>(() => dictionaries[normalizeLang(lang.value)] ?? en)
}
