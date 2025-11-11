#!/usr/bin/env node
/**
 * Quick regression harness for the Tabs primitive.
 *
 * Compiles the Svelte source to SSR on-the-fly and renders it with dummy props.
 * Useful for checking whether rest-prop handling is working (and surfaces
 * ReferenceError stack traces locally instead of in a downstream app).
 */

import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { compile } from 'svelte/compiler';

const WORKSPACE_TABS = path.resolve(
  process.cwd(),
  'packages/primitives/src/components/Tabs.svelte'
);
const AGGREGATED_TABS = path.resolve(
  process.cwd(),
  'packages/greater-components/dist/primitives/src/components/Tabs.svelte'
);

async function compileComponent(sourcePath) {
  const source = await readFile(sourcePath, 'utf8');
  const { js } = compile(source, {
    generate: 'ssr',
    sourcemap: false,
    css: 'external'
  });

  const tempRoot = path.join(process.cwd(), '.tmp-tabs-restprops');
  await mkdir(tempRoot, { recursive: true });
  const tmpDir = await mkdtemp(path.join(tempRoot, 'case-'));
  const tmpFile = path.join(tmpDir, 'component.mjs');
  await writeFile(tmpFile, js.code, 'utf8');

  const mod = await import(pathToFileURL(tmpFile).href);
  return {
    module: mod,
    cleanup: () => rm(tmpDir, { recursive: true, force: true })
  };
}

function createPayload() {
  const payload = {
    out: [],
    head: '',
    css: new Set(),
    styles: ''
  };

  payload.write = (chunk) => {
    if (chunk) {
      payload.out.push(chunk);
    }
  };

  return payload;
}

async function renderTabs(label, sourcePath) {
  process.stdout.write(`\n▶ Rendering ${label} (${sourcePath})\n`);
  const { module, cleanup } = await compileComponent(sourcePath);

  const component = module.default;
  const payload = createPayload();

  try {
    component(payload, {
      tabs: [
        { id: 'tab-1', label: 'General' },
        { id: 'tab-2', label: 'Advanced' }
      ],
      orientation: 'horizontal',
      activation: 'automatic',
      variant: 'default',
      class: 'debug-tabs',
      'data-test-id': label.replace(/\s+/g, '-').toLowerCase()
    });

    const html = payload.out.join('');
    process.stdout.write('  ✅ rendered without runtime errors\n');
    process.stdout.write(`  HTML snippet:\n    ${html.slice(0, 120)}...\n`);
  } catch (error) {
    process.stdout.write('  ❌ failed to render\n');
    console.error(error);
  } finally {
    await cleanup();
  }
}

async function main() {
  await renderTabs('workspace primitives Tabs', WORKSPACE_TABS);
  await renderTabs('aggregated greater-components Tabs', AGGREGATED_TABS);
}

main().catch((error) => {
  console.error('[tabs-restprops] unexpected failure', error);
  process.exit(1);
});
