import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Single-line developer production-incident excuse (1..200 UTF-8 characters).
 * Initial baseline draft — will be replaced by the tournament champion after
 * blind pairwise evaluation against 8 distinct candidates.
 */
export const EXCUSE =
  "Production didn't crash; our circuit breaker just aggressively protected the database from all those unauthorized paying customers.";

export function validateExcuse(text: string): string {
  if (text.length === 0 || text.trim().length === 0) {
    throw new Error("Excuse must not be empty or whitespace-only.");
  }
  if (text !== text.trim()) {
    throw new Error("Excuse must not have leading or trailing whitespace.");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("Excuse must be strictly a single line.");
  }
  const codePoints = Array.from(text).length;
  const byteLength = Buffer.byteLength(text, "utf8");
  if (codePoints < 1 || codePoints > 200) {
    throw new Error(`Excuse length ${codePoints} exceeds 1..200 character limit.`);
  }
  if (byteLength > 200) {
    throw new Error(`Excuse UTF-8 byte length ${byteLength} exceeds 200 bytes.`);
  }
  return text;
}

export function resolveOutputPath(argv: readonly string[]): string {
  const flagIndex = argv.indexOf("--output");
  if (flagIndex !== -1 && argv[flagIndex + 1]) {
    return argv[flagIndex + 1];
  }
  return "/output/entry.txt";
}

function main(): void {
  const excuse = validateExcuse(EXCUSE);
  const outputPath = resolveOutputPath(process.argv.slice(2));
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, excuse, { encoding: "utf8" });
}

main();
