export type Shell = {
  print: (...lines: string[]) => void
  clear: () => void
  close: () => void
}
