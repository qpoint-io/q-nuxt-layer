#!/usr/bin/env node
//
// tokens/build.mjs — emit DTCG token JSON from tailwind.config.js
//
// tailwind.config.js is the single source of truth for tokens. This script
// reads it and writes tokens/tokens.json in the W3C Design Tokens (DTCG)
// shape, which is the interchange format for the Figma side (Tokens Studio)
// and any other consumer. Run: `node tokens/build.mjs`
//
// The config is ESM but calls require() in its `plugins` array; we shim a
// global require so importing it doesn't throw. We only read `theme`, never
// the plugins, so this is side-effect-free for our purposes.

import { writeFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

globalThis.require ??= createRequire(import.meta.url)

const here = dirname(fileURLToPath(import.meta.url))
const config = (await import(join(here, '..', 'tailwind.config.js'))).default
const theme = config.theme
const colors = theme.extend.colors

// ── helpers ──────────────────────────────────────────────────────────────
const remToPx = (v) => (typeof v === 'string' && v.endsWith('rem'))
  ? `${parseFloat(v) * 16}px` : v

const colorGroup = (obj) => {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') out[k] = { $type: 'color', $value: v }
  }
  return out
}

// ── color ────────────────────────────────────────────────────────────────
const color = {
  grape: colorGroup(colors.grape),
  leaf:  colorGroup(colors.leaf),
  grey:  colorGroup(colors.grey),
  semantic: colorGroup({
    error: colors.error, warning: colors.warning,
    success: colors.success, info: colors.info, warn: colors.warn,
  }),
  accent: colorGroup({
    mint: colors.mint, orchid: colors.orchid, blue: colors.blue,
    soot: colors.soot, red: colors.red, tableBorder: colors.tableBorder,
  }),
}

// ── typography ─────────────────────────────────────────────────────────────
const fontFamily = Object.fromEntries(
  Object.entries(theme.fontFamily).map(([k, v]) => [k, { $type: 'fontFamily', $value: v }]),
)
const fontWeight = Object.fromEntries(
  Object.entries(theme.fontWeight).map(([k, v]) => [k, { $type: 'fontWeight', $value: v }]),
)
// fontSize values are [size, lineHeight]; DTCG has no composite text type here,
// so emit size as dimension with lineHeight carried in $extensions.
const fontSize = Object.fromEntries(
  Object.entries(theme.fontSize).map(([k, [size, lineHeight]]) => [
    k, { $type: 'dimension', $value: size, $extensions: { lineHeight } },
  ]),
)

// ── spacing / radius / border ──────────────────────────────────────────────
const dimGroup = (obj) => Object.fromEntries(
  Object.entries(obj).map(([k, v]) => [k, { $type: 'dimension', $value: remToPx(v) }]),
)
const spacing = dimGroup(theme.extend.spacing)
const radius  = dimGroup(theme.extend.borderRadius)
const borderWidth = dimGroup(theme.borderWidth)

// ── assemble + write ───────────────────────────────────────────────────────
const tokens = {
  $description: 'Qpoint design tokens — generated from tailwind.config.js. Do not edit by hand.',
  color, fontFamily, fontSize, fontWeight, spacing, radius, borderWidth,
}

mkdirSync(here, { recursive: true })
const outPath = join(here, 'tokens.json')
writeFileSync(outPath, JSON.stringify(tokens, null, 2) + '\n')

const count = Object.values(color).reduce((n, g) => n + Object.keys(g).length, 0)
console.log(`✓ wrote ${outPath}`)
console.log(`  ${count} colors · ${Object.keys(fontSize).length} font sizes · ${Object.keys(spacing).length} spacing · ${Object.keys(radius).length} radii`)
