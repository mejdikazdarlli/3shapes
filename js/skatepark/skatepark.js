import { skate3d} from './skateScene.js';
import * as THREE from '../THREE/three.module.js';
import { TWEEN } from '../THREE/tween.module.min.js';
import {OutlinePass} from '../THREE/OutlinePass.js';
import { product3d} from '../productScene.js';
import {productRow} from './productrow.js';
function _(elm){return document.getElementById(elm)}
window.customElements.define("panel-row",productRow);

var productName;
var raycaster, mouse = { x : 0, y : 0 };
raycaster = new THREE.Raycaster()
var intersects = []
var checkArray = []
let isSwiping = false;
const delta = 1.5;
let sogliaMove = 0;
let startX;
let startY;
let firstTouch = true;
let isMobile = false;
let carthover = false;
let cartOpen = false;
const annotation = document.querySelector('.annotation');
let annotationPreviousPosition=new THREE.Vector3();
let productScene = new product3d(_("product-canvas"));
let Valnumber = 0;
let ListRowNames=[];
var boldDollarSign = document.createElement("b");
boldDollarSign.innerHTML = "&#36;";
boldDollarSign.style.fontWeight = "bold";
const ListOfPrices=[]
const info = document.querySelector('.info');
const closeinfo = document.querySelector('.closeInfo')
const infoPanel = document.querySelector('.help___2jUfb');
var distanceTOproduct;



skateScene = new skate3d(_("skatepark"));
skateScene.initScene("skate_park.glb");
skateScene.animate();
skateScene.render = function() {
  TWEEN.update()
  skateScene.renderer.render(skateScene.scene, skateScene.camera);
}
let rect = skateScene.renderer.domElement.getBoundingClientRect();
async function removescene(currentScene){
  _("loading").style.display = "flex";
  _("loadingbtn").style.opacity=1
  _("loadingbtn").style.display = "flex";
  _("skatepark").removeChild(_("skatepark").lastElementChild)
  list_Product.querySelector('.subtotal').innerHTML = "..."
  list_Product.querySelector('.total').innerHTML = "..."
  cartIcon.setAttribute('value', "0");
  while (document.querySelector('.list_container').hasChildNodes()) {
    document.querySelector('.list_container').removeChild(document.querySelector('.list_container').firstChild);
  }
  currentScene.scene.clear()
  while (currentScene.scene.children.length > 0) {currentScene.scene.remove(currentScene.scene.children[0]);}
  currentScene.scene.traverse(function (object) {
    if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        object.material.dispose();
    }
});
currentScene.renderer.dispose();
}
async function NewScene(Newscene,glb){
  Newscene.initScene(glb);
  Newscene.scene.add( plane );
  rect = Newscene.renderer.domElement.getBoundingClientRect();
  outlinePass = new OutlinePass(new THREE.Vector2(rect.width, rect.height), Newscene.scene, Newscene.camera);
  outlinePass.renderToScreen = true;
  Newscene.composer.addPass(Newscene.renderPass);
  Newscene.composer.addPass(outlinePass);
  Newscene.composer.addPass(Newscene.bokehPass);
  const passes = Newscene.composer.passes
  const bokehPass = passes[2];
  let scene = glb.split('.')[0]
  switch (scene) {
    case "skate_park":
      bokehPass.uniforms.aperture.value= 0.0005
      Newscene.renderer.toneMappingExposure = 1.5;
      Newscene.camera.fov = 50
    break;
    case "superMarket":
      bokehPass.uniforms.aperture.value= 0.0001
      Newscene.renderer.toneMappingExposure = 2.5;
      Newscene.camera.fov = 60
    break;
    default:
      bokehPass.uniforms.aperture.value= 0.0005
    break;
  }
  Newscene.composer.render();
}
const tabLinks = document.querySelectorAll('.tab-link');
tabLinks.forEach((link) => {
  link.addEventListener('click', async(event) => {
    event.preventDefault();
    const clickedLink = event.target;
    tabLinks.forEach((tabs) => {
      tabs.classList.remove('current');
    });
    clickedLink.classList.add('current');
    const targetglb = clickedLink.dataset.glb;
   await removescene(skateScene)
   await NewScene(skateScene,targetglb)
   _("loadingbtn").style.opacity=0
   setTimeout(() => {
    _("loadingbtn").style.display = "none";
  }, 1000);

  });
  
});



