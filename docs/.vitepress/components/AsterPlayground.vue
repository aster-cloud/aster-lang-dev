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
const activeTab = ref<'diagnostics' | 'schema' | 'ast' | 'inputs' | 'console'>('diagnostics');
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

  activeTab.value = 'console';
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
      <button class="run-btn" :disabled="!canRun" @click="onRun">{{ t.toolbar.run }}</button>
      <button class="secondary" @click="onReset">{{ t.toolbar.reset }}</button>
    </div>
    <div class="playground-grid" :style="{ height: height }">
      <div class="playground-editor" ref="editorContainer"></div>
      <div class="playground-results">
        <div class="playground-tabs">
          <button
            class="playground-tab"
            :class="{ active: activeTab === 'diagnostics' }"
            @click="activeTab = 'diagnostics'"
          >
            {{ t.tabs.diagnostics }}
            <span v-if="diagnostics.length > 0">({{ diagnostics.length }})</span>
          </button>
          <button
            class="playground-tab"
            :class="{ active: activeTab === 'schema' }"
            @click="activeTab = 'schema'"
          >
            {{ t.tabs.schema }}
          </button>
          <button
            class="playground-tab"
            :class="{ active: activeTab === 'ast' }"
            @click="activeTab = 'ast'"
          >
            {{ t.tabs.coreIr }}
          </button>
          <button
            class="playground-tab"
            :class="{ active: activeTab === 'inputs' }"
            @click="activeTab = 'inputs'"
          >
            {{ t.tabs.inputs }}
          </button>
          <button
            class="playground-tab"
            :class="{ active: activeTab === 'console' }"
            @click="activeTab = 'console'"
          >
            {{ t.tabs.console }}
          </button>
        </div>
        <div class="playground-tab-content">
          <!-- Diagnostics -->
          <div v-if="activeTab === 'diagnostics'">
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
          <div v-if="activeTab === 'schema'">
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
          <div v-if="activeTab === 'ast'">
            <pre v-if="compileResult?.core">{{ formatJson(compileResult.core) }}</pre>
            <pre v-else-if="compileResult?.parseErrors">{{ formatJson(compileResult.parseErrors) }}</pre>
            <p v-else style="color: var(--vp-c-text-3);">{{ t.messages.runToSeeCore }}</p>
          </div>
          <!-- Inputs (editable) -->
          <div v-if="activeTab === 'inputs'">
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
          <div v-if="activeTab === 'console'" class="console-output">
            <div v-if="evalResult !== null || evalError !== null">
              <div class="console-prompt">
                <span class="console-chevron">&gt;</span>
                <span>{{ lastCalledFunc }}({{ lastCalledArgs }})</span>
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
