document.addEventListener("DOMContentLoaded", function () {
  const projectHolders = document.querySelectorAll(
    ".project-holder:not(.accepted)"
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
