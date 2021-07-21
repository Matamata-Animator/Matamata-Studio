let controller = document.getElementById("advanced-dropdown-controller");

(async () => {
  if (controller) {
    controller.onclick = () => {
      let dropdown = document.getElementById("advanced-dropdown");
      let state = dropdown?.style.display;
      if (state == "" || state == "none") {
        controller!.innerText = "Advanced ▼";
        dropdown!.style.display = "inherit";
      } else {
        controller!.innerText = "Advanced ▶";
        dropdown!.style.display = "none";
      }
    };
  }
})();
