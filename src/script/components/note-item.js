import NotesApi from "../data/remote/notes-api";

class NoteItem extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _note = {
    id: null,
    title: null,
    body: null,
    createdAt: null,
    archived: false,
  };

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
    this._updateStyle();
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        margin: 10px 0;
      }

      .btn-archive {
        font-size: .9em;
        background-color: white;
        padding: 0 5px;
        border-radius: 20px;
        transition: 0.2s;
      }
      .btn-archive:hover {
        scale: 1.1;
      }
      .btn-archive:active {
        background-color: gray;
        scale: 1;
      }

      .card {
        background: white;
        border: 1px solid black;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.5);
      }

      .note-title {
        font-size: 1.4em;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .note-body {
        font-size: 1em;
        color: #555;
        margin-bottom: 10px;
      }

      .note-footer {
        display: flex;
        justify-content: space-between;
        font-size: 0.9em;
        color: gray;
      }

      .archived {
        color: red;
        font-weight: bold;
      }
      .btn-delete {
        font-size: 1.5em;
        background-color: white;
        padding: 0 5px;
        border-radius: 20px;
        transition: 0.2s;
      }
      .btn-delete:hover {
        scale: 1.3;
      }
      .btn-delete:active {
        background-color: gray;
        scale: 1;
      }
    `;
  }

  async _toggleArchive() {
    try {
      if (this.note.archived) {
        await NotesApi.unarchiveNote(this.note.id);
        this.note.archived = false;
      } else {
        await NotesApi.archiveNote(this.note.id);
        this.note.archived = true;
      }

      document.dispatchEvent(new Event("noteUpdated"));
    } catch (error) {
      console.error("Gagal mengubah status arsip:", error);
      alert("Gagal mengubah status arsip!");
    }
  }

  async _deleteNote() {
    if (!this.note || !this.note.id) {
      console.error("Note tidak ditemukan!");
      return;
    }

    const confirmDelete = confirm("Yakin mau hapus catatan ini?");
    if (!confirmDelete) return;

    try {
      await NotesApi.deleteNote(this.note.id);

      this.remove();

      console.log(`Catatan dengan ID ${this.note.id} berhasil dihapus.`);
    } catch (error) {
      console.error("Gagal menghapus catatan:", error);
      alert("Gagal menghapus catatan!");
    }
  }

  connectedCallback() {
    this._shadowRoot
      .querySelector(".btn-archive")
      .addEventListener("click", () => {
        this._toggleArchive();
      });

    this._shadowRoot
      .querySelector(".btn-delete")
      .addEventListener("click", () => {
        this._deleteNote();
      });
  }

  set note(value) {
    this._note = value;

    // Render ulang
    this.render();
  }

  get note() {
    return this._note;
  }

  render() {
    this._emptyContent();

    const { id, title, body, createdAt, archived } = this._note || {};

    this._shadowRoot.appendChild(this._style);

    const container = document.createElement("div");
    container.classList.add("card");

    container.innerHTML += `
        <div class="note-main">
          <div class="note-header">
            <button class="btn-archive">${
              archived ? "Batalkan Arsip" : "Arsipkan"
            }</button>
          </div>
          <div class="note-id">${id || "Error Id"}</div>
          <div class="note-title">${title || "Untitled Note"}</div>
          <div class="note-body">${body || "No content available."}</div>
          <div class="note-footer">
            <span class="note-date">${new Date(
              createdAt,
            ).toLocaleDateString()}</span>
            ${archived ? '<p class="btn-delete"></p>' : '<button class="btn-delete">🗑</button>'}
            <span class="archived">${archived ? "Archived" : "Unarchived"}</span>
          </div>  
        </div>
    `;

    this._shadowRoot.appendChild(container);
  }
}

customElements.define("note-item", NoteItem);
