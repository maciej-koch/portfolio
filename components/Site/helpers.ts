import { content } from '@/lib/content'
import { ids } from './constants'

export const titleFor = (active: string) =>
  active === ids[0] ? content.title : `${content.sections.find((s) => s.id === active)!.label} · ${content.name}`

export const fromHash = () => {
  const id = window.location.hash.slice(1)
  return ids.includes(id) ? id : ids[0]
}
