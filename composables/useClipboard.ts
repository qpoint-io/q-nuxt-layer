/**
 * Composable for copy-to-clipboard functionality.
 * Wraps navigator.clipboard.writeText with reactive feedback state.
 */
export function useClipboard(options: { resetDelay?: number } = {}) {
  const { resetDelay = 4000 } = options

  const copied = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback for older browsers / insecure contexts
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    copied.value = true

    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      copied.value = false
    }, resetDelay)
  }

  return { copied, copy }
}
