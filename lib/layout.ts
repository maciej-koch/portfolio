export const RADIUS = 2.5 // every shape is normalized to this bounding radius
export const PANEL_END = 724 // px where the desktop text column ends (grid columns in Site.tsx)

type Size = { width: number; height: number }

// Where the model sits on screen: its center, how big it may be (bounding-sphere diameter) and the width it has,
// all in px. Desktop: centered in the space right of the text column. Mobile: filling the gap between the brand
// and the text panel, whose height differs per section (measured from the DOM).
export function placement({ width, height }: Size) {
  if (width >= 1024) {
    const freeWidth = width - PANEL_END
    return { cx: PANEL_END + freeWidth / 2, cy: height / 2, diameter: Math.min(freeWidth * 0.8, height * 0.65), freeWidth }
  }
  const top = (document.querySelector('.brand')?.getBoundingClientRect().bottom ?? 0) + 8
  const bottom = (document.querySelector('.panel')?.getBoundingClientRect().top ?? height) - 8
  // the diameter is the bounding sphere, so a tall figure may be wider than the phone and still fit
  return { cx: width / 2, cy: (top + bottom) / 2, diameter: Math.min(width * 0.95, bottom - top), freeWidth: width }
}

// the same in world units at z = 0, for the scene
export function placementWorld(size: Size, viewport: { factor: number }) {
  const { cx, cy, diameter, freeWidth } = placement(size)
  const f = viewport.factor
  return { x: (cx - size.width / 2) / f, y: (size.height / 2 - cy) / f, diameter: diameter / f, freeWidth: freeWidth / f }
}
