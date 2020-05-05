import * as THREE from 'three';

import createText from 'three-bmfont-text';
import createMSDFShader from 'three-bmfont-text/shaders/msdf';
import FontJson from '../assets/JosefinSans-Bold.json';
import FontImage from '../assets/JosefinSans-Bold.png';

import FragmentMSDF from '../shaders/fragment-msdf.glsl';
import VertexMSDF from '../shaders/vertex-msdf.glsl';

/*
  Article: https://css-tricks.com/techniques-for-rendering-text-with-webgl/
*/

export default class MSDFText {
  constructor(text) {
    this.text = text;
    this.group = new THREE.Group();
  }

  createShader({ color, map, opacity }) {
    return new THREE.RawShaderMaterial({
      uniforms: {
        opacity: { value: opacity },
        border: { value: 0.1 },
        map: { value: map },
        color: { value: new THREE.Color(color) },
      },
      transparent: true,
      fragmentShader: FragmentMSDF,
      vertexShader: VertexMSDF,
    });
  }

  async load() {
    const texture = await this.loadTexture(FontImage);
    this.geometry = createText({
      text: this.text,
      font: FontJson,
      align: 'left',
      flipY: texture.flipY,
      //letterSpacing: 10,
    });

    const shaderMaterial = this.createShader({
      map: texture,
      color: 0xffffff,
      opacity: 1,
    });

    const mesh = new THREE.Mesh(this.geometry, shaderMaterial);
    mesh.rotation.x = Math.PI;
    this.mesh = mesh;
    this.group.add(mesh);
  }

  async loadTexture(url) {
    return new Promise((resolve) => {
      new THREE.TextureLoader().load(url, (texture) => {
        resolve(texture);
      });
    })
  }
}