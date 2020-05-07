import * as THREE from 'three';
import { Effect } from "postprocessing";
import fragmentShader from '../shaders/fragment-sphere.glsl';

export class SphereRefractionEffect extends Effect {
  constructor({
    position = new THREE.Vector2(),
    size = 1
  } = {}) {

    super('SphereRefractionEffect', fragmentShader, {
      uniforms: new Map([
        ['size', new THREE.Uniform(size)],
        ['position', new THREE.Uniform(position)],
      ])
    });

    //this.active = false;
    //this.size = size;
  }
}