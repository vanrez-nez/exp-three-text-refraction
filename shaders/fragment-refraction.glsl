precision highp float;

uniform float time;
uniform sampler2D texture;
varying vec2 vUv;

#define ambientAmount 0.1
#define refractionIn 0.225
#define refractionOut 1.0
#define shininess 1540.0

// https://www.shadertoy.com/view/ldfSDN

//Light setup
vec3 light = vec3(-5.0, 5.0, 10.0);

//Object setup
vec4 sph1 = vec4( 0., 0., 0.0, 1.0);


vec2 iSphere(in vec3 ro, in vec3 rd, in vec4 sph)
{
	//sphere at origin has equation |xyz| = r
	//sp |xyz|^2 = r^2.
	//Since |xyz| = ro + t*rd (where t is the parameter to move along the ray),
	//we have ro^2 + 2*ro*rd*t + t^2 - r2. This is a quadratic equation, so:
	vec3 oc = ro - sph.xyz; //distance ray origin - sphere center
	float b = dot(oc, rd);
	float c = dot(oc, oc) - sph.w * sph.w; //sph.w is radius
	float h = b*b - c; //Commonly known as delta. The term a is 1 so is not included.

	vec2 t;
	if(h < 0.0)
		t = vec2(-1.0);
	else  {
		float sqrtH = sqrt(h);
		t.x = (-b - sqrtH); //Again a = 1.
		t.y = (-b + sqrtH);
	}
	return t;
}

//Get sphere normal.
vec3 nSphere(in vec3 pos, in vec4 sph )
{
	return (pos - sph.xyz)/sph.w;
}

float intersect(in vec3 ro, in vec3 rd, out vec2 resT) {
	resT = vec2(1000.0);
	float id = -1.0;
	vec2 tsph = iSphere(ro, rd, sph1); //Intersect with a sphere.

	if(tsph.x > 0.0 || tsph.y > 0.0)
	{
		id = 1.0;
		resT = tsph;
	}
	return id;
}

vec2 SphereRefraction(vec2 uv, out vec3 reflectColor) {
  vec4 ro = vec4(0.0, 0.0, 2.0, 1.0);
  vec3 rd = normalize(vec3(uv * 2.0 - 1.0, -2.));
  vec2 t;
  float id = intersect(ro.xyz, rd, t);
  vec3 col;

  if (id > 0.5 && id < 1.5) {
    vec3 E = normalize(ro.xyz + t.x * rd);
    vec3 N = normalize(nSphere(E, sph1));
    vec3 L = normalize(light);

    reflectColor = vec3(ambientAmount);
		float lambertTerm = dot(N, L);
		if (lambertTerm > 0.0) {
			float w = pow(1.0 - max(0.0, dot(normalize(L+E), E)), 5.0);
			reflectColor += (1.0-w)*pow(max(0.0, dot(reflect(-L, E), E)), shininess);
		}

    vec3 refractionVec = refract(rd, N, refractionIn);

    //light comes out
		float id2 = intersect(E, refractionVec, t);
		if (id2 > 0.5 && id2 < 1.5) {
			E += refractionVec * t.y;
			E = normalize(E);
			N = normalize(nSphere(E, sph1));
			refractionVec = refract(refractionVec, N, refractionOut);
		}

    return refractionVec.xy;
  } else {
    return uv;
  }
}

void main() {
  vec3 reflectColor = vec3(0.);
  vec2 uv = SphereRefraction(vUv, reflectColor);
  vec3 c = texture2D(texture, (uv + vec2(0.0, 0.5) + vec2(mod(time + 0.5, 1.0), 0.0))).rgb;
  c = mix(c, reflectColor, reflectColor);
  gl_FragColor = vec4(c, 1.0);
}