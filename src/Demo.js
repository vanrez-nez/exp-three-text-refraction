import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import * as THREE from 'three';
import ThreeApp from "./base/ThreeApp";
import MSDFText from './msdf-text';
import { SphereRefractionEffect } from "./sphere-refraction-effect";
//import RefractiveSphere from './refractive-sphere';
//import SphereImage from '../assets/type_test.png';

export default class Demo {
  constructor() {
    this.app = new ThreeApp({
      onRenderCallback: this.onRender.bind(this),
      onResizeCallback: this.onResize.bind(this),
      orbitControls: true,
      axesHelper: false,
      skyDome: false,
    });
    this.setup();
    this.app.start();
  }

  async setup() {
    const { scene, camera, renderer } = this.app;
    const { clientWidth } = this.app.renderer.domElement;

    const composer = new EffectComposer(renderer, {
    });
    composer.addPass(new RenderPass(scene, camera));

    const bloomEffect = new BloomEffect({
      intensity: 2
    });

    const sphereEffect = new SphereRefractionEffect();
    // composer.addPass(new EffectPass(camera, bloomEffect));
    composer.addPass(new EffectPass(camera, sphereEffect));

    this.composer = composer;

    const msdfText = new MSDFText('PLAYGROUND');
    await msdfText.load();
    const { mesh, group, geometry: geo } = msdfText;
    const s = clientWidth / geo.layout.width;
    const x = -(geo.layout.width / 2) * s;
    const y = (-geo.layout.height - (geo.layout.descender)) * s;
    mesh.position.set(x, y, 0);
    mesh.scale.multiplyScalar(s);
    scene.add(group);
  }

  onResize(width, height) {
    if (this.composer) {
      this.composer.setSize(width, height, false);
    }
  }

  onRender({ delta }) {
    this.composer.render(delta);
  }
}