import * as THREE from 'three';
import ThreeApp from "./base/ThreeApp";
import createText from 'three-bmfont-text';
import createMSDFShader from 'three-bmfont-text/shaders/msdf';
import AntonJson from '../assets/Anton-Regular.json';
import AntonImage from '../assets/Anton-Regular.png';
/*
  Article: https://css-tricks.com/techniques-for-rendering-text-with-webgl/
*/

export default class Demo {
  constructor() {
    this.app = new ThreeApp({
      onRenderCallback: this.onRender.bind(this),
      orbitControls: true,
      axesHelper: true,
      skyDome: false,
    });
    this.setup();
    this.app.start();
  }

  async loadTexture(url) {
    return new Promise((resolve) => {
      new THREE.TextureLoader().load(url, (texture) => {
        resolve(texture);
      });
    })
  }

  async setup() {
    const { scene } = this.app;
    const { clientWidth, clientHeight } = this.app.renderer.domElement;

    const texture = await this.loadTexture(AntonImage);
    const geo = createText({
      text: 'PLAYGROUND',
      font: AntonJson,
      align: 'left',
      flipY: texture.flipY,
    });


    const shader = createMSDFShader({
      map: texture,
      transparent: true,
      color: 0xff0000,
    });

    shader.side = THREE.DoubleSide;

    const mat = new THREE.RawShaderMaterial(shader);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = Math.PI;
    const s = clientWidth / geo.layout.width;
    const x = -(geo.layout.width / 2) * s;
    const y = (-geo.layout.height - (geo.layout.descender)) * s;
    mesh.position.set(x, y, 0);
    mesh.scale.multiplyScalar(s);
    const anchor = new THREE.Group();
    anchor.add(mesh);

    this.anchor = anchor;
    scene.add(anchor);
  }

  onRender({ delta, scene, camera, renderer }) {
    renderer.render(scene, camera);
  }
}