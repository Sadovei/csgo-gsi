export function parseTimer(timer: number) {
  const minutes = Math.floor(timer / 60)
  const seconds = timer % 60
  const secZero = seconds < 10 ? '0' : ''
  return `${minutes}:${secZero}${seconds}`
}
