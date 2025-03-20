const home = async () => {
  const noteListContainerElement = document.querySelector("#noteListContainer");
  if (!noteListContainerElement) {
    console.error("Element #noteListContainer tidak ditemukan!");
    return;
  }

  const noteListElement = noteListContainerElement.querySelector("note-list");
  if (!noteListElement) {
    console.error("Element <note-list> tidak ditemukan!");
    return;
  }

  const showNotes = async () => {
    await displayResult();
  };

  const displayResult = async () => {
    if (typeof noteListElement.render === "function") {
      await noteListElement.render();
    }
  };

  await showNotes();
};

export default home;
