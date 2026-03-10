export function useDebouncedRef(initialValue, delay, immediate) {
  const state = ref(initialValue)
  const debouncedRef = customRef((track, trigger) => ({
    get() {
      track()
      return state.value
    },
    set: debounce(
      value => {
        state.value = value
        trigger()
      },
      delay,
      immediate
    ),
  }))
  return debouncedRef
}

export function useDebouncedProxy(source, key, delay) {
  // create a proxy ref
  const proxy = useDebouncedRef(source.value[key], delay)

  // watch the source for updates
  watch(() => source.value[key], (change) => {
    if (proxy.value != change)
      proxy.value = change
  })

  // watch the proxy for updates
  watch(proxy, (change) => {
    if (source.value[key] != change)
      source.value[key] = change
  })

  // provide the proxy
  return proxy
}

export function useDebounceFn(fn, delay = 0, immediate = false) {
  return debounce(fn, delay, immediate)
}

function debounce(fn, delay = 0, immediate = false) {
  let timeout
  return (...args) => {
    if (immediate && !timeout) fn(...args)
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
