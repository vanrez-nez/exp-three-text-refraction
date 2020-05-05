import * as THREE from 'three';
import ThreeApp from "./base/ThreeApp";
import MSDFText from './msdf-text';

export default class Demo {
  constructor() {
    this.app = new ThreeApp({
      onRenderCallback: this.onRender.bind(this),
      orbitControls: true,
      axesHelper: false,
      skyDome: false,
    });
    this.setup();
    this.app.start();
  }



  async setup() {
    const { scene } = this.app;
    const { clientWidth } = this.app.renderer.domElement;

    const msdfText =  new MSDFText('PLAYGROUND');
    await msdfText.load();
    const { mesh, group, geometry: geo } = msdfText;
    const s = clientWidth / geo.layout.width;
    const x = -(geo.layout.width / 2) * s;
    const y = (-geo.layout.height - (geo.layout.descender)) * s;
    mesh.position.set(x, y, 0);
    mesh.scale.multiplyScalar(s);
    scene.add(group);
  }

  onRender({ delta, scene, camera, renderer }) {
    renderer.render(scene, camera);
  }
}