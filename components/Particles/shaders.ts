// shared by dots and streaks: slow drift, plus the hyperspace rush along z wrapping inside the dust box (BOX in constants.ts),
// plus the `rm -rf` crash: the dust glitches sideways and falls off the screen, a few at a time; as uCrash eases back to 0
// it rewinds into place
const drift = /* glsl */ `
uniform float uTime;
uniform float uTravel;
uniform float uCrash;
uniform float uFall;
attribute float aRand;

vec3 drifted() {
  vec3 p = position + 0.15 * vec3(
    sin(uTime * 0.3 + aRand * 40.0),
    cos(uTime * 0.25 + aRand * 30.0),
    0.0
  );
  p.z = mod(p.z + 8.0 + uTravel * (0.5 + aRand), 9.0) - 8.0;
  float t = clamp(uFall - aRand * 2.5, 0.0, 2.5); // capped just past the bottom edge, so the rewind is quick
  p.y -= uCrash * 3.0 * t * t;
  p.x += uCrash * 0.06 * sin(uTime * 53.0 + aRand * 97.0) * step(0.8, fract(uTime * 3.0 + aRand));
  return p;
}
`

export const vertexShader = /* glsl */ `
${drift}
uniform float uSize;
uniform float uWarp;
uniform float uMorph;
attribute vec3 aTarget;
varying float vAlpha;

void main() {
  // uMorph pulls every dot onto its spot in the Doors of Durin, staggered so they settle one by one
  float m = smoothstep(0.0, 1.0, clamp(uMorph * 1.5 - aRand * 0.5, 0.0, 1.0));
  vec3 p = mix(drifted(), aTarget, m);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.5 + aRand) * (1.0 + uWarp + 0.4 * m) / -mv.z;
  vAlpha = 0.55 * (0.3 + 0.7 * aRand);
}
`

export const fragmentShader = /* glsl */ `
uniform vec3 uTint;
uniform float uBoost;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(uTint, vAlpha * uBoost * (1.0 - d * 2.0));
}
`

// hyperspace streaks: a line from each dot to a tail further away, only visible while warping
export const streakVertexShader = /* glsl */ `
${drift}
uniform float uWarp;
attribute float aTail;
varying float vAlpha;

void main() {
  vec3 p = drifted();
  p.z -= aTail * uWarp * (1.0 + 2.0 * aRand);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  vAlpha = uWarp * 0.5 * (0.3 + 0.7 * aRand);
}
`

export const streakFragmentShader = /* glsl */ `
uniform vec3 uTint;
varying float vAlpha;

void main() {
  gl_FragColor = vec4(uTint, vAlpha);
}
`