const geometry = new THREE.PlaneGeometry(0.3,0.3 );
const material = new THREE.MeshBasicMaterial( {map: LoadTextures("marker_b.png", 1), side: THREE.FrontSide,transparent:true,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst:THREE.OneMinusSrcAlphaFactor,
      depthTest: false
} );
const plane = new THREE.Mesh( geometry, material );
plane.rotation.x = -Math.PI / 2;
plane.layers.set(1)
skateScene.scene.add( plane );
function LoadTextures(texture, repeat) {
    var tex = new THREE.TextureLoader().load('img/' + texture);
    tex.encoding = THREE.sRGBEncoding;
    tex.flipY = false;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.x = tex.repeat.y = repeat
    tex.center.set(.5, .5);
    return tex
}
if (
  /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
    navigator.userAgent,
  )
  || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
    navigator.userAgent.substring(0, 4),
  )
) {
  isMobile = true;
}

//pointer event works better than touch event
_("skatepark").style.touchAction = 'none';
  if (isMobile)
  {
    skateScene.orbit.enableZoom = true;
    _("skatepark").onpointerdown = function(event)
    {
        firstTouch = true; 
        startX = event.pageX;
        startY = event.pageY;

        isSwiping = false;
    }
    _("skatepark").onpointermove = function(event)
      {
          if (firstTouch) {
              startX = event.pageX;
              startY = event.pageY;
              firstTouch = false;
          } else {
              const diffX = Math.abs(event.pageX - startX);
              const diffY = Math.abs(event.pageY - startY);
              if (diffX < delta && diffY < delta && sogliaMove > 2) {
              // sogliaMove>2 means 2 frame still when isSwiping is true
              onDocumentTouchClick(event); // for iOS  
              }
          }
          isSwiping = true;
      }
    _("skatepark").onpointerup = function(event)
      {
        const diffX = Math.abs(event.pageX - startX);
        const diffY = Math.abs(event.pageY - startY);
        if (diffX < delta && diffY < delta) {
        onDocumentMouseClick(event); // Android old: is better desktop solution
        }
        firstTouch = true;
      }
  }
  else {
//desktop behavior
skateScene.orbit.enableZoom = false;
    _("skatepark").onpointerdown = (event) => {
        isSwiping = false;
        startX = event.pageX;
        startY = event.pageY;
      }
    _("skatepark").onpointermove = (event)=>{onDocumentMouseMove(event);isSwiping = true;}
    _("skatepark").onpointerup = (event) => {
      const diffX = Math.abs(event.pageX - startX);
      const diffY = Math.abs(event.pageY - startY);
      if (diffX < delta && diffY < delta) {onDocumentMouseClick(event);}
      }
    _("skatepark").addEventListener("contextmenu", e => e.preventDefault());
  }
