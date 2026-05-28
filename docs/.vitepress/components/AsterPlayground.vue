<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted, watch, computed } from 'vue';
import { templates } from './playground-templates';
import { useUiStrings } from '../i18n/ui';

const props = withDefaults(defineProps<{
  initialLexicon?: string;
  height?: string;
}>(), {
  initialLexicon: 'EN_US',
  height: '400px',
});

// State
const editorContainer = ref<HTMLElement | null>(null);
const editorView = shallowRef<any>(null);
const lexiconId = ref(props.initialLexicon);
type TabName = 'diagnostics' | 'schema' | 'ast' | 'inputs' | 'console';
const activeTab = ref<TabName>('diagnostics');
const TAB_ORDER: readonly TabName[] = ['diagnostics', 'schema', 'ast', 'inputs', 'console'] as const;

// P1-R22 (audit): keyboard navigation for the tablist.
// WAI-ARIA Authoring Practices for tabs:
//   ArrowLeft / ArrowRight = previous/next tab (wrap)
//   Home / End = first/last tab
// Combined with roving tabindex (already in template), Tab key exits the
// tablist while arrows traverse within it.
function onTabKeydown(e: KeyboardEvent) {
  const idx = TAB_ORDER.indexOf(activeTab.value);
  let next: TabName | null = null;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    next = TAB_ORDER[(idx + 1) % TAB_ORDER.length] as TabName;
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    next = TAB_ORDER[(idx - 1 + TAB_ORDER.length) % TAB_ORDER.length] as TabName;
  } else if (e.key === 'Home') {
    next = TAB_ORDER[0] as TabName;
  } else if (e.key === 'End') {
    next = TAB_ORDER[TAB_ORDER.length - 1] as TabName;
  } else {
    return;
  }
  e.preventDefault();
  activeTab.value = next;
  // Move focus to the newly-active tab so the roving tabindex contract holds.
  const id = `playground-tab-${next}`;
  (document.getElementById(id) as HTMLButtonElement | null)?.focus();
}
const isRunning = ref(false);
const diagnostics = ref<any[]>([]);
const schemaResult = ref<any>(null);
const compileResult = ref<any>(null);
const sampleInputs = ref<any>(null);
const lastError = ref<string | null>(null);

// Console / Run 相关状态
const evalResult = ref<any>(null);
const evalError = ref<string | null>(null);
const evalTime = ref<number | null>(null);
const editableInputs = ref<string>('');
const lastCalledFunc = ref<string>('');
const lastCalledArgs = ref<string>('');

// Backend-vs-browser execution toggle. The browser path uses the bundled
// TypeScript engine for an instant, offline demo. The backend path POSTs
// to aster-cloud's /api/playground/evaluate-source so visitors can
// confirm the cloud engine gives the same answer.
//
// Why aster-cloud, not aster-api directly:
//   /api/v1/policies/evaluate-source on aster-api is internal-only —
//   the k3s traefik middleware `block-evaluate-source` rewrites the
//   path to a 404 for any caller that comes in through the public
//   ingress. The marketing playground proxies through aster-cloud's
//   BFF instead, which signs the call with HMAC and forwards via the
//   internal service DNS. See aster-cloud's
//   src/app/api/playground/evaluate-source/route.ts.
//
// API base resolution order:
//   1. <meta name="aster-api-base" content="https://..."> (CI override).
//   2. import.meta.env.VITE_ASTER_API_BASE at build time.
//   3. Built-in default — the public aster-cloud BFF host.
const runOnBackend = ref(false);
const backendBase = computed(() => {
  if (typeof document !== 'undefined') {
    const meta = document.querySelector('meta[name="aster-api-base"]');
    const c = meta?.getAttribute('content');
    if (c) return c.replace(/\/+$/, '');
  }
  // Vite injects import.meta.env at build time; fall back to the
  // public aster-cloud BFF so the demo works without configuration.
  const env = (import.meta as unknown as { env?: { VITE_ASTER_API_BASE?: string } }).env;
  const fromEnv = env?.VITE_ASTER_API_BASE;
  return (fromEnv ?? 'https://aster-lang.cloud').replace(/\/+$/, '');
});
const backendInFlight = ref(false);
const backendController = ref<AbortController | null>(null);

