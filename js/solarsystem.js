import * as TH from '../node_modules/three/build/three.module.js'
import { UnrealBloomPass } from "../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { RenderPass } from "../node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { EffectComposer } from "../node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}



function deg2rad(degrees) {
    return degrees * (Math.PI / 180);
}

function Vector3(x, y, z) {
    return new TH.Vector3(x, y, z);
}

function texture(path, shaded = true) {
    const tx = new TH.TextureLoader().load(path)
    if (shaded) {
        tx.mapping = TH.EquirectangularReflectionMapping;
    }
    return tx
}

const textures = {
    "stars": texture("../assets/img/stars.jpg", false), //https://github.com/WaelYasmina/solarsystem/blob/main/src/img/stars.jpg?raw=true
    "sun": texture("../assets/img/textures/sun.jpeg", false),

    "mercury": texture("../assets/img/textures/planets/mercury.jpg"),
    "venus": texture("../assets/img/textures/planets/venus.jpeg"),

    "earth": texture("../assets/img/textures/planets/earth.png"),
    "moon": texture("../assets/img/textures/planets/moon.jpg"),

    "mars": texture("../assets/img/textures/planets/mars.jpg"),
    "jupiter": texture("../assets/img/textures/planets/jupiter.jpg"),

    "saturn": texture("../assets/img/textures/planets/saturn.jpg"),
    "saturn_ring": texture("../assets/img/textures/planets/saturn_ring.png"),

    "uranus": texture("../assets/img/textures/planets/uranus.jpg"),
    "neptune": texture("../assets/img/textures/planets/neptune.jpg")
}