const tabHelpContents = document.querySelectorAll('.helpItem___2Tob5');
info.addEventListener('pointerdown',async function(e){
  if( e.button == 0 )
  {infoPanel.style.display="block"
  tabHelpContents.forEach((HelpContent) => {
    HelpContent.classList.remove('active___126Ku');
    if(isMobile && HelpContent.classList.contains("help-touche"))
    {
      HelpContent.classList.add('active___126Ku');
    }
    else if(!isMobile && HelpContent.classList.contains("help-mouse"))
    {
      HelpContent.classList.add('active___126Ku');
    }
  });}
});
closeinfo.addEventListener('pointerdown',function(e){if( e.button == 0 ) {infoPanel.style.display="none"}});
function onDocumentTouchClick(event) {
  //event.preventDefault();
  skateScene.scene.updateMatrixWorld();
  const rect = skateScene.renderer.domElement.getBoundingClientRect();
  mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
  mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
  raycaster.setFromCamera(mouse, skateScene.camera);
  intersects = raycaster.intersectObject(skateScene.scene.children);

  if (intersects.length > 0 && firstTouch === false) {
    firstTouch = true; 
    evaluateRaycast("Floor");
  } 
}
var outlinePass = new OutlinePass(new THREE.Vector2(rect.width, rect.height), skateScene.scene, skateScene.camera);
outlinePass.edgeStrength = 2.5; // Change the strength of the outline
outlinePass.edgeGlow = 1; // Change the Glow of the outline
outlinePass.pulsePeriod = 2; // Change the pulsePeriod of the outline
outlinePass.visibleEdgeColor.set('#ffffff'); // Change the color of the visible edges
outlinePass.hiddenEdgeColor.set('#000000'); // Change the color of the hidden edges
outlinePass.renderToScreen = true;
skateScene.composer.addPass(skateScene.renderPass);
skateScene.composer.addPass(outlinePass);
skateScene.composer.addPass(skateScene.bokehPass);
function updateScreenPosition(renderer,camera,vec) {
  const rect = renderer.domElement.getBoundingClientRect();
   const vector = new THREE.Vector3();
    vector.copy(vec)
   vector.project(camera);
   vector.x = Math.round((0.5 + vector.add(new THREE.Vector3(0,0.2,0)).x / 2) * (rect.width / window.devicePixelRatio));
   vector.y = Math.round((0.5 - vector.add(new THREE.Vector3(0,0.2,0)).y / 2) * (rect.height / window.devicePixelRatio));
   annotation.style.top = `${vector.y}px`;
   annotation.style.left = `${vector.x}px`;
}
_("skatepark").addEventListener('pointerdown', OnClickProduct);
let productLoader = document.createElement("div")
productLoader.classList.add("carouseldiv")
productLoader.id="loadingProduct"
let productLoadertx = document.createElement("span")
productLoadertx.id="loadertxt"
let productPlay = document.createElement("a")
productPlay.classList.add("video-play-button")
productPlay.id="play-video"
productLoader.append(productLoadertx,productPlay)

_('badge-Annotation').addEventListener('pointerdown', (e)=> {
  if( e.button == 0 )
  {cartIcon.setAttribute('value', (++value).toString());
  const productName = annotation.querySelector('.Product_Name_hover').innerHTML;
  AddRow(productName)}
},false);
_('badge-Annotation').addEventListener("mouseenter",() => {carthover=true},false);
_('badge-Annotation').addEventListener("mouseleave",() => {carthover=false},false);
async function OnClickProduct(event)
  {
    if( event.button == 0 )
    {
      if(isMobile){distanceTOproduct = 2.5}else{distanceTOproduct = 10000}
      cartgame.style.zIndex = "5"
      skateScene.scene.updateMatrixWorld();
      const rect = skateScene.renderer.domElement.getBoundingClientRect();
      mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
      mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
      raycaster.setFromCamera(mouse, skateScene.camera);
      intersects = raycaster.intersectObjects(skateScene.scene.children, true)
      if (intersects.length > 0 && carthover===false && cartOpen===false)
      {
        
        switch (true) {
          case intersects[0].object.name.includes("MocartProduct") && intersects[0].distance<distanceTOproduct:
            document.querySelector(".card").style.display="flex";
            annotation.style.display="none";
            _('loading').style.display="flex"
            productName = intersects[0].object.name.split('_')[1]
            if(productName )
              {
                while (_("product-canvas").hasChildNodes()){_("product-canvas").removeChild(_("product-canvas").firstChild);}
                _("product-canvas").appendChild(productLoader)
                productScene.initScene(productName);
                productScene.animate();
                updateData()
                cartOpen=true
              }
          break;
        }
      }
      //setTimeout(() => { cartOpen=false}, 100);
      console.log(cartOpen)
    }
  }
