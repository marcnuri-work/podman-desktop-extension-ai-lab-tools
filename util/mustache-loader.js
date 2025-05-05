import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.mustache') || specifier.endsWith('.mustache?raw')) {
    const actualSpecifier = specifier.replace('?raw', '');
    return {
      shortCircuit: true,
      url: new URL(actualSpecifier, context.parentURL || import.meta.url).href,
      format: 'mustache-raw'
    };
  }
  return nextResolve(specifier);
}

export async function load(url, context, nextLoad) {
  if (context.format === 'mustache-raw') {
    const filePath = fileURLToPath(url);
    const content = readFileSync(filePath, 'utf8');
    return {
      format: 'module',
      shortCircuit: true,
      source: `export default ${JSON.stringify(content)};`
    };
  }
  return nextLoad(url);
}