window.addEventListener('load', () => {
    var width = window.innerWidth * 0.95
    var height = window.innerHeight

    const canvas = document.getElementById("solarsys-canvas")
    canvas.style.pointerEvents = "none" //js doesn't see the CSS declared pointerEvents
    const scene = new TH.Scene();
    const camera = new TH.PerspectiveCamera(70, (window.innerWidth / window.innerHeight), 0.1, 10000);

    const renderer = new TH.WebGLRenderer({ canvas: canvas, antialias: true });
    const renderPass = new RenderPass(scene, camera)
    const renderTarget = new TH.WebGLRenderTarget(width, height, {
        type: TH.HalfFloatType,
        format: TH.RGBAFormat,
        encoding: TH.sRGBEncoding,
    })
    renderTarget.samples = 8
    TH.ColorManagement.legacyMode = false
    renderer.autoClear = false
    renderer.outputEncoding = TH.sRGBEncoding
    renderer.autoClear = false
    renderer.setClearColor(0x000000, 0.0);
    renderer.shadowMap.enabled = true
    const ambientLight = new TH.AmbientLight("white", 0.07);
    scene.add(ambientLight)
    const cubeTextureLoader = new TH.CubeTextureLoader();


    const bgScene = new TH.Scene()

    //sun disappears when the background is added :<


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


    const effects = new EffectComposer(renderer, renderTarget)
    const bloom = new UnrealBloomPass(
        new TH.Vector2(window.innerWidth, window.innerHeight),
        1,
        1,
        1
    );

    effects.renderToScreen = true
    effects.addPass(renderPass)
    effects.addPass(bloom)


    const sun = new TH.Mesh(new TH.IcosahedronGeometry(50, 20), new TH.MeshStandardMaterial({
        map: textures.sun, toneMapped: false,
        emissive: 0xFF8700,
        emissiveIntensity: 0.8,
    }
    ));
    sun.material.color.setRGB(50, 10, 10)
    scene.add(sun)
    const sunLight = new TH.PointLight("white", 1, 1000)
    sunLight.shadow.mapSize.width = 1024
    sunLight.shadow.mapSize.height = 1024
    scene.add(sunLight)

    const mercury = new TH.Mesh(new TH.IcosahedronGeometry(1, 20), new TH.MeshLambertMaterial({ map: textures.mercury, color: "white" }))
    mercury.position.set(80, 0, 0)
    mercury.receiveShadow = true
    mercury.castShadow = true
    mercury.geometry.computeVertexNormals()

    const venus = new TH.Mesh(new TH.IcosahedronGeometry(3, 25), new TH.MeshLambertMaterial({ map: textures.venus }))
    venus.position.set(120, 0, 0)

    /////////EARTH ZONE
    const earth = new TH.Mesh(new TH.IcosahedronGeometry(3, 25), new TH.MeshLambertMaterial({ map: textures.earth }))
    earth.position.set(160, 0, 0)

    const earthMoon = new TH.Mesh(new TH.IcosahedronGeometry(0.5, 20), new TH.MeshLambertMaterial({ map: textures.moon }))
    earthMoon.position.set(10, 0, 0)
    ////////////////////////////

    const mars = new TH.Mesh(new TH.IcosahedronGeometry(2, 20), new TH.MeshLambertMaterial({ map: textures.mars }))
    mars.position.set(220, 0, 0)


    //TODO: jupiter moons
    const jupiter = new TH.Mesh(new TH.IcosahedronGeometry(20, 25), new TH.MeshLambertMaterial({ map: textures.jupiter }))
    jupiter.position.set(350, 0, 0)

    //////SATURN ZONE
    const saturn = new TH.Mesh(new TH.IcosahedronGeometry(20, 25), new TH.MeshLambertMaterial({ map: textures.saturn }))
    saturn.position.set(500, 0, 0)
    const saturnRing = new TH.Mesh(new TH.RingGeometry(25, 50, 50), new TH.MeshLambertMaterial({ map: textures.saturn_ring, side: TH.DoubleSide, transparent: true }))
    saturnRing.rotateX(deg2rad(90))
    saturn.add(saturnRing)
    function fixRing() {
        const geometry = saturnRing.geometry
        var uvs = geometry.attributes.uv.array;
        var phiSegments = geometry.parameters.phiSegments || 0;
        var thetaSegments = geometry.parameters.thetaSegments || 0;
        phiSegments = phiSegments !== undefined ? Math.max(1, phiSegments) : 1;
        thetaSegments = thetaSegments !== undefined ? Math.max(3, thetaSegments) : 8;
        for (var c = 0, j = 0; j <= phiSegments; j++) {
            for (var i = 0; i <= thetaSegments; i++) {
                uvs[c++] = i / thetaSegments,
                    uvs[c++] = j / phiSegments;
            }
        }
    }
    fixRing()
    ///////////////

    const uranus = new TH.Mesh(new TH.IcosahedronGeometry(6, 25), new TH.MeshStandardMaterial({ map: textures.uranus }))
    uranus.position.set(750, 0, 0)

    const neptune = new TH.Mesh(new TH.IcosahedronGeometry(3, 25), new TH.MeshLambertMaterial({ map: textures.neptune }))
    neptune.position.set(900, 0, 0)

    camera.position.y = 90
    camera.position.z = 200;
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.rotateSpeed = 0.5
    controls.target.set(0, 0, 0)
    controls.maxDistance = 2000
    controls.enableDamping = true
    controls.dampingFactor = 0.2
    scene.add(camera)

    const bodies = [sun, mercury, venus, earth]


    const asteroidRotor = new TH.Object3D()
    function genAsteroidBelt() {
        const rotor = asteroidRotor
        const asteroids = []
        for (var i = 0; i < 200; i++) {
            const s = randint(1, 5)
            const geometry = new TH.Mesh(new TH.BoxGeometry(s, s, s), new TH.MeshLambertMaterial({ color: "gray" }))
            const asteroid = geometry
            rotor.add(asteroid)
            asteroid.rotateY(deg2rad(randint(0, 360)))
            asteroid.translateX(randint(250, 300))

            asteroid.rotateX(deg2rad(randint(0, 360)))
            asteroid.rotateY(deg2rad(randint(0, 360)))
            asteroid.rotateZ(deg2rad(randint(0, 360)))
            asteroids.push(asteroid)
            bodies.push(asteroid)
        }
        scene.add(rotor)
    }
    genAsteroidBelt()
    
    for (var i = 0; i < bodies.length; i++) {
        const body = bodies[i]
        body.receiveShadow = true
        body.castShadow = true
        body.geometry.computeVertexNormals();
        body.frustumCulled = false;
        body.onAfterRender = function () {
            body.frustumCulled = true;
            body.onAfterRender = function () { };
        };
    }

    var orbits = []
    function addOrbit(body, speed, axisSpeed, center = sun) {
        const rotor = new TH.Object3D()

        rotor.rotateY(Math.floor(Math.random() * 360))
        const centerPos = center.position
        center.add(rotor)
        rotor.add(body)
        rotor.rotateY(Math.floor(Math.random() * 360))

        const innerRad = body.position.x
        const ring = new TH.Mesh(new TH.RingGeometry(innerRad, innerRad + 0.15, 100), new TH.MeshBasicMaterial({ color: "white", side: TH.DoubleSide, transparent: true, opacity: 0.1 }))
        ring.rotateX(deg2rad(90))
        center.add(ring)


        orbits.push({ body: body, speed: speed, axisSpeed, center: center, rotor: rotor })
    }
    addOrbit(mercury, 0.01, 0.01)
    addOrbit(venus, 0.007, 0.007)
    addOrbit(earth, 0.004, 0.013)
    addOrbit(earthMoon, 0.002, 0, earth)
    addOrbit(mars, 0.003, 0.015)
    addOrbit(jupiter, 0.001, 0.01)
    addOrbit(saturn, 0.0001, 0.009)
    addOrbit(uranus, 0.00015, 0.01)
    addOrbit(neptune, 0.00016, 0.02)



    const canvPar = canvas.parentNode
    function updateSize() {
        width = window.innerWidth * 0.95
        height = height = window.innerHeight
        camera.aspect = (window.innerWidth / window.innerHeight)
        if (canvPar) {
            canvPar.style.width = width.toString() + "px"
            canvPar.style.height = height.toString() + "px"
        }
        renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
        renderer.setSize(width, height)
        effects.setSize(width, height)
        bloom.setSize(width, height)
        renderTarget.setSize(width, height)
    }
    updateSize()

    window.addEventListener("resize", updateSize)
    renderer.compile(scene, camera)
    //camera.layers.enableAll()
    const animate = () => {
        requestAnimationFrame(animate);
        sun.rotateY(0.001)
        asteroidRotor.rotateY(0.0005)
        for (var i = 0; i < orbits.length; i++) {
            const orbit = orbits[i]
            const body = orbit.body
            const rotor = orbit.rotor
            rotor.rotateY(orbit.speed)
            body.rotateY(orbit.axisSpeed)
        }


        controls.update();
        effects.render()
        renderer.render(scene, camera);

    };

    animate();
})