function updateData()
{
  fetch("js/skatepark/data.json")
              .then(response => response.json())
              .then(obj => {
                Object.keys(obj).forEach(product => {
                  if( product == productName)
                    {
                      const productData = obj[product][0];
                      Object.entries(productData).forEach(([prop, value]) => {
                        switch (true) {
                          case prop=="Collections":
                            document.querySelector(".collection_").innerHTML = value ;
                          break;
                          case prop=="Product_Name":
                            document.querySelector(".Product_Name").innerHTML = value ;
                          break;
                          case prop=="Price":
                            let dollara = document.createElement("span")
                            dollara.classList.add('fas','fa-dollar-sign')
                            document.querySelector(".Price").innerHTML = value ;
                            document.querySelector(".Price").appendChild(dollara)
                          break;
                          case prop=="FirtsPrice":
                            let dollarb = document.createElement("span")
                            dollarb.classList.add('fas','fa-dollar-sign')
                            document.querySelector(".FirtsPrice").innerHTML = value ;
                            document.querySelector(".FirtsPrice").appendChild(dollarb)
                          break;
                          case prop=="Size":
                            let Size = document.querySelector(".Size")
                            if(Size.childNodes.length>2)
                            {
                              for (let i = Size.childNodes.length-1; i > 0; i--) {
                                if(Size.childNodes[i].tagName  === "LI")
                                {
                                  Size.removeChild(Size.childNodes[i]);
                                }
                              }
                            }
                            for (let e = 0; e < value.length; e++) {
                              let li = document.createElement("li")
                              li.classList.add('bg')
                              li.innerHTML = value[e]
                              Size.appendChild(li)
                                }
                          break;
                          case prop=="Color":
                            let col = document.querySelector(".Color")
                            if(col.childNodes.length>2)
                            {
                              for (let i = col.childNodes.length - 1; i > 0; i--) {
                                if(col.childNodes[i].tagName  === "LI")
                                {
                                  col.removeChild(col.childNodes[i]);
                                }
                              }
                            }
                            for (let e = 0; e < value.length; e++) {
                              let li = document.createElement("li")
                              li.classList.add('col')
                              li.style.backgroundColor = value[e]
                              li.style.cursor="pointer"
                              col.appendChild(li)
                                }
                          break;
                        }
                      });
                    }
                });
              });
}
function updateDataOnhover(productName)
{
  fetch("js/skatepark/data.json")
              .then(response => response.json())
              .then(obj => {
                Object.keys(obj).forEach(product => {
                  if( product == productName)
                    {
                      const productData = obj[product][0];
                      Object.entries(productData).forEach(([prop, value]) => {
                        switch (true) {
                          case prop=="Collections":
                            document.querySelector(".collection_hover").innerHTML = value ;
                          break;
                          case prop=="Product_Name":
                            document.querySelector(".Product_Name_hover").innerHTML = value ;
                          break;
                          case prop=="Price":
                            let dollarc = document.createElement("span")
                            dollarc.classList.add('fas','fa-dollar-sign')
                            document.querySelector(".Price_hover").innerHTML = value ;
                            document.querySelector(".Price_hover").appendChild(dollarc)
                          break;
                        }
                      });
                    }
                });
              });
}
function onDocumentMouseMove(event)
  {
    skateScene.scene.updateMatrixWorld();
    const rect = skateScene.renderer.domElement.getBoundingClientRect();
    mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
    mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
    raycaster.setFromCamera(mouse, skateScene.camera);
    intersects = raycaster.intersectObjects(skateScene.scene.children, true)
    if (intersects.length > 0)
    {
      switch (true) {
        case intersects[0].object.name.includes("Floor"):
          skateScene.container.style.cursor="none";
          plane.position.set(intersects[0].point.x,intersects[0].point.y+0.01,intersects[0].point.z)  
        break;
        case intersects[0].object.name.includes("MocartProduct") && intersects[0].distance<1.5:
          outlinePass.selectedObjects = [intersects[0].object];
          annotation.style.display="flex";
          skateScene.container.style.cursor="pointer";
          annotationPreviousPosition.copy(intersects[0].object.position)
          updateScreenPosition(skateScene.renderer,skateScene.camera,annotationPreviousPosition)
          updateDataOnhover(intersects[0].object.name.split('_')[1])
        break;
        case intersects[0].object.name.includes("MocartProduct"):
          outlinePass.selectedObjects = [intersects[0].object];
          skateScene.container.style.cursor="pointer";
        break;
        default :
        outlinePass.selectedObjects = []
        skateScene.container.style.cursor="default";
        annotation.style.display="none";
        break
      }
    }
  }
