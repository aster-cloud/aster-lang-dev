import { computed } from 'vue'
import { useData } from 'vitepress'

interface HeroStrings {
  badges: string[]
  requestLabel: string
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

interface UiStrings {
  hero: HeroStrings
  playground: PlaygroundStrings
}

const en: UiStrings = {
  hero: {
    badges: ['REST API', 'Type-Safe', 'Multi-tenant'],
    requestLabel: 'api-request',
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
}

const zh: UiStrings = {
  hero: {
    badges: ['REST API', '\u7c7b\u578b\u5b89\u5168', '\u591a\u79df\u6237'],
    requestLabel: 'API \u8bf7\u6c42',
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
}

const de: UiStrings = {
  hero: {
    badges: ['REST API', 'Typsicher', 'Mandantenf\u00e4hig'],
    requestLabel: 'API-Anfrage',
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
