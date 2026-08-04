//
// tokens/semantic.mjs — semantic theme roles, the single source of light/dark
// pairings. Every hex is drawn from the palette in tailwind.config.js.
//
// Consumed by tokens/build.mjs to emit assets/css/tokens.css (CSS variables
// that flip under `.dark`). Keys become `--qp-<key>` vars; the Tailwind-facing
// names live in tailwind.config.js (signal roles are namespaced `signal-*`
// there so the existing flat error/warning/success/info keys stay untouched).
//
// Surfaces are deliberately a two-tier system (surface + surface-sunken): the
// design language is flat and hairline-driven, not elevation-tiered. Raised
// panels (modals, toasts) separate via `border-stroke` in dark, not a lighter
// background. A raised tier can be added later — additive, non-breaking.

export const semantic = {
  surface:          { light: '#FFFFFF', dark: '#111111' }, // dark: grey-900
  'surface-sunken-subtle': { light: '#FAFAFA', dark: '#161515' }, // light: grey-50; barely recessed, between surface & sunken
  'surface-sunken': { light: '#F5F5F5', dark: '#1A1919' }, // light: grey-100
  'surface-sunken-deeper': { light: '#e6e6e6', dark: '#1F1E1E' }, // light: grey-200/60 over white; deepest recess
  content:          { light: '#2B2A2A', dark: '#F5F5F5' }, // grey-800 / grey-100
  'content-muted':  { light: '#565454', dark: '#AAAAAA' }, // grey-600 / grey-350
  'content-subtle': { light: '#7A7B7C', dark: '#7A7B7C' }, // grey-500 both
  'content-subtler': { light: '#D4D4D4', dark: '#D4D4D4' }, // grey-300 both
  stroke:           { light: '#E8E8E8', dark: '#393939' }, // grey-200 / grey-700
  'stroke-strong':  { light: '#D4D4D4', dark: '#565454' }, // grey-300 / grey-600
  primary:          { light: '#895AE8', dark: '#AB86F6' }, // grape-500 / grape-400
  'on-primary':     { light: '#FFFFFF', dark: '#FFFFFF' },
  success:          { light: '#34BC6D', dark: '#58E392' }, // leaf-500 / leaf-300
  error:            { light: '#EF4444', dark: '#F87F7D' }, // error / warn
  warning:          { light: '#F59E0B', dark: '#F59E0B' },
  info:             { light: '#7742E2', dark: '#BBA5FF' }, // grape-600 / grape-300
}

// Pixel-art roles (c59) — emitted as `--px-<key>` in HEX form (not RGB
// channels: these are consumed directly as SVG fills by UxPixelArt, never
// through Tailwind alpha utilities). Light values are the art hexes verbatim,
// so exports render unchanged in light mode; dark values are a conservative
// first pass for dark surfaces — tune visually.
export const pixelArt = {
  body:          { light: '#A6ADAD', dark: '#A6ADAD' }, // awake pawn body + icon bodies
  shade:         { light: '#4D5C5A', dark: '#5C6967' }, // awake shadow side
  eye:           { light: '#FFFFFF', dark: '#FFFFFF' },
  'pawn-pupil':  { light: '#000000', dark: '#111111' }, // sits on the light body — stays near-black
  'sleep-body':  { light: '#C6CCCB', dark: '#6B7876' }, // + the zzz; light = faded, lighter than the awake body (asleep reads washed out, not dark)
  'sleep-shade': { light: '#8A9492', dark: '#3A4543' }, // closed-eye bars stay legible on both bodies
  alert:         { light: '#FF0030', dark: '#F87F7D' }, // dark aligns to --qp-error dark
  accent:        { light: '#AB86F6', dark: '#AB86F6' }, // grape-400 (binary highlight)
  'icon-frame':  { light: '#949494', dark: '#949494' },
  'icon-accent': { light: '#565454', dark: '#8A8888' },
}