function onDocumentMouseClick(event) {
    //event.preventDefault();
    if (!isSwiping) {
    skateScene.scene.updateMatrixWorld();
    const rect = skateScene.renderer.domElement.getBoundingClientRect();
    mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
    mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
    raycaster.setFromCamera(mouse, skateScene.camera);
    intersects = raycaster.intersectObjects(skateScene.scene.children, true)
    if (intersects.length > 0) {evaluateRaycast("Floor");}
    }
    isSwiping = false;
}
async function evaluateRaycast(obj)
{
  var lookDirection = new THREE.Vector3(0,0,0.1);
    if(intersects[0].object.name.includes(obj))
    {
      plane.position.set(intersects[0].point.x,intersects[0].point.y+0.001,intersects[0].point.z)
      new TWEEN.Tween(skateScene.camera.position)
          .to({x:intersects[0].point.x,z:intersects[0].point.z},1000)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start()

      new TWEEN.Tween(skateScene.orbit.target)
          .to({x:intersects[0].point.x+0.001,z:intersects[0].point.z+0.001},1000)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onUpdate(()=>{skateScene.orbit.enabled = false})
          .onComplete(()=>{skateScene.orbit.enabled = true;skateScene.camera.getWorldDirection( lookDirection);
            skateScene.orbit.enableRotate = true;
              skateScene.orbit.target.copy( skateScene.camera.position ).add( lookDirection.multiplyScalar(2))})
           .start()
    }
}

_("play-video").addEventListener('pointerdown', function(e)
{
  if(e.button ==0)
 { _("loadingbtn").style.opacity=0
  setTimeout(() => {
    _("loadingbtn").style.display = "none";
  }, 1000);}
});

_('close').addEventListener('pointerdown', function(e) {
  if(e.button ==0)
  {document.querySelector('.card').style.display = 'none';
  _('loading').style.display = 'none';
  cartOpen=false}
});
const cartIcon = document.querySelector('.cartgame i');
  let value = 0;
document.querySelector(".foot").addEventListener('pointerdown', function(e){
  if(e.button ==0)
 { cartIcon.setAttribute('value', (++value).toString());
  const productName = this.parentNode.querySelector(".Product_Name").innerHTML
  AddRow(productName)}
  })

const cartgame = document.querySelector('.cartgame');
const list_Product = document.querySelector('.list_Product');
const list_container = document.querySelector('.list_container');

cartgame.addEventListener('pointerdown', function(e){if(e.button ==0){list_Product.style.right = "1%"}})
const order = document.querySelector('.order');
order.addEventListener('pointerdown', function(e){if(e.button ==0){list_Product.style.right = "-100%"}})
document.querySelector(".close_list").addEventListener('pointerdown', function(e){if(e.button ==0){list_Product.style.right = "-100%"}})

var basicPrice;
async function Row(productName)
{
    Valnumber = 0;
    const productRow = document.createElement("panel-row");
    const row = productRow.shadowRoot.querySelector('.row');
    list_container.insertBefore(productRow, list_container.firstChild);
    fetch("js/skatepark/data.json")
    .then(response => response.json())
    .then(obj => {
      Object.keys(obj).forEach(product => {
        if (product === productName) {
          row.querySelector('.pic .number').innerHTML=(++Valnumber).toString()
          const productData = obj[product][0];
          Object.entries(productData).forEach(([prop, value]) => {
            switch (true) {
              case prop === "Collections":
                row.querySelector('.discription .collection').innerHTML = value;
                break;
              case prop === "Product_Name":
                row.querySelector('.discription .name').innerHTML = value;
                row.querySelector('.pic .thumb').src = "public/" + value + ".jpg";
                break;
                case prop === "Price":
                  row.querySelector('.price').innerHTML = value;
                  basicPrice = value
                  //SubTotal()
                  break;
                }
              });
        }
      });
    });
    
    row.querySelector('.remove').addEventListener('pointerdown',async function(event) {
      var currentNumber = Number(row.querySelector('.pic .number').innerHTML)
      if(currentNumber>0){
        row.querySelector('.pic .number').innerHTML=(--currentNumber).toString()
        cartIcon.setAttribute('value', (--value).toString());
        var currentPrice = Number(row.querySelector('.price').innerHTML)
        const updatedPrice =currentPrice - basicPrice
        row.querySelector('.price').innerHTML =updatedPrice.toString()
        setTimeout(() => {SubTotal()}, 100);
        setTimeout(() => {Total()}, 150);
      }
      if(currentNumber===0){
        let shadowRoot = event.target.getRootNode().host;
        shadowRoot.parentNode.removeChild(shadowRoot);
      }
      if(list_container.childNodes.length===0)
      {
        setTimeout(() => {
          list_Product.querySelector('.subtotal').innerHTML = "..."
          list_Product.querySelector('.total').innerHTML = "..."
        }, 150);
      }
    })
}
function sumTOTAL(ourArray) {
  let sum = 0;
  for (let i = 0; i < ourArray.length; i += 1) {sum += ourArray[i];}
  return sum;
}

