#ifdef GL_OES_standard_derivatives
  #extension GL_OES_standard_derivatives : enable
#endif

precision highp float;
uniform float border;
uniform float opacity;
uniform vec3 color;
uniform sampler2D map;
varying vec2 vUv;

#define pxRange 2.0
#define borderColor vec3(1.0, 1.0, 1.0)

float linearStep(float a, float b, float x) {
    return clamp((x-a)/(b-a), 0.0, 1.0);
}

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main() {
  vec3 sample =  1.0 - texture2D(map, vUv).rgb;
  float pxSize = min(0.5/pxRange*(fwidth(vUv.x)*512.+fwidth(vUv.y)*512.), 0.25);
  float sigDist = median(sample.r, sample.g, sample.b) - 1.0 + 0.5;
  float inside = linearStep(-border-pxSize, -border+pxSize, sigDist);
  float outside = linearStep(border-pxSize, border+pxSize, sigDist);
  gl_FragColor = vec4(inside - outside);
  if (gl_FragColor.a < 0.0001) discard;
}