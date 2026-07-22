/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',

  content: [
    './components/**/*.{js,vue,ts}',
    './composables/**/*.{js,ts}',
    './assets/**/*.css',
  ],

  theme: {
    //
    // ── Core theme (replaces Tailwind defaults) ──────────────────────────
    //

    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      mono: ['Geist Mono', 'IBM Plex Mono', 'Consolas', 'monospace'],
      dev:  ['rigid-square', 'sans-serif'],
    },

    // Complete type scale — brand + extended, production line-heights.
    // Replaces Tailwind defaults (text-sm, text-base, etc. are not used).
    fontSize: {
      '68': ['68px', '70px'],
      '64': ['64px', '66px'],
      '58': ['58px', '66px'],
      '56': ['56px', '62px'],   // Display
      '48': ['48px', '46px'],
      '44': ['44px', '50px'],
      '40': ['40px', '44px'],   // H1
      '38': ['38px', '46px'],
      '36': ['36px', '38px'],
      '35': ['35px', '45px'],
      '32': ['32px', '38px'],
      '30': ['30px', '48px'],
      '28': ['28px', '36px'],   // H2
      '26': ['26px', '33px'],
      '25': ['25px', '32px'],
      '24': ['24px', '32px'],
      '23': ['23px', '32px'],
      '22': ['22px', '30px'],
      '21': ['21px', '28px'],
      '20': ['20px', '26px'],   // H3
      '18': ['18px', '26px'],   // Body Large
      '16': ['16px', '22px'],   // Body
      '15': ['15px', '24px'],
      '14': ['14px', '26px'],   // Body Small / Code
      '13': ['13px', '24px'],
      '12': ['12px', '24px'],   // Label
      '11': ['11px', '18px'],
    },

    fontWeight: {
      reg:    400,
      med:    500,
      semi:   600,
      bold:   700,
      exbold: 800,
      black:  900,
    },

    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '1': '1px',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '5': '5px',
      '6': '6px',
      '8': '8px',
    },

    //
    // ── Extended theme (merges with Tailwind defaults) ───────────────────
    //

    extend: {
      colors: {
        // Primary — Grape (brand foundation v1.5, 12-step scale)
        grape: {
          DEFAULT: '#895AE8',
          50:  '#F9F7FF',
          100: '#EFEBFC',
          150: '#E5DAFF',
          200: '#D7CAFE',
          300: '#BBA5FF',
          400: '#AB86F6',
          500: '#895AE8',
          600: '#7742E2',
          700: '#5E29CC',
          800: '#45199E',
          850: '#32146E',
          900: '#270B5E',
        },

        // Accent — Leaf (positive signal, 4-step scale)
        leaf: {
          DEFAULT: '#58E392',
          300: '#58E392',
          400: '#49CF81',
          500: '#34BC6D',
          600: '#1B974F',
        },

        // Neutral — Grey (13-step scale)
        grey: {
          DEFAULT: '#949494',
          50:  '#FAFAFA',
          100: '#F5F5F5',
          150: '#F0F0F0',
          200: '#E8E8E8',
          300: '#D4D4D4',
          350: '#AAAAAA',
          400: '#949494',
          500: '#7A7B7C',
          600: '#565454',
          700: '#393939',
          800: '#2B2A2A',
          900: '#111111',
        },

        // Semantic theme tokens — backed by CSS vars (assets/css/tokens.css,
        // generated from tokens/semantic.mjs), flip under `.dark`. Channel
        // form keeps opacity utilities working (bg-surface/50).
        surface:           'rgb(var(--qp-surface) / <alpha-value>)',
        'surface-sunken-subtle': 'rgb(var(--qp-surface-sunken-subtle) / <alpha-value>)',
        'surface-sunken':  'rgb(var(--qp-surface-sunken) / <alpha-value>)',
        'surface-sunken-deeper': 'rgb(var(--qp-surface-sunken-deeper) / <alpha-value>)',
        content:           'rgb(var(--qp-content) / <alpha-value>)',
        'content-muted':   'rgb(var(--qp-content-muted) / <alpha-value>)',
        'content-subtle':  'rgb(var(--qp-content-subtle) / <alpha-value>)',
        'content-subtler': 'rgb(var(--qp-content-subtler) / <alpha-value>)',
        stroke:            'rgb(var(--qp-stroke) / <alpha-value>)',
        'stroke-strong':   'rgb(var(--qp-stroke-strong) / <alpha-value>)',
        primary:           'rgb(var(--qp-primary) / <alpha-value>)',
        'on-primary':      'rgb(var(--qp-on-primary) / <alpha-value>)',
        'signal-success':  'rgb(var(--qp-success) / <alpha-value>)',
        'signal-error':    'rgb(var(--qp-error) / <alpha-value>)',
        'signal-warning':  'rgb(var(--qp-warning) / <alpha-value>)',
        'signal-info':     'rgb(var(--qp-info) / <alpha-value>)',

        // Semantic
        error:   '#EF4444',
        warning: '#F59E0B',
        success: '#58E392',
        info:    '#D7CAFE',

        // Shared utility colors (used in btn-danger, btn-danger-outline)
        warn: '#F87F7D',

        // Table borders (used in table-list components)
        tableBorder: '#CCCCCC',

        // Legacy (used across sister projects)
        mint:   '#21EBD0',
        orchid: '#AE73C2',
        blue:   '#2FAEFD',
        soot:   '#494b4d',
        red:    '#FF0033'
      },

      borderRadius: {
        '1':  '1px',
        '2':  '2px',
        '3':  '3px',
        '4':  '4px',
        '5':  '5px',
        '6':  '6px',
        '8':  '8px',
        '10': '10px',
        '12': '12px',
        '14': '14px',
        '16': '16px',
        '18': '18px',
        '24': '24px',
        '32': '32px',
      },

      spacing: {
        px64: '4rem',
        px48: '3rem',
        px40: '2.5rem',
        px32: '2rem',
        px24: '1.5rem',
        px16: '1rem',
        px8:  '0.5rem',
      },

      screens: {
        big:  '850px',
        xs:   '480px',
        xxs:  '420px',
        xxxs: '380px',
      },

      animation: {
        'fade-in-60': 'fade 1s linear forwards',
      },

      keyframes: {
        fade: {
          '0%':   { opacity: '0%' },
          '100%': { opacity: '60%' },
        },
      },

      transitionTimingFunction: {
        'in-out-quint': 'cubic-bezier(0.83, 0, 0.17, 1)',
      },
    },
  },

  safelist: [
    'shadow-lg',
    'shadow-md',
    'shadow-sm',
    'shadow',
    'shadow-xl',
  ],

  plugins: [
    require('tailwindcss-animation-delay'),
    require('@tailwindcss/forms')({ strategy: 'base' }),
  ],
}
