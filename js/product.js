import { product3d} from './productScene.js';
import {productName} from './skatepark/skatepark.js'
function _(elm){return document.getElementById(elm)}
 productScene = new product3d(_("product-canvas"));
 productScene.initScene();
productScene.animate();
if(productName)
{
    productScene = new product3d(_("product-canvas"));
    productScene.initScene();
    productScene.animate();
    console.log(productName)
}