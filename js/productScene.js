import * as THREE from './THREE/three.module.js';
import { OrbitControls } from './THREE/OrbitControls.js';
import { RGBELoader } from './THREE/RGBELoader.js';
import { GLTFLoader } from './THREE/GLTFLoader.js';
import { DRACOLoader } from './THREE/DRACOLoader.js';

function _(elm) { return document.getElementById(elm) }
export class product3d {
    constructor(container, camera, scene, orbit, renderer) {
        this.container = container;
        this.camera = camera;
        this.scene = scene;
        this.orbit = orbit;
        this.renderer = renderer;
    }
    async initScene(product) {
      _("loadingProduct").style.display = "flex";
        this.scene = new THREE.Scene();
        this.scene.name = "product-scene" 
        document.querySelector(".card").appendChild(this.container);
////////////renderer setting
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.container.appendChild(this.renderer.domElement);
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.physicallyCorrectLights = false;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
////////////camera setting
        const fov =50;
        const near = 0.1;
        const far = 10;
        this.camera = new THREE.PerspectiveCamera(fov, this.container.offsetWidth / this.container.offsetHeight, near, far);
        this.camera.name = "product-camera"
        this.camera.position.set(1,0.15,2)
        this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.scene.add(this.camera);
        this.camera.layers.enable(0)
        this.camera.layers.enable(1)
////////////orbit setting
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.minPolarAngle = Math.PI/2.8;
        this.orbit.maxPolarAngle = Math.PI/2.02;
        this.orbit.target.set(0,0,0);
        this.orbit.enableRotate = true;
        this.orbit.enableZoom = false;
        this.orbit.enablePan = false;
        this.orbit.autoRotate = true;
        this.orbit.autoRotateSpeed = 3
        // this.orbit.minDistance=20;
        // this.orbit.maxDistance=50;
        this.orbit.update();
        await loadEnvironmentHDR(this.renderer,this.scene, 'urban_courtyard_02_1k.hdr')
        await LoadModel(product, this.scene,this.renderer) 
       const light = new THREE.AmbientLight( 0x404040,1 ); // soft white light
        this.scene.add( light );
        window.addEventListener('resize', this.onWindowResize.bind(this), false);                
    }

    animate() {
        delta += clock.getDelta();
        requestAnimationFrame(this.animate.bind(this));
        if (delta > interval) {
            this.render();
            this.orbit.update();
            delta = delta % interval;
        }
    }
    onWindowResize() {
        this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.render();
    }
    
    render() {
      this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
       this.renderer.render(this.scene, this.camera);
         }
}


let interval = 1 / 25, delta = 0, clock = new THREE.Clock();
var loader = new GLTFLoader();
var loaderDRACO = new DRACOLoader();
loaderDRACO.setDecoderPath('./js/decoder/');
loader.setDRACOLoader(loaderDRACO);

 async function LoadModel(model, _thisScene,_thisrenderer) {
    return new Promise((resolve, reject) => {
        loader.load('asset/product/' + model+'.glb', async function (object) {
            var SceneGLB = object.scene;
            SceneGLB.position.set(0,0,0)
            SceneGLB.scale.set(5,5,5)
            _thisScene.add(SceneGLB)
            //SceneGLB.traverse(function (child) {})
            _("loadingProduct").style.display = "none";
            //await loadEnvironmentHDR(_thisrenderer,_thisScene, 'urban_courtyard_02_1k.hdr')
            resolve()
        },
        xhr => {
          console.log(`Load product---------------------- ${Math.floor((xhr.loaded / xhr.total) * 100)}% loaded`);
          _("loadertxt").innerText = Math.floor((xhr.loaded / xhr.total) * 100) + "%"
        },
        err => {
          reject(new Error(err));
        }
        )
    })
}

async function loadEnvironmentHDR(renderer, scene, hdr) {
    return new Promise((resolve, reject) => {
        var loaderhdr = new RGBELoader().setDataType(THREE.UnsignedByteType).setPath('./img/env/').load(
          hdr,async function (texture) {
              const pmremGenerator = new THREE.PMREMGenerator(renderer);
              var envMap_hdr = pmremGenerator.fromEquirectangular(loaderhdr);
              pmremGenerator.compileEquirectangularShader();
              texture.dispose();
              pmremGenerator.dispose();
              scene.environment = envMap_hdr.texture;
              _("loadingProduct").style.display = "none";
              resolve()
            console.log("end Loading product hdri ............................... "+hdr);
          },
          xhr => {
            _("loadertxt").innerText =Math.floor((xhr.loaded / xhr.total) * 100)+ "%"
          },
          err => {
            reject(new Error(err));
          }
        );
      });
}



