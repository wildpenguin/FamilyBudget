import { readFileSync } from 'node:fs';
import { build } from 'esbuild';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));

// Bundle workspace packages (e.g. @ourbudget/shared) in; keep real npm
// dependencies external so they're resolved from node_modules at runtime.
const external = Object.keys(pkg.dependencies ?? {}).filter(
  (name) => name !== '@ourbudget/shared',
);

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: 'dist/index.js',
  external,
});
