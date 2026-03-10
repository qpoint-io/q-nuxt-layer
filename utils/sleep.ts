// await'able timer
export function sleep(duration: number) {
  return new Promise((resolve: Function) => (
    setTimeout(resolve, duration)
  ))
}
