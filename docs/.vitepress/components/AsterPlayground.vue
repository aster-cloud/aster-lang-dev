<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted, watch, computed } from 'vue';
import { templates } from './playground-templates';

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
const activeTab = ref<'diagnostics' | 'schema' | 'ast' | 'inputs'>('diagnostics');
const isRunning = ref(false);
const diagnostics = ref<any[]>([]);
const schemaResult = ref<any>(null);
const compileResult = ref<any>(null);
const sampleInputs = ref<any>(null);
const lastError = ref<string | null>(null);

// Lazy-loaded modules
let asterLang: any = null;
let cmView: any = null;
let cmState: any = null;
let cmCommands: any = null;

const currentTemplates = computed(() => templates[lexiconId.value] || templates.EN_US);

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
      } else {
        sampleInputs.value = null;
      }
    } else {
      schemaResult.value = null;
      sampleInputs.value = null;
    }

    // Auto-select tab
    if (diagnostics.value.length > 0) {
      activeTab.value = 'diagnostics';
    } else if (schemaResult.value?.success && activeTab.value === 'diagnostics') {
      activeTab.value = 'schema';
    }
  } catch (err: any) {
    lastError.value = err.message || String(err);
  } finally {
    isRunning.value = false;
  }
}

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

  const initialSource = currentTemplates.value[0]?.source || '';

  const extensions = [
    cmView.lineNumbers(),
    cmView.highlightActiveLine(),
    cmView.drawSelection(),
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
}

watch(lexiconId, () => {
  // Load first template for new lexicon
  const template = currentTemplates.value[0];
  if (template) {
    setSource(template.source);
  }
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

const footerText = computed(() => {
  if (isRunning.value) return 'Analyzing...';
  if (lastError.value) return lastError.value;
  const errCount = diagnostics.value.length;
  if (errCount > 0) return `${errCount} error${errCount > 1 ? 's' : ''} found`;
  if (compileResult.value?.success) return 'Compiled successfully';
  return 'Ready';
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
        Language:
        <select :value="lexiconId" @change="onLexiconChange">
          <option value="EN_US">English</option>
          <option value="ZH_CN">中文</option>
          <option value="DE_DE">Deutsch</option>
        </select>
      </label>
      <label>
        Template:
        <select @change="onTemplateChange">
          <option
            v-for="t in currentTemplates"
            :key="t.id"
            :value="t.id"
          >
            {{ t.name }}
          </option>
        </select>
      </label>
      <button class="secondary" @click="onReset">Reset</button>
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
            Diagnostics
            <span v-if="diagnostics.length > 0">({{ diagnostics.length }})</span>
          </button>
          <button
            class="playground-tab"
            :class="{ active: activeTab === 'schema' }"
            @click="activeTab = 'schema'"
          >
            Schema
          </button>
          <button
            class="playground-tab"
            :class="{ active: activeTab === 'ast' }"
            @click="activeTab = 'ast'"
          >
            Core IR
          </button>
          <button
            class="playground-tab"
            :class="{ active: activeTab === 'inputs' }"
            @click="activeTab = 'inputs'"
          >
            Inputs
          </button>
        </div>
        <div class="playground-tab-content">
          <!-- Diagnostics -->
          <div v-if="activeTab === 'diagnostics'">
            <ul v-if="diagnostics.length > 0" class="diagnostic-list">
              <li v-for="(d, i) in diagnostics" :key="i" class="diagnostic-item">
                <span class="diagnostic-severity error">ERROR</span>
                <span v-if="d.span" class="diagnostic-location">
                  L{{ d.span.start.line }}:{{ d.span.start.col }}
                </span>
                <span class="diagnostic-message">{{ d.message }}</span>
              </li>
            </ul>
            <p v-else style="color: var(--playground-success);">No errors found.</p>
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
            <p v-else style="color: var(--vp-c-text-3);">Run analysis to see schema.</p>
          </div>
          <!-- AST / Core IR -->
          <div v-if="activeTab === 'ast'">
            <pre v-if="compileResult?.core">{{ formatJson(compileResult.core) }}</pre>
            <pre v-else-if="compileResult?.parseErrors">{{ formatJson(compileResult.parseErrors) }}</pre>
            <p v-else style="color: var(--vp-c-text-3);">Run analysis to see Core IR.</p>
          </div>
          <!-- Sample Inputs -->
          <div v-if="activeTab === 'inputs'">
            <pre v-if="sampleInputs">{{ formatJson(sampleInputs) }}</pre>
            <p v-else style="color: var(--vp-c-text-3);">Run analysis to generate sample inputs.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="playground-footer">
      <span :class="footerClass">{{ footerText }}</span>
    </div>
  </div>
</template>
