import * as THREE from 'three';
import FragmentRefraction from '../shaders/fragment-refraction.glsl';
import VertexRefraction from '../shaders/vertex-refraction.glsl';

export default class RefractiveSphere {
  constructor({ map }) {
    this.uniforms = {
      texture: { value: map },
      time: { value: 0 },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      wireframe: false,
      transparent: false,
      side: THREE.DoubleSide,
      fragmentShader: FragmentRefraction,
      vertexShader: VertexRefraction,
    });
    const geo = new THREE.CircleGeometry(200, 50);
    const mesh = new THREE.Mesh(geo, mat);
    this.group = new THREE.Group();
    this.group.add(mesh);
  }

  update(delta) {
    this.uniforms.time.value += delta * 0.1;
  }
}