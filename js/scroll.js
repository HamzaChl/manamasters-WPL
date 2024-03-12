const lenis = new Lenis();

lenis.on("scroll", (e) => {});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const scrolldown = document.getElementById("scroll-down");

scrolldown.addEventListener("click", () => {
  document.documentElement.style.scrollBehavior = "smooth";
  setTimeout(() => {
    document.documentElement.style.scrollBehavior = "auto";
  }, 200);
});
