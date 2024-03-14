document.addEventListener("DOMContentLoaded", function () {
  const projectHolders = document.querySelectorAll(
    ".content:not(.accepted)"
  );

  projectHolders.forEach(function (projectHolder) {
    projectHolder.addEventListener("click", function () {
      document.getElementById("popup").style.visibility = "visible";
      document.getElementById("popup").style.opacity = "1";
    });
  });

  document.getElementById("close").addEventListener("click", function () {
    document.getElementById("popup").style.visibility = "hidden";
    document.getElementById("popup").style.opacity = "0";
  });
});

// loading page buttons

let next = document.querySelector('.next')
let prev = document.querySelector('.prev')

next.addEventListener('click', function(){
    let items = document.querySelectorAll('.item')
    document.querySelector('.slide').appendChild(items[0])
})

prev.addEventListener('click', function(){
    let items = document.querySelectorAll('.item')
    document.querySelector('.slide').prepend(items[items.length - 1]) 
})

// intro Animation

 let intro = document.querySelector('.intro');
 let logo = document.querySelector('.logo-header');
 let logoSpan = document.querySelectorAll('.logo');

 window.addEventListener('DOMContentLoaded', ()=>{

   setTimeout(()=>{
     logoSpan.forEach((span, idx)=>{
       setTimeout(()=>{
        span.classList.add('active');
      }, (idx + 1) *400)
    });

     setTimeout(()=>{
      logoSpan.forEach((span, idx)=>{
         setTimeout(()=>{
           span.classList.remove('active');
           span.classList.add('active');
         }, (idx + 2) * 500)
       })
     },2000);

       setTimeout(()=>{
         intro.style.top = '-100vh';
            
           },2300)

         })
   })