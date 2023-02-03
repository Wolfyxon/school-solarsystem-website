import * as TH from '../node_modules/three/build/three.module.js'
//i had to modify these modules so they will import the main module properly lmao
import {UnrealBloomPass} from "../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import {RenderPass} from "../node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import {EffectComposer} from "../node_modules/three/examples/jsm/postprocessing/EffectComposer.js";



function Vector3(x,y,z){
    return new TH.Vector3(x,y,z);
}

const LAYER_MAIN=0, LAYER_GLOW=1

var quality = 50
window.addEventListener('load', () => {
    var width = window.innerWidth*0.95
    var height = window.innerHeight

    const canvas = document.getElementById("solarsys-canvas")
    const scene = new TH.Scene();
    const camera = new TH.PerspectiveCamera(70, (window.innerWidth / window.innerHeight), 0.1, 10000);
    const renderer = new TH.WebGLRenderer({canvas: canvas, antialias: true});
    const renderPass = new RenderPass(scene,camera)
    renderer.autoClear = false
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    renderer.setClearColor(0x000000, 0.0);

    const effects = new EffectComposer(renderer)

    const ambientlight = new TH.AmbientLight(0xffffff, 0.1);
    scene.add(ambientlight);

    const bloom = new UnrealBloomPass(
        new TH.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
    );
    bloom.threshold = 0;
    bloom.strength = 2; //intensity of glow
    bloom.radius = 0;
    effects.setSize(width,height)
    effects.renderToScreen = true
    
    effects.addPass(renderPass)
    effects.addPass(bloom)


    const sun = new TH.Mesh(new TH.IcosahedronGeometry(1, 15),new TH.MeshBasicMaterial({ color: "yellow" }));
    sun.layers.set(LAYER_GLOW)
    sun.position.set(0, 0, 0);
    sun.frustumCulled = true

    scene.add(sun)
    scene.add(camera)

    camera.position.z = 10;


    const animate = () => {
        requestAnimationFrame(animate);
        camera.layers.set(1);
        renderer.render(scene,camera)
        effects.render()
        //bloom.render(renderer,effects.readBuffer,effects.writeBuffer,1,LAYER_GLOW);
      };
      
    animate();
})
