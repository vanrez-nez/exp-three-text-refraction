import * as THREE from 'three';
import ThreeApp from "./base/ThreeApp";
import MSDFText from './msdf-text';
import RefractiveSphere from './refractive-sphere';
import SphereImage from '../assets/type_test.png';

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

    const msdfText = new MSDFText('PLAYGROUND');
    await msdfText.load();
    const { mesh, group, geometry: geo } = msdfText;
    const s = clientWidth / geo.layout.width;
    const x = -(geo.layout.width / 2) * s;
    const y = (-geo.layout.height - (geo.layout.descender)) * s;
    mesh.position.set(x, y, 0);
    mesh.scale.multiplyScalar(s);
    scene.add(group);
    const sphere = new RefractiveSphere({
      map: new THREE.TextureLoader().load(SphereImage),
    });
    this.sphere = sphere;
    sphere.group.position.z = 1;
    scene.add(sphere.group);
  }

  onRender({ delta, scene, camera, renderer }) {
    if (this.sphere) {
      this.sphere.update(delta);
    }
    renderer.render(scene, camera);
  }
}