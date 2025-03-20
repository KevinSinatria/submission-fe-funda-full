import "./styles/style.css";
import "./script/components/index.js";

import home from "./script/view/home.js";

document.addEventListener("DOMContentLoaded", () => {
  home();

  const toggleButton = document.getElementById("toggleArchiveBtn");

  toggleButton.addEventListener("click", () => {
    document.dispatchEvent(new Event("toggleArchiveView"));

    if (toggleButton.textContent === "Lihat Arsip") {
      toggleButton.textContent = "Lihat Catatan";
    } else {
      toggleButton.textContent = "Lihat Arsip";
    }
  });
});
