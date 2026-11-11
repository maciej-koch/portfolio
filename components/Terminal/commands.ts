import { egg, WORDS } from '@/lib/eggs'
import { CLOSE_MS, FILES, FORBIDDEN, HELP, KIDDING, KIDDING_MS, WIPE, WIPE_LINE_MS, WIPE_MS } from './constants'
import type { Shell } from './types'

// the page "goes away" while the terminal reports the damage, the terminal dies too, a "just kidding" shows on the
// empty screen, and the page comes back
function wipe({ print, close }: Shell) {
  egg('rm')
  ;(document.activeElement as HTMLElement | null)?.blur() // closes the phone keyboard, so the show is visible
  document.body.classList.add('wiped')
  WIPE.forEach((line, i) => setTimeout(() => print(line), 400 + i * WIPE_LINE_MS))
  setTimeout(close, CLOSE_MS)
  const note = document.createElement('p')
  note.className = 'kidding pointer-events-none fixed inset-0 z-10 flex animate-enter items-center justify-center px-4 text-center font-mono text-text'
  note.textContent = KIDDING
  setTimeout(() => document.body.append(note), KIDDING_MS)
  setTimeout(() => {
    note.remove()
    document.body.classList.remove('wiped')
  }, WIPE_MS)
}

export function execute(input: string, shell: Shell) {
  const [name, ...args] = input.split(/\s+/)
  if (input === FORBIDDEN) return wipe(shell)
  if (name in WORDS) return egg(WORDS[name as keyof typeof WORDS])
  switch (name) {
    case 'help':
      return shell.print(HELP)
    case 'ls':
      return shell.print(Object.keys(FILES).join('  '))
    case 'cat':
      return shell.print(...(FILES[args[0]] ?? [`cat: ${args[0] ?? ''}: No such file or directory`]))
    case 'clear':
      return shell.clear()
    case 'exit':
      return shell.close()
    case 'whoami':
      return shell.print('maciej')
    default:
      return shell.print(`${name}: command not found`)
  }
}
