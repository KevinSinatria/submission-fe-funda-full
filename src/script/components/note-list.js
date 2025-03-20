import NotesApi from "../data/remote/notes-api";
import anime from "animejs";

class NoteList extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
    this._showArchived = false;
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
      }

      .list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 10px;
        align-items: center;
        max-width: 100%;
        width: 100%;
      }
      
      .empty-text {
        font-size: 1.5em;
        color: red;
        font-weight: bolder;
      }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    document.addEventListener("noteUpdated", () => this.render());
    document.addEventListener("noteAdded", () => this.render());
    document.addEventListener("toggleArchiveView", () => {
      this._showArchived = !this._showArchived; // Toggle tampilan
      console.log("Menampilkan:", this._showArchived ? "Arsip" : "Aktif");
      this.render();
    });
  }

  async render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);

    const loading = document.createElement("loading-indicator");
    this._shadowRoot.appendChild(loading);
    loading.show();

    const container = document.createElement("div");
    container.classList.add("list");

    try {
      let notes;
      if (this._showArchived) {
        notes = await NotesApi.getArchived();
      } else {
        notes = await NotesApi.getAll();
      }

      if (notes.length === 0) {
        container.innerHTML = "<p class='empty-text'>Tidak ada catatan.</p>";
      } else {
        const sortedNotes = notes
          .slice()
          .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

        sortedNotes.forEach((note) => {
          const noteItem = document.createElement("note-item");
          noteItem.note = note;
          container.appendChild(noteItem);

          anime({
            targets: noteItem,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 500,
            easing: "easeOutExpo",
            delay: 300,
          });
        });
      }
    } catch (error) {
      container.innerHTML = `<p>${error.message}</p>`;
      console.error("Failed to fetch notes:", error);
    } finally {
      setTimeout(() => {
        loading.hide();
      }, 500);
    }

    this._shadowRoot.appendChild(container);
  }
}

customElements.define("note-list", NoteList);
