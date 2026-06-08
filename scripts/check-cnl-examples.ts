/**
 * CNL 示例验证器
 *
 * 提取文档中所有 ```aster 代码块，用 @aster-cloud/aster-lang-ts 编译 + 类型检查，
 * 确保发布到 aster-lang.dev 的示例真实可编译。防止文档示例随语言演进而失效。
 *
 * 用法：
 *   tsx scripts/check-cnl-examples.ts            # 检查全部，失败非零退出
 *   tsx scripts/check-cnl-examples.ts --list     # 仅列出示例不校验
 *
 * 约定：
 *   - 代码块标注 ```aster        → 必须完整编译（含 Module 头 + 至少一个 Rule）
 *   - 代码块标注 ```aster ignore → 片段 / 故意不完整 / 多语言展示，跳过编译
 *     （沿用文档站既有 `aster ignore` 约定）
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { compileAndTypecheck, EN_US, ZH_CN, DE_DE } from '@aster-cloud/aster-lang-ts/browser';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** 递归收集目录下所有 .md 文件（与其它脚本一致，避免依赖 Node 22 实验性 globSync） */
function walkMarkdown(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) {
      walkMarkdown(abs, out);
    } else if (name.endsWith('.md')) {
      out.push(abs);
    }
  }
  return out;
}

interface Example {
  file: string;
  line: number;
  lang: string;
  code: string;
}

/** 从 markdown 提取所有 aster / aster-ignore 代码块 */
function extractExamples(file: string): Example[] {
  const text = readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  const examples: Example[] = [];
  let inBlock = false;
  let lang = '';
  let startLine = 0;
  let buf: string[] = [];

  lines.forEach((line, idx) => {
    // 匹配 ```aster 与 ```aster ignore（ignore 后缀 → 跳过编译）
    const fence = /^```aster(\s+ignore)?\s*$/.exec(line.trim());
    if (!inBlock && fence) {
      inBlock = true;
      lang = fence[1] ? 'aster-ignore' : 'aster';
      startLine = idx + 1;
      buf = [];
      return;
    }
    if (inBlock && /^```\s*$/.test(line.trim())) {
      examples.push({ file, line: startLine, lang, code: buf.join('\n') });
      inBlock = false;
      return;
    }
    if (inBlock) {
      buf.push(line);
    }
  });

  return examples;
}

function main(): void {
  const listOnly = process.argv.includes('--list');
  const files = walkMarkdown(join(ROOT, 'docs'));

  let total = 0;
  let checked = 0;
  let snippets = 0;
  const failures: { ex: Example; messages: string[] }[] = [];

  for (const file of files) {
    for (const ex of extractExamples(file)) {
      total += 1;
      const loc = `${relative(ROOT, ex.file)}:${ex.line}`;

      if (ex.lang === 'aster-ignore') {
        snippets += 1;
        if (listOnly) console.log(`  [snippet] ${loc}`);
        continue;
      }

      if (listOnly) {
        console.log(`  [check]   ${loc}`);
        continue;
      }

      // 按文档路径选 lexicon：docs/zh → 中文示例，docs/de → 德文，其余英文
      const rel = relative(ROOT, ex.file);
      const lexicon = rel.startsWith('docs/zh/') ? ZH_CN : rel.startsWith('docs/de/') ? DE_DE : EN_US;
      const result = compileAndTypecheck(ex.code, { lexicon });
      const parseErrors = (result.parseErrors ?? []).map((e: unknown) =>
        typeof e === 'object' && e !== null && 'message' in e ? (e as { message: string }).message : String(e),
      );
      const typeErrors = (result.typeErrors ?? []).map((e: { message: string }) => e.message);
      const messages = [...parseErrors.map((m) => `parse: ${m}`), ...typeErrors.map((m) => `type: ${m}`)];

      checked += 1;
      if (messages.length > 0) {
        failures.push({ ex, messages });
      }
    }
  }

  if (listOnly) {
    console.log(`\n共 ${total} 个示例（${total - snippets} 待校验 + ${snippets} 片段）`);
    return;
  }

  if (failures.length > 0) {
    console.error('\n❌ CNL 示例编译失败：\n');
    for (const { ex, messages } of failures) {
      console.error(`  ${relative(ROOT, ex.file)}:${ex.line}`);
      messages.forEach((m) => console.error(`    ${m}`));
      console.error('');
    }
    console.error(`${failures.length}/${checked} 个示例失败。修正示例，或将纯展示片段标为 \`\`\`aster ignore。`);
    process.exit(1);
  }

  console.log(`✓ ${checked} 个 CNL 示例编译通过（另有 ${snippets} 个片段跳过）`);
}

main();