async function SubTotal(){
  for (let i = 0; i < list_container.childNodes.length; i++) {
    const list_container_Elm = list_container.childNodes[i];
    const containerShadowRoot = list_container_Elm.shadowRoot;
    const row = containerShadowRoot.querySelector('.row');
    const Prices = Number(row.querySelector('.price').innerHTML)
    ListOfPrices.push(Prices)
    const result = ListOfPrices. slice(-list_container.childNodes.length);
    list_Product.querySelector('.subtotal').innerHTML =sumTOTAL(result).toString()
  }
}
async function Total(){
  const subtotal = Number(list_Product.querySelector('.subtotal').innerHTML)
  const Shipping = Number(list_Product.querySelector('.Shipping').innerHTML)
  list_Product.querySelector('.total').innerHTML = (subtotal+Shipping).toString()
}

async function AddRow(productName)
{
    let isRowFound = false;
    for (let i = 0; i < list_container.childNodes.length; i++) {
      const list_container_Elm = list_container.childNodes[i];
      const containerShadowRoot = list_container_Elm.shadowRoot;
      const row = containerShadowRoot.querySelector('.row');
      const RowName = row.querySelector('.discription .name').innerHTML;
      if (ListRowNames.includes(productName) && productName=== RowName ) {
        Valnumber = Number(row.querySelector('.pic .number').innerHTML)
        row.querySelector('.pic .number').innerHTML=(++Valnumber).toString()

        var multiplyNumber = Number(row.querySelector('.pic .number').innerHTML)
        const updatedPrice = basicPrice*multiplyNumber

        row.querySelector('.price').innerHTML =updatedPrice.toString()

        isRowFound = true;
        break;
      }
    }
    if (!isRowFound) {
      Row(productName);
      ListRowNames.push(productName)
    }
    setTimeout(() => {SubTotal()}, 100);
    setTimeout(() => {Total()}, 150);
}
const KEYS = {
  LEFT_ARROW: "ArrowLeft",
  UP_ARROW: "ArrowUp",
  RIGHT_ARROW: "ArrowRight",
  DOWN_ARROW: "ArrowDown"
};
const MOVEMENT_SPEED = 0.5;
const TWEEN_DURATION = 500;
const maxY = 1.5;
const minY = 0.4;


_("skatepark").addEventListener('wheel', onScroll);
function onScroll(event) {
  const delta = event.deltaY;
  if (delta > 0) {Move_back()} else {Move_up()}
}

























// let initialDistance = null;
// skateScene.renderer.domElement.addEventListener('touchstart', onTouchStart);
// skateScene.renderer.domElement.addEventListener('touchmove', onTouchMove);
// skateScene.renderer.domElement.addEventListener('touchend', onTouchEnd);
// function onTouchStart(event) {
//   if (event.touches.length >= 2) {
//     const touch1 = event.touches[0];
//     const touch2 = event.touches[1];
//     initialDistance = Math.round(getDistance(touch1, touch2));
//     skateScene.orbit.enabled = false
//     console.log('onTouchStart',skateScene.orbit.enabled,initialDistance)
//   }
// }
// function onTouchMove(event) {
//   if (event.touches.length >= 2) {
//     const touch1 = event.touches[0];
//     const touch2 = event.touches[1];
//     const currentDistance = Math.round(getDistance(touch1, touch2));
//     const delta = currentDistance - initialDistance;

//     if (delta > 0) {
//       Move_up();
//     console.log('Move_up',skateScene.orbit.enabled,currentDistance)

//     } else if (delta < 0) {
//       Move_back();
//       console.log('Move_back',skateScene.orbit.enabled,currentDistance)

//     }
//     initialDistance = currentDistance;
//   }
// }

// function onTouchEnd(event) {
//   initialDistance = null;
//   skateScene.orbit.enabled = true
//   console.log('onTouchEnd',skateScene.orbit.enabled)

// }
// function getDistance(touch1, touch2) {
//   const dx = touch1.clientX - touch2.clientX;
//   const dy = touch1.clientY - touch2.clientY;
//   return Math.sqrt((dx * dx) + (dy * dy));
// }

