// Run-button hardening. Three layers, defense in depth:
//   1. trailing debounce — collapses rapid clicks (300ms window) into a
//      single fired request. Matches the human perception of "I clicked
//      Run, why is it doing 5 things".
//   2. single-flight — backendInFlight gates the disabled state and also
//      gates onRun re-entry (in case keyboard Enter beats the disabled
//      re-render).
//   3. min-interval — at most one backend run per RUN_MIN_INTERVAL_MS.
//      Even with the timer + flag, you should never be able to drive
//      more than ~1 RPS of backend trial traffic from one tab.
// These three together cap a single misbehaving tab at ~1 req/sec to
// /api/playground/evaluate-source. Combined with the backend semaphore
// added in the same change, OOM is no longer reachable via dashboard
// click spam.
const RUN_DEBOUNCE_MS = 300;
const RUN_MIN_INTERVAL_MS = 1000;
let runDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let lastRunDispatchedAt = 0;

// Lazy-loaded modules
let asterLang: any = null;
let cmView: any = null;
let cmState: any = null;
let cmCommands: any = null;

const strings = useUiStrings();
const t = computed(() => strings.value.playground);

const currentTemplates = computed(() => templates[lexiconId.value] || templates.EN_US);

const canRun = computed(() =>
  compileResult.value?.success && schemaResult.value?.success && !isRunning.value
);

function getLexicon(id: string) {
  if (!asterLang) return undefined;
  switch (id) {
    case 'ZH_CN': return asterLang.ZH_CN;
    case 'DE_DE': return asterLang.DE_DE;
    default: return asterLang.EN_US;
  }
}

function getSource() {
  if (editorView.value) {
    return editorView.value.state.doc.toString();
  }
  return currentTemplates.value[0]?.source || '';
}

function setSource(source: string) {
  if (editorView.value) {
    const transaction = editorView.value.state.update({
      changes: {
        from: 0,
        to: editorView.value.state.doc.length,
        insert: source,
      },
    });
    editorView.value.dispatch(transaction);
  }
}

// Debounce utility
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
function debounce(fn: () => void, ms: number) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fn, ms);
}

async function runAnalysis() {
  if (!asterLang) return;
  isRunning.value = true;
  lastError.value = null;

  try {
    const source = getSource();
    const lexicon = getLexicon(lexiconId.value);

    // Validate syntax
    diagnostics.value = asterLang.validateSyntaxWithSpan(source, lexicon);

    // Compile (even with diagnostics, to get partial results)
    const result = asterLang.compile(source, {
      lexicon,
      includeIntermediates: true,
    });
    compileResult.value = result;

    // Extract schema
    if (result.success) {
      schemaResult.value = asterLang.extractSchema(source, { lexicon });

      // Generate sample inputs
      if (schemaResult.value?.success && schemaResult.value.parameters) {
        sampleInputs.value = asterLang.generateInputValues(
          schemaResult.value.parameters,
          lexicon,
        );
        // 用生成的 sample inputs 更新可编辑输入（仅当用户未手动编辑或 schema 变更时）
        editableInputs.value = formatJson(sampleInputs.value);
      } else {
        sampleInputs.value = null;
        editableInputs.value = '{}';
      }
    } else {
      schemaResult.value = null;
      sampleInputs.value = null;
      editableInputs.value = '{}';
    }

    // Auto-select tab
    if (diagnostics.value.length > 0) {
      activeTab.value = 'diagnostics';
    } else if (schemaResult.value?.success && activeTab.value === 'diagnostics') {
      activeTab.value = 'schema';
    }

    // Push diagnostics into the editor gutter so users see inline markers.
    syncDiagnosticGutter();
  } catch (err: any) {
    lastError.value = err.message || String(err);
  } finally {
    isRunning.value = false;
  }
}

