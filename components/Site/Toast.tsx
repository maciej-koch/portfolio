import type { Toast as Props } from './types'

// phones: in the top right corner, between the name and the ✦ button; the longer finale is centred under the name.
// Desktop: centred at the top. --toast-x is the horizontal shift the toast keyframes keep (static too, for reduced motion)
const PLACE = {
  // smaller under 400px so it still fits next to the name (360-390px phones); under 340px there is no room, so it goes
  // under the name like the finale
  corner:
    'top-[26px] right-[50px] px-4 py-1.5 text-[0.95rem] [--toast-x:0] animate-toast max-[399px]:top-[30px] max-[399px]:px-3 max-[399px]:py-1 max-[399px]:text-[0.8rem] max-[339px]:top-[104px] max-[339px]:right-auto max-[339px]:left-1/2 max-[339px]:[--toast-x:-50%]',
  centre: 'top-[104px] left-1/2 px-5 py-2 text-[1.1rem] [--toast-x:-50%] animate-toast-long max-[379px]:px-4 max-[379px]:text-[0.95rem]',
}

export default function Toast({ text, final }: Props) {
  return (
    <p
      className={`toast pointer-events-none fixed z-[3] rounded-full border border-gold/60 bg-bg/90 font-mono whitespace-nowrap text-gold shadow-[0_0_20px_rgb(230_193_90/0.3)] [translate:var(--toast-x)_0] motion-reduce:animate-none lg:top-[50px] lg:right-auto lg:left-1/2 lg:px-5 lg:py-2 lg:[--toast-x:-50%] ${
        final ? `${PLACE.centre} lg:text-[1.1rem]` : `${PLACE.corner} lg:text-[1.05rem]`
      }`}
      role="status"
    >
      ✦ {text}
    </p>
  )
}
