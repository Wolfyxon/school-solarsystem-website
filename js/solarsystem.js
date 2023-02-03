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

function texture(path,shaded=true){
    const tx = new TH.TextureLoader().load(path)
    if(shaded){
        tx.mapping = TH.EquirectangularReflectionMapping;
    }
    return tx
}

const textures = {
    "stars":texture("../assets/img/stars.jpg",false), //https://github.com/WaelYasmina/solarsystem/blob/main/src/img/stars.jpg?raw=true
    "sun":texture("../assets/img/textures/sun.jpeg",false),

    "mercury":texture("../assets/img/textures/mercury.jpg"),
    "venus":texture("../assets/img/textures/venus.jpeg"),
    "earth":texture("../assets/img/textures/earth.png"),
    "moon":texture("../assets/img/textures/moon.jpg")
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
    renderer.shadowMap.enabled = true
    //const ambientLight = new TH.AmbientLight( "white",1 );
    //scene.add(ambientLight)
    const cubeTextureLoader = new TH.CubeTextureLoader();

    /*
    const starsTxt = "../assets/img/stars.jpg"
        scene.background = cubeTextureLoader.load([
            starsTxt,
            starsTxt,
            starsTxt,
            starsTxt,
            starsTxt,
            starsTxt
        ]);
     */

    const effects = new EffectComposer(renderer)
    const finalComposer = new EffectComposer( renderer );
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

    const sun = new TH.Mesh(new TH.IcosahedronGeometry(50, 20),new TH.MeshBasicMaterial({ map: textures.sun }));
    sun.layers.set(LAYER_GLOW)
    scene.add(sun)
    const sunLight = new TH.PointLight("white",20,300)
    sunLight.shadow.mapSize.width = 1024
    sunLight.shadow.mapSize.height = 1024
    scene.add(sunLight)

    const mercury = new TH.Mesh(new TH.IcosahedronGeometry(1, 20),new TH.MeshLambertMaterial({ map:textures.mercury}))
    mercury.position.set(80,0,0)
    mercury.receiveShadow = true
    mercury.castShadow = true
    mercury.geometry.computeVertexNormals()

    const venus = new TH.Mesh(new TH.IcosahedronGeometry(3, 25),new TH.MeshLambertMaterial({ map:textures.venus }))
    venus.position.set(120,0,0)

    /////////////////////////////////////////////
    const earth = new TH.Mesh(new TH.IcosahedronGeometry(3, 25),new TH.MeshLambertMaterial({ map:textures.earth }))
    earth.position.set(160,0,0)

    const earthMoon = new TH.Mesh(new TH.IcosahedronGeometry(0.5, 20),new TH.MeshLambertMaterial({ map:textures.moon }))
    earthMoon.position.set(10,0,0)
    ////////////////////////////

    camera.position.z = 200;
    const controls = new TrackballControls(camera,renderer.domElement)
    controls.target.set( 0, 0, 0 )
    scene.add(camera)

    const bodies = [sun, mercury,venus,earth]
    sun.castShadow = true
    for(var i=0;i<bodies.length;i++){
        const body = bodies[i]
        body.receiveShadow = true
        body.castShadow = true
        body.geometry.computeVertexNormals();
    }

    var orbits = []
    function addOrbit(body,speed,axisSpeed,center=sun){
        const rotor = new TH.Object3D()
        const centerPos = center.position
        //rotor.position.set(centerPos.x,centerPos.y,centerPos.z)
        center.add(rotor)
        rotor.add(body)
        orbits.push({body:body,speed:speed,axisSpeed,center:center,rotor:rotor})
    }
    addOrbit(mercury,0.01,0.01)
    addOrbit(venus,0.007,0.007)
    addOrbit(earth,0.004,0.013)
    addOrbit(earthMoon,0.007,0,earth)
    console.log(orbits)


    //TODO: fix sun not ocluding planets
    const animate = () => {
        requestAnimationFrame(animate);

        sun.rotateY(0.001)
        for(var i=0;i<orbits.length;i++){
            const orbit = orbits[i]
            const body = orbit.body
            const rotor = orbit.rotor
            rotor.rotateY(orbit.speed)
            body.rotateY(orbit.axisSpeed)
        }
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
