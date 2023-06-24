function _(elm){return document.getElementById(elm)}
window.addEventListener("scroll",function(){
  var nav = document.querySelector("nav");
  nav.classList.toggle("sticky",window.scrollY > 0)
})
var cursor = document.getElementById("cursor");
document.body.addEventListener("mousemove", function(e) {
  cursor.style.left = e.clientX + "px",
    cursor.style.top = e.clientY + "px";
    cursor.display = "block"
});
window.Menu=()=>{
  const hamFirst = document.getElementById("first")
  const hamsecond = document.getElementById("second")
  const hamthird = document.getElementById("third") 
  const nav = document.querySelector("nav");
    nav.classList.toggle("stickyy")
    var x = document.getElementById("list");
    if (x.className === "hide") {
        x.className += " show";
        hamsecond.style.display="none"
        hamFirst.classList.add('first-ham')
        hamthird.classList.add('third-ham')
    } else {
        x.className = "hide";
        hamsecond.style.display="flex"
        hamFirst.classList.remove('first-ham')
        hamthird.classList.remove('third-ham')
    }
}
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 10,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation:{
        prevEl: ".swiper-button-prev",
        nextEl: ".swiper-button-next",
    },
  breakpoints: {
    640: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 50,
    },
  },
  navigation: {
  nextEl: '.swiper-button-next',
  prevEl: '.swiper-button-prev',
},
});



