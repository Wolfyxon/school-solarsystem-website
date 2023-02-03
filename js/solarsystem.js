import * as TH from '../node_modules/three/build/three.module.js'
//i had to modify these modules so they will import the main module properly lmao
import {UnrealBloomPass} from "../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import {RenderPass} from "../node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import {EffectComposer} from "../node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import {TrackballControls} from "../node_modules/three/examples/jsm/controls/TrackballControls.js"


function Vector3(x,y,z){
    return new TH.Vector3(x,y,z);
}

const LAYER_MAIN=0, LAYER_GLOW=1

function texture(path){
    return new TH.TextureLoader().load(path)
}

const textures = {
    "sun":texture("../assets/img/textures/sun.jpeg"),
    "mercury":texture("../assets/img/textures/mercury.jpg"),
    "venus":texture("../assets/img/textures/venus.jpeg"),
    "earth":texture("../assets/img/textures/earth.png")
}

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

    const bloom = new UnrealBloomPass(
        new TH.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
    );
    bloom.threshold = 0;
    bloom.strength = 2;
    bloom.radius = 0;
    effects.setSize(width,height)
    effects.renderToScreen = true
    effects.addPass(renderPass)
    effects.addPass(bloom)

    
    const sun = new TH.Mesh(new TH.IcosahedronGeometry(10, 20),new TH.MeshBasicMaterial({ map: textures.sun }));
    sun.layers.set(LAYER_GLOW)
    scene.add(sun)

    const mercury = new TH.Mesh(new TH.IcosahedronGeometry(1, 20),new TH.MeshBasicMaterial({ map:textures.mercury }))
    mercury.position.set(25,0,0)
    scene.add(mercury)

    const venus = new TH.Mesh(new TH.IcosahedronGeometry(3, 20),new TH.MeshBasicMaterial({ map:textures.venus }))
    venus.position.set(35,0,0)
    scene.add(venus)

    const earth = new TH.Mesh(new TH.IcosahedronGeometry(3, 20),new TH.MeshBasicMaterial({ map:textures.earth }))
    earth.position.set(50,0,0)
    scene.add(earth)

    camera.position.z = 50;
    const controls = new TrackballControls(camera,renderer.domElement)
    controls.target.set( 0, 0, 0 )
    scene.add(camera)
    const animate = () => {
        requestAnimationFrame(animate);
        renderer.clear();
        controls.update();
        camera.layers.set(1);
        effects.render();
        renderer.clearDepth();
        camera.layers.set(0);
        renderer.render(scene, camera);
      };
      
    animate();
})