function onRun() {
  if (!asterLang || !compileResult.value?.success || !compileResult.value?.core) return;
  if (!schemaResult.value?.success) return;
  // single-flight re-entry guard. The button is :disabled while in
  // flight, but keyboard Enter on a focused-then-disabled control can
  // still fire onRun() in some browsers; bail out explicitly.
  if (runOnBackend.value && backendInFlight.value) return;

  // 解析用户输入的 JSON
  let context: Record<string, unknown>;
  try {
    context = JSON.parse(editableInputs.value);
  } catch (err: any) {
    evalError.value = t.value.messages.invalidJson(err.message);
    evalResult.value = null;
    evalTime.value = null;
    activeTab.value = 'console';
    return;
  }

  const funcName = schemaResult.value.functionName;
  lastCalledFunc.value = funcName;
  lastCalledArgs.value = formatJson(context);
  activeTab.value = 'console';

  if (runOnBackend.value) {
    // Coalesce burst-clicks via trailing debounce. Each click resets
    // the timer; only the last click in a quiet window actually fires.
    if (runDebounceTimer !== null) clearTimeout(runDebounceTimer);
    runDebounceTimer = setTimeout(() => {
      runDebounceTimer = null;
      // Min-interval enforcement: even after the debounce window, we
      // refuse to dispatch faster than RUN_MIN_INTERVAL_MS apart.
      const now = Date.now();
      const waitMs = lastRunDispatchedAt + RUN_MIN_INTERVAL_MS - now;
      if (waitMs > 0) {
        runDebounceTimer = setTimeout(() => {
          runDebounceTimer = null;
          lastRunDispatchedAt = Date.now();
          runOnBackendImpl(funcName, context);
        }, waitMs);
        return;
      }
      lastRunDispatchedAt = now;
      runOnBackendImpl(funcName, context);
    }, RUN_DEBOUNCE_MS);
    return;
  }

  // 调用解释器
  const result = asterLang.evaluate(compileResult.value.core, funcName, context);

  if (result.success) {
    evalResult.value = result.value;
    evalError.value = null;
    evalTime.value = result.executionTimeMs ?? null;
  } else {
    evalResult.value = null;
    evalError.value = result.error || 'Unknown error';
    evalTime.value = result.executionTimeMs ?? null;
  }
}

function localeForLexicon(id: string): string {
  switch (id) {
    case 'ZH_CN': return 'zh-CN';
    case 'DE_DE': return 'de-DE';
    default: return 'en-US';
  }
}

/**
 * Round-trip the source + inputs to aster-api's evaluate-source endpoint.
 * Returns the cloud engine's verdict so visitors can confirm parity with
 * the in-browser TS engine. AbortController allows the user to cancel
 * (or a subsequent Run to supersede an in-flight request).
 */
async function runOnBackendImpl(funcName: string, context: Record<string, unknown>) {
  // Supersede any in-flight call. The previous request gets abort() → its
  // catch sees AbortError → returns without touching state. Any state
  // mutation below is also gated by isCurrent() so a slow-arriving older
  // response can't overwrite the newer one's result.
  backendController.value?.abort();
  const controller = new AbortController();
  backendController.value = controller;
  backendInFlight.value = true;
  evalResult.value = null;
  evalError.value = null;
  evalTime.value = null;

  const isCurrent = () => backendController.value === controller;

  const t0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  try {
    const res = await fetch(`${backendBase.value}/api/playground/evaluate-source`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        source: getSource(),
        functionName: funcName,
        locale: localeForLexicon(lexiconId.value),
        context,
      }),
      signal: controller.signal,
    });
    if (!isCurrent()) return;

    const elapsed = Math.round(((typeof performance !== 'undefined' ? performance.now() : Date.now())) - t0);

    if (!res.ok) {
      // 404 commonly means the public marketing-tier endpoint isn't enabled
      // on this deployment — surface a hint instead of just "404".
      let detail = '';
      try { detail = await res.text(); } catch { /* ignore */ }
      if (!isCurrent()) return;
      const hint = res.status === 404 || res.status === 401 || res.status === 403
        ? ' — backend trial may be disabled on this deployment; falling back to browser run is fine.'
        : '';
      evalError.value = `HTTP ${res.status}${detail ? ': ' + truncate(detail, 200) : ''}${hint}`;
      evalTime.value = elapsed;
      return;
    }

    const payload = await res.json();
    if (!isCurrent()) return;
    if (payload?.success === false) {
      evalError.value = payload.error ?? 'Backend evaluation failed';
      evalTime.value = typeof payload.executionTimeMs === 'number' ? payload.executionTimeMs : elapsed;
      return;
    }

    // Cap displayed payload to avoid pathological large response wrecking
    // the page. 256 KiB stringified is plenty for any plausible policy
    // evaluation; if a server bug returns megabytes, we still show a
    // friendly error rather than crashing the page.
    evalResult.value = clipForDisplay(payload?.result ?? payload?.value ?? payload);
    evalError.value = null;
    evalTime.value = typeof payload.executionTimeMs === 'number' ? payload.executionTimeMs : elapsed;
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      // Superseded or user-cancelled — leave state alone.
      return;
    }
    if (!isCurrent()) return;
    const msg = err instanceof Error ? err.message : String(err);
    // Network-level CORS/DNS failures usually surface here; give the
    // browser-run fallback hint so the demo never feels dead.
    evalError.value = `Network error: ${msg}. Toggle off "Run on backend" to use the in-browser engine.`;
  } finally {
    // Only the *current* controller is allowed to clear flags. A
    // superseded controller hitting finally must not flip backendInFlight
    // back to false (the newer request is still running and the Run
    // button must stay disabled).
    if (isCurrent()) {
      backendInFlight.value = false;
      backendController.value = null;
    }
  }
}

