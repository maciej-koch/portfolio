export const PROMPT = ['type `help`']
export const HELP = 'commands: ls, cat <file>, clear, exit. magic words work here too'
export const FILES: Record<string, string[]> = {
  'hints.txt': ['1. check the logo', '2. this terminal is not a toy. never run: sudo rm -rf /', '3. some words open doors. say them here'],
}
export const FORBIDDEN = 'sudo rm -rf /'
export const WIPE = [
  "rm: removing '/home/maciej/projects'",
  "rm: removing '/home/maciej'",
  "rm: removing '/usr/bin'",
  "rm: removing '/usr'",
  "rm: removing '/etc'",
  "rm: removing '/'",
  'Segmentation fault (core dumped)',
]
export const KIDDING = '…just kidding. restored from backup ✓'
export const WIPE_LINE_MS = 700
// after the last line the terminal "dies", then "just kidding" alone on the black screen, then the page comes back;
// the whole show lasts SECONDS.rm
export const CLOSE_MS = 400 + (WIPE.length - 1) * WIPE_LINE_MS + 2000
export const KIDDING_MS = CLOSE_MS + 600
export const WIPE_MS = KIDDING_MS + 2800
