#ifdef GL_OES_standard_derivatives
  #extension GL_OES_standard_derivatives : enable
#endif

// MSDF Border https://gist.github.com/Chlumsky/263c960ae0a7df59afc2da4051eb0553

precision highp float;
uniform sampler2D map;
uniform float border;
uniform float opacity;
uniform vec3 color;
varying vec2 vUv;

#define pxRange 2.0
#define borderColor vec3(1.0, 1.0, 1.0)


float linearStep(float a, float b, float x) {
    return clamp((x-a)/(b-a), 0.0, 1.0);
}

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

float MsdfTextBorder(vec2 uv) {
  vec3 sample =  1.0 - texture2D(map, uv).rgb;
  float pxSize = min(0.5 / pxRange * ( fwidth(uv.x) * 512. + fwidth(uv.y) * 512.), 0.25);
  float sigDist = median(sample.r, sample.g, sample.b) - 1.0 + 0.5;
  float inside = linearStep(-border - pxSize, - border + pxSize, sigDist);
  float outside = linearStep(border - pxSize, border + pxSize, sigDist);
  return inside - outside;
}

void main() {
  gl_FragColor = vec4(MsdfTextBorder(vUv));
  if (gl_FragColor.a < 0.0001) discard;
}