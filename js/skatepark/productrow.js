const template = document.createElement('template');
template.innerHTML = `
<style>
.row{
    display: flex;
    position: relative;
    width: 100%;
    height: fit-content;
    color: var(--bg-color);
    align-items: center;
    justify-content: flex-start;
    margin: 5px 0px;
  }
.row .pic{
    width: fit-content;
    height: fit-content;
    display: flex;
    justify-content: flex-end;
    margin: 0px 5px;
  }
.row .pic img{
    width: 65px;
    height: auto;
    position: relative;
  }
.row .pic span{
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: white;
    border: solid var(--primary-color) 1px;
    color: var(--bg-color);
    font-size: small;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    transform: translate(50%,-50%);
  }
.row  .discription
  {
    width: fit-content;
    height: fit-content;
    display: flex;
    flex-direction: column;
    padding-left: 10%;
  }
.row  .discription h3{
    font-size: 16px;
    margin: 0;
  }
.row  .discription h2{
    font-size: 10px;
    margin: 0;
  }
.row  .price
{
  width: fit-content;
  height: fit-content;
  display: flex;
  font-size: 18px;
  padding-left: 10%;
  font-weight: 500;
}
.row  svg
{
  position:relative;
  top: 0%;
  left: 0%;
}
.row  svg:hover
{
  cursor: pointer;
  fill: red;
}
.price_Block{
  display: flex;
  padding-left: 12%;
}
.dollarsign{
  padding-top: 25px;
  font-size: 12px
}
</style>
<div class="row">
    <svg class="remove" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28px" height="28px">
    <path d="M 15 4 C 14.476563 4 13.941406 4.183594 13.5625 4.5625 C 13.183594 4.941406 13 5.476563 13 6 L 13 7 L 7 7 L 7 9 L 8 9 L 8 25 C 8 26.644531 9.355469 28 11 28 L 23 28 C 24.644531 28 26 26.644531 26 25 L 26 9 L 27 9 L 27 7 L 21 7 L 21 6 C 21 5.476563 20.816406 4.941406 20.4375 4.5625 C 20.058594 4.183594 19.523438 4 19 4 Z M 15 6 L 19 6 L 19 7 L 15 7 Z M 10 9 L 24 9 L 24 25 C 24 25.554688 23.554688 26 23 26 L 11 26 C 10.445313 26 10 25.554688 10 25 Z M 12 12 L 12 23 L 14 23 L 14 12 Z M 16 12 L 16 23 L 18 23 L 18 12 Z M 20 12 L 20 23 L 22 23 L 22 12 Z"/>
    </svg>
    <div class="pic">
        <img class="thumb" src="public/shoes-1.jpg" alt="">
        <span class="number">0</span>
    </div>
    <div class="discription">
      <h3 class="name"></h3>
      <h2 class="collection"></h2>
    </div>
    <div class="price_Block">
    <h4 class="price">111</h4>
    <b class="dollarsign">&#36;</b>
    </div>
</div>
`
export class productRow extends HTMLElement{
    constructor()
    {
        super();
        this.attachShadow({mode:'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
}