const MAX_DISPLAY_BYTES = 256 * 1024;
function clipForDisplay(value: unknown): unknown {
  try {
    const s = JSON.stringify(value);
    if (s != null && s.length > MAX_DISPLAY_BYTES) {
      return {
        __clipped: true,
        message: `Response truncated to ${MAX_DISPLAY_BYTES} bytes for display`,
        head: s.slice(0, MAX_DISPLAY_BYTES) + '…',
      };
    }
    return value;
  } catch {
    return String(value).slice(0, MAX_DISPLAY_BYTES);
  }
}

function truncate(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n - 1) + '…';
}

// Module-level handles to gutter effect + state — set during initEditor and
// referenced by setDiagnosticGutter() so diagnostics from runAnalysis flow
// into the editor's left-rail marker.
let diagnosticEffect: any = null;
let diagnosticField: any = null;

async function initEditor() {
  if (!editorContainer.value) return;

  // Dynamic imports to avoid SSR issues
  const [asterModule, viewModule, stateModule, commandsModule, langModule, searchModule, oneDarkModule] = await Promise.all([
    import('@aster-cloud/aster-lang-ts/browser'),
    import('@codemirror/view'),
    import('@codemirror/state'),
    import('@codemirror/commands'),
    import('@codemirror/language'),
    import('@codemirror/search'),
    import('@codemirror/theme-one-dark'),
  ]);

  asterLang = asterModule;
  cmView = viewModule;
  cmState = stateModule;
  cmCommands = commandsModule;

  // Diagnostic gutter — StateField holds a Set<lineNumber>, custom
  // GutterMarker draws a small "●" in the diagnostic line gutter.
  diagnosticEffect = cmState.StateEffect.define<number[]>();
  diagnosticField = cmState.StateField.define<Set<number>>({
    create: () => new Set<number>(),
    update(value: Set<number>, tr: any) {
      for (const e of tr.effects) {
        if (e.is(diagnosticEffect)) return new Set<number>(e.value as number[]);
      }
      return value;
    },
  });

  class DiagnosticGutterMarker extends cmView.GutterMarker {
    toDOM() {
      const el = document.createElement('span');
      el.textContent = '●';
      el.title = 'Diagnostic on this line — click for details';
      el.style.color = '#f56565';
      el.style.cursor = 'pointer';
      el.style.fontSize = '14px';
      return el;
    }
  }
  const diagnosticGutter = cmView.gutter({
    class: 'cm-diagnostic-gutter',
    lineMarker(view: any, line: any) {
      const set: Set<number> = view.state.field(diagnosticField);
      const lineNo = view.state.doc.lineAt(line.from).number;
      return set.has(lineNo) ? new DiagnosticGutterMarker() : null;
    },
    initialSpacer: () => new DiagnosticGutterMarker(),
  });

  const initialSource = currentTemplates.value[0]?.source || '';

  const extensions = [
    cmView.lineNumbers(),
    cmView.highlightActiveLine(),
    cmView.drawSelection(),
    diagnosticField,
    diagnosticGutter,
    cmView.keymap.of([
      ...cmCommands.defaultKeymap,
      ...cmCommands.historyKeymap,
      ...searchModule.searchKeymap,
    ]),
    cmCommands.history(),
    langModule.bracketMatching(),
    cmState.EditorState.tabSize.of(2),
    cmView.EditorView.updateListener.of((update: any) => {
      if (update.docChanged) {
        debounce(runAnalysis, 300);
      }
    }),
    // Use one-dark theme for dark mode, basic for light
    oneDarkModule.oneDark,
  ];

  const state = cmState.EditorState.create({
    doc: initialSource,
    extensions,
  });

  editorView.value = new cmView.EditorView({
    state,
    parent: editorContainer.value,
  });

  // Initial analysis
  runAnalysis();
}

/**
 * Extract the 1-based line number from a diagnostic. validateSyntaxWithSpan
 * returns spans shaped `{ start: { line, col } }` (see
 * `aster-lang-ts/src/browser.ts ValidationError`); other code paths might
 * pass `{ line }` directly, so both shapes are accepted. Returning -1 on
 * miss lets the caller skip rather than mis-map to line 1.
 */
function diagnosticLine(d: any): number {
  const candidate = d?.span?.start?.line ?? d?.span?.line ?? d?.line;
  return typeof candidate === 'number' && candidate > 0 ? candidate : -1;
}

/** Update the gutter markers to reflect current diagnostics. */
function syncDiagnosticGutter() {
  if (!editorView.value || !diagnosticEffect) return;
  const lines = new Set<number>();
  for (const d of diagnostics.value) {
    const n = diagnosticLine(d);
    if (n > 0) lines.add(n);
  }
  editorView.value.dispatch({
    effects: diagnosticEffect.of([...lines]),
  });
}

/** Click handler used by the diagnostic list — jump editor to the diagnostic's line. */
function jumpToDiagnostic(d: any) {
  if (!editorView.value) return;
  const lineNo = diagnosticLine(d);
  if (lineNo < 1) return;
  const line = editorView.value.state.doc.line(lineNo);
  editorView.value.dispatch({
    selection: { anchor: line.from },
    scrollIntoView: true,
  });
  editorView.value.focus();
}

function onTemplateChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  const template = currentTemplates.value.find((t) => t.id === select.value);
  if (template) {
    setSource(template.source);
  }
}

function onLexiconChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  lexiconId.value = select.value;
}

function onReset() {
  const template = currentTemplates.value[0];
  if (template) {
    setSource(template.source);
  }
  // 清除 console 状态
  evalResult.value = null;
  evalError.value = null;
  evalTime.value = null;
}

watch(lexiconId, () => {
  // Load first template for new lexicon
  const template = currentTemplates.value[0];
  if (template) {
    setSource(template.source);
  }
  // 清除 console 状态
  evalResult.value = null;
  evalError.value = null;
  evalTime.value = null;
});

onMounted(() => {
  initEditor();
});

onUnmounted(() => {
  if (editorView.value) {
    editorView.value.destroy();
  }
  if (debounceTimer) clearTimeout(debounceTimer);
  if (runDebounceTimer) clearTimeout(runDebounceTimer);
  backendController.value?.abort();
});

function formatJson(obj: any): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

function formatResult(value: any): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'object') {
    // 移除内部 __type 标记以简化显示
    const clean = JSON.parse(JSON.stringify(value, (key, val) => {
      if (key === '__type') return undefined;
      return val;
    }));
    return JSON.stringify(clean, null, 2);
  }
  return String(value);
}

const footerText = computed(() => {
  if (isRunning.value) return t.value.status.analyzing;
  if (lastError.value) return lastError.value;
  const errCount = diagnostics.value.length;
  if (errCount > 0) return t.value.status.errors(errCount);
  if (compileResult.value?.success) return t.value.status.compiled;
  return t.value.status.ready;
});

const footerClass = computed(() => {
  if (lastError.value || diagnostics.value.length > 0) return 'error';
  if (compileResult.value?.success) return 'success';
  return '';
});
</script>

<template>
  <div class="playground-container">
    <div class="playground-toolbar">
      <label>
        {{ t.toolbar.language }}:
        <select :value="lexiconId" @change="onLexiconChange" aria-label="Policy Language">
          <option value="EN_US">English</option>
          <option value="ZH_CN">中文</option>
          <option value="DE_DE">Deutsch</option>
        </select>
      </label>
      <label>
        {{ t.toolbar.template }}:
        <select @change="onTemplateChange">
          <option
            v-for="tmpl in currentTemplates"
            :key="tmpl.id"
            :value="tmpl.id"
          >
            {{ tmpl.name }}
          </option>
        </select>
      </label>
      <button class="run-btn" :disabled="!canRun || backendInFlight" @click="onRun">{{ t.toolbar.run }}</button>
      <button class="secondary" @click="onReset">{{ t.toolbar.reset }}</button>
      <label class="backend-toggle" :title="t.toolbar.backendHint">
        <input type="checkbox" v-model="runOnBackend" />
        <span>{{ t.toolbar.backendToggle }}</span>
      </label>
    </div>
    <div class="playground-grid" :style="{ height: height }">
      <div class="playground-editor" ref="editorContainer"></div>
      <div class="playground-results">
        <!-- P1-R21/R22 (audit): ARIA tab semantics + keyboard navigation.
             Screen readers identify the 5-tab structure; arrow keys / Home /
             End navigate via onTabKeydown; roving tabindex keeps Tab key
             outside the tablist. -->
        <div
          class="playground-tabs"
          role="tablist"
          :aria-label="t.tabs.diagnostics"
          @keydown="onTabKeydown"
        >
          <button
            id="playground-tab-diagnostics"
            class="playground-tab"
            role="tab"
            :aria-selected="activeTab === 'diagnostics'"
            :tabindex="activeTab === 'diagnostics' ? 0 : -1"
            aria-controls="playground-panel-diagnostics"
            :class="{ active: activeTab === 'diagnostics' }"
            @click="activeTab = 'diagnostics'"
          >
            {{ t.tabs.diagnostics }}
            <span v-if="diagnostics.length > 0">({{ diagnostics.length }})</span>
          </button>
          <button
            id="playground-tab-schema"
            class="playground-tab"
            role="tab"
            :aria-selected="activeTab === 'schema'"
            :tabindex="activeTab === 'schema' ? 0 : -1"
            aria-controls="playground-panel-schema"
            :class="{ active: activeTab === 'schema' }"
            @click="activeTab = 'schema'"
          >
            {{ t.tabs.schema }}
          </button>
          <button
            id="playground-tab-ast"
            class="playground-tab"
            role="tab"
            :aria-selected="activeTab === 'ast'"
            :tabindex="activeTab === 'ast' ? 0 : -1"
            aria-controls="playground-panel-ast"
            :class="{ active: activeTab === 'ast' }"
            @click="activeTab = 'ast'"
          >
            {{ t.tabs.coreIr }}
          </button>
          <button
            id="playground-tab-inputs"
            class="playground-tab"
            role="tab"
            :aria-selected="activeTab === 'inputs'"
            :tabindex="activeTab === 'inputs' ? 0 : -1"
            aria-controls="playground-panel-inputs"
            :class="{ active: activeTab === 'inputs' }"
            @click="activeTab = 'inputs'"
          >
            {{ t.tabs.inputs }}
          </button>
          <button
            id="playground-tab-console"
            class="playground-tab"
            role="tab"
            :aria-selected="activeTab === 'console'"
            :tabindex="activeTab === 'console' ? 0 : -1"
            aria-controls="playground-panel-console"
            :class="{ active: activeTab === 'console' }"
            @click="activeTab = 'console'"
          >
            {{ t.tabs.console }}
          </button>
        </div>
        <div class="playground-tab-content">
          <!-- Diagnostics -->
          <div
            v-if="activeTab === 'diagnostics'"
            id="playground-panel-diagnostics"
            role="tabpanel"
            aria-labelledby="playground-tab-diagnostics"
          >
            <ul v-if="diagnostics.length > 0" class="diagnostic-list" role="list">
              <li
                v-for="(d, i) in diagnostics"
                :key="i"
                class="diagnostic-item"
                :class="{ clickable: diagnosticLine(d) > 0 }"
                role="button"
                tabindex="0"
                :title="diagnosticLine(d) > 0 ? 'Click to jump to line' : ''"
                @click="jumpToDiagnostic(d)"
                @keydown.enter="jumpToDiagnostic(d)"
                @keydown.space.prevent="jumpToDiagnostic(d)"
              >
                <span class="diagnostic-severity error">ERROR</span>
                <span v-if="d.span" class="diagnostic-location">
                  L{{ d.span.start.line }}:{{ d.span.start.col }}
                </span>
                <span class="diagnostic-message">{{ d.message }}</span>
              </li>
            </ul>
            <p v-else style="color: var(--playground-success);">{{ t.messages.noErrors }}</p>
          </div>
          <!-- Schema -->
          <div
            v-if="activeTab === 'schema'"
            id="playground-panel-schema"
            role="tabpanel"
            aria-labelledby="playground-tab-schema"
          >
            <div v-if="schemaResult?.success">
              <p><strong>Module:</strong> {{ schemaResult.moduleName }}</p>
              <p><strong>Function:</strong> {{ schemaResult.functionName }}</p>
              <table v-if="schemaResult.parameters?.length" class="schema-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Kind</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in schemaResult.parameters" :key="p.name">
                    <td>{{ p.name }}</td>
                    <td>{{ p.type }}</td>
                    <td>{{ p.typeKind }}</td>
                  </tr>
                </tbody>
              </table>
              <p v-else>No parameters.</p>
            </div>
            <p v-else-if="schemaResult?.error" class="error">{{ schemaResult.error }}</p>
            <p v-else style="color: var(--vp-c-text-3);">{{ t.messages.runToSeeSchema }}</p>
          </div>
          <!-- AST / Core IR -->
          <div
            v-if="activeTab === 'ast'"
            id="playground-panel-ast"
            role="tabpanel"
            aria-labelledby="playground-tab-ast"
          >
            <pre v-if="compileResult?.core">{{ formatJson(compileResult.core) }}</pre>
            <pre v-else-if="compileResult?.parseErrors">{{ formatJson(compileResult.parseErrors) }}</pre>
            <p v-else style="color: var(--vp-c-text-3);">{{ t.messages.runToSeeCore }}</p>
          </div>
          <!-- Inputs (editable) -->
          <div
            v-if="activeTab === 'inputs'"
            id="playground-panel-inputs"
            role="tabpanel"
            aria-labelledby="playground-tab-inputs"
          >
            <div v-if="compileResult?.success" class="inputs-editor">
              <textarea
                class="inputs-textarea"
                v-model="editableInputs"
                spellcheck="false"
              ></textarea>
            </div>
            <p v-else style="color: var(--vp-c-text-3);">{{ t.messages.compileToEdit }}</p>
          </div>
          <!-- Console -->
          <div
            v-if="activeTab === 'console'"
            id="playground-panel-console"
            role="tabpanel"
            aria-labelledby="playground-tab-console"
            class="console-output"
          >
            <div v-if="backendInFlight" class="console-placeholder">
              {{ t.messages.awaitingBackend }}
            </div>
            <div v-else-if="evalResult !== null || evalError !== null">
              <div class="console-prompt">
                <span class="console-chevron">&gt;</span>
                <span>{{ lastCalledFunc }}({{ lastCalledArgs }})</span>
                <span class="run-badge" :class="runOnBackend ? 'cloud' : 'browser'">
                  {{ runOnBackend ? t.toolbar.backendBadge : t.toolbar.browserBadge }}
                </span>
              </div>
              <div v-if="evalError" class="console-error">
                Error: {{ evalError }}
              </div>
              <div v-else class="console-result">
                <span class="console-label">{{ t.messages.result }}</span>
                <pre class="console-value">{{ formatResult(evalResult) }}</pre>
              </div>
              <div v-if="evalTime !== null" class="console-time">
                {{ t.messages.execTime(evalTime) }}
              </div>
            </div>
            <p v-else class="console-placeholder">
              {{ t.messages.runPrompt }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="playground-footer">
      <span :class="footerClass">{{ footerText }}</span>
    </div>
  </div>
</template>
