import * as THREE from '../THREE/three.module.js';
import { OrbitControls } from '../THREE/OrbitControls.js';
import { RGBELoader } from '../THREE/RGBELoader.js';
import { GLTFLoader } from '../THREE/GLTFLoader.js';
import { DRACOLoader } from '../THREE/DRACOLoader.js';
import { EffectComposer } from '../THREE/EffectComposer.js';
import { BokehPass } from '../THREE/BokehPass.js';
import { RenderPass } from '../THREE/RenderPass.js';

function _(elm) { return document.getElementById(elm) }
export class skate3d {
    constructor(container, camera, scene, orbit, renderer,fpControls,cameraBoundingSphere,wallBoundingBoxes) {
        this.container = container;
        this.camera = camera;
        this.scene = scene;
        this.orbit = orbit;
        this.renderer = renderer;
        this.composer = null;
        this.renderPass=null;
        this.bokehPass=null;
        this.fpControls = fpControls;
        this.cameraBoundingSphere=cameraBoundingSphere;
        this.wallBoundingBoxes = [];
    }
    async initScene(model) {
        this.scene = new THREE.Scene();
        this.scene.name = "skatepark-scene" 
        document.querySelector(".carousel").appendChild(this.container);

        const fov =50;
        const near = 0.01;
        const far = 100;
        this.camera = new THREE.PerspectiveCamera(fov, this.container.offsetWidth / this.container.offsetHeight, near, far);
        this.camera.name = "skatepark-camera"
        this.camera.position.set(15,.1,3)
        this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera.updateProjectionMatrix();
        // Create a bounding sphere for the camera
        this.cameraBoundingSphere = new THREE.Sphere();


        this.scene.add(this.camera);
        this.camera.layers.enable(0)
        this.camera.layers.enable(1)
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true});
        // this.fpControls = new FirstPersonControls(this.camera, this.renderer.domElement)
        // this.fpControls.lookVertical = true
        // this.fpControls.constrainVertical = true;
        // this.fpControls.verticalMin = Math.PI/1.7;
        // this.fpControls.verticalMax = Math.PI/2.3;
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.minPolarAngle = Math.PI/2.8;
        this.orbit.maxPolarAngle = Math.PI/2.02;
        this.orbit.target.set(0,.1,12);
        this.orbit.enableRotate = false;
        this.orbit.enableZoom = false;
        // this.orbit.minDistance=20;
        // this.orbit.maxDistance=50;
        this.orbit.update();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.container.appendChild(this.renderer.domElement);
        this.renderer.toneMappingExposure = 1.5;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.physicallyCorrectLights = true;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;


       this.composer = new EffectComposer(this.renderer);
       this.renderPass = new RenderPass(this.scene, this.camera);
       this.bokehPass = new BokehPass(this.scene, this.camera, {
         focus: 1, // Distance to focus point
         aperture: 0.0005, // Camera aperture size
         maxblur: 0.15 // Maximum blur radius
        });
       
       await LoadModel(model, this.scene,this.renderer,this.camera,this.wallBoundingBoxes) 

       const light = new THREE.AmbientLight( 0x404040,2 ); // soft white light
        this.scene.add( light );
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        
        
        const vector = new THREE.Vector3(0, 1, 0); 
        const canvas =this.renderer.domElement;
        vector.project(this.camera);
        vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio));
        vector.y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio));
        const annotation = document.querySelector('.annotation');
        annotation.style.top = `${vector.y}px`;
        annotation.style.left = `${vector.x}px`;
    }

    
    animate() {
        delta += clock.getDelta();
        requestAnimationFrame(this.animate.bind(this));
        //this.fpControls.update(0.01)
        if (delta > interval) {
            this.render();
            delta = delta % interval;
            this.composer.render();
            updateCameraBoundingSphere(this.cameraBoundingSphere,this.camera)
           
        }
        
    }
    onWindowResize() {
        this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.render();
    }
    
    render() {
       this.renderer.render(this.scene, this.camera);
       updateScreenPosition(this.renderer,this.camera)
         }
}
function updateScreenPosition(renderer,camera) {
   const vector = new THREE.Vector3(20, 0, 0);
   const canvas = renderer.domElement;
   vector.project(camera);
   vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio));
   vector.y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio));
   const annotation = document.querySelector('.annotation');
   annotation.style.top = `${vector.y}px`;
   annotation.style.left = `${vector.x}px`;
}
// Update cameraBoundingSphere with camera position
function updateCameraBoundingSphere(cameraBoundingSphere,camera) {
  cameraBoundingSphere.center.copy(camera.position);
  cameraBoundingSphere.radius = .0001; // Change the radius to fit your camera size
}
let interval = 1 / 25, delta = 0, clock = new THREE.Clock();
var loader = new GLTFLoader();
var loaderDRACO = new DRACOLoader();
loaderDRACO.setDecoderPath('./js/decoder/');
loader.setDRACOLoader(loaderDRACO);

 async function LoadModel(model, _thisScene,_thisrenderer,_thiscamera,wallBoundingBoxes) {
    return new Promise((resolve, reject) => {
        loader.load('asset/' + model, async function (object) {
            var SceneGLB = object.scene;
            SceneGLB.position.set(0,0,0)
            _thisScene.add(SceneGLB)
            // Extract wall objects from scene

             SceneGLB.traverse(function async (child) {
                if (child.isMesh) {
                  if(child.name.includes("Shield"))
                  {
                    child.visible = false
                    child.material.side=THREE.DoubleSide
                    const box = new THREE.Box3().setFromObject(child)
                    wallBoundingBoxes.push(box);
                  }
                }
            })
            
            await loadEnvironmentHDR(_thisrenderer,_thisScene, 'urban_courtyard_02_1k.hdr')
            resolve()
        },
        xhr => {
          console.log(`Load Model ${Math.floor((xhr.loaded / xhr.total) * 100)}% loaded`);
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
              //scene.background = envMap_hdr.texture;
              _("loading").style.display = "none";
              resolve()
            console.log("end Loading .... "+hdr);
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