function Move_up()
{
  const cameraDirection = new THREE.Vector3(0,0,0.1);
    skateScene.camera.getWorldDirection(cameraDirection);
    cameraDirection.multiplyScalar(MOVEMENT_SPEED);
    const newPosition = skateScene.camera.position.clone().add(cameraDirection);
    newPosition.y = THREE.MathUtils.clamp(newPosition.y, minY, maxY);
    new TWEEN.Tween(skateScene.camera.position)
    .to(newPosition, TWEEN_DURATION)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(()=>{skateScene.orbit.enabled = false})
    .onComplete(()=>{skateScene.orbit.enabled = true;skateScene.camera.getWorldDirection( cameraDirection);
    skateScene.orbit.enableRotate = true;
    skateScene.orbit.target.copy( skateScene.camera.position ).add( cameraDirection.multiplyScalar(2))})
    .start();
}
function Move_back()
{
  const cameraDirectionBackward = new THREE.Vector3(0,0,0.1);
  skateScene.camera.getWorldDirection(cameraDirectionBackward);
  cameraDirectionBackward.multiplyScalar(-1 * MOVEMENT_SPEED);
  const newPosition = skateScene.camera.position.clone().add(cameraDirectionBackward);
  newPosition.y = THREE.MathUtils.clamp(newPosition.y, minY, maxY);
  new TWEEN.Tween(skateScene.camera.position)
  .to(newPosition, TWEEN_DURATION)
  .easing(TWEEN.Easing.Quadratic.InOut)
  .onUpdate(()=>{skateScene.orbit.enabled = false})
    .onComplete(()=>{skateScene.orbit.enabled = true;skateScene.camera.getWorldDirection( cameraDirectionBackward);
    skateScene.orbit.enableRotate = true;
    skateScene.orbit.target.copy( skateScene.camera.position ).add( cameraDirectionBackward.multiplyScalar(2))})
  .start();
}

function Move_Left(){
    const cameraLeft = new THREE.Vector3(-1, 0, 0.1);
    cameraLeft.applyQuaternion(skateScene.camera.quaternion);
    cameraLeft.multiplyScalar(MOVEMENT_SPEED);
    const newPosition = skateScene.camera.position.clone().add(cameraLeft);
    newPosition.y = THREE.MathUtils.clamp(newPosition.y, minY, maxY);
    new TWEEN.Tween(skateScene.camera.position)
    .to(newPosition, TWEEN_DURATION)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(()=>{skateScene.orbit.enabled = false})
    .onComplete(()=>{skateScene.orbit.enabled = true;skateScene.camera.getWorldDirection( cameraLeft);
    skateScene.orbit.enableRotate = true;
    skateScene.orbit.target.copy( skateScene.camera.position ).add( cameraLeft.multiplyScalar(2))})
    .start();
}

function Move_Right()
{
    const cameraRight = new THREE.Vector3(1, 0, 0);
    cameraRight.applyQuaternion(skateScene.camera.quaternion);
    cameraRight.multiplyScalar(MOVEMENT_SPEED);
    const newPosition = skateScene.camera.position.clone().add(cameraRight);
    newPosition.y = THREE.MathUtils.clamp(newPosition.y, minY, maxY);
    new TWEEN.Tween(skateScene.camera.position)
    .to(newPosition, TWEEN_DURATION)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(()=>{skateScene.orbit.enabled = false})
    .onComplete(()=>{skateScene.orbit.enabled = true;skateScene.camera.getWorldDirection( cameraRight);
    skateScene.orbit.enableRotate = true;
    skateScene.orbit.target.copy( skateScene.camera.position ).add( cameraRight.multiplyScalar(2))})
    .start();
}

document.addEventListener("keydown", function(event) {
  switch (event.key) {
    case KEYS.UP_ARROW:
      Move_up()
      event.preventDefault();
      event.stopPropagation();
    break;
    case KEYS.LEFT_ARROW:
      Move_Left()
    break;
    case KEYS.DOWN_ARROW:
      Move_back()
      event.preventDefault();
      event.stopPropagation();
    break;
    case KEYS.RIGHT_ARROW:
      Move_Right()
    break;
  }
});

