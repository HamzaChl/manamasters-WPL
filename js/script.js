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
