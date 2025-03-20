import ApiHandler from "../utils/api-handler.js";
import EventHandler from "../utils/event-handler.js";

class NoteForm extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");

    this.render();
    // Binding supaya bisa diakses di event listener
    this._validateFields = this._validateFields.bind(this);
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    this._shadowRoot
      .querySelector("form")
      .addEventListener("submit", this._onFormSubmit.bind(this));

    this._addEventListeners();
  }

  _addEventListeners() {
    const form = this._shadowRoot.querySelector("form");
    const titleInput = this._shadowRoot.querySelector("#title");
    const bodyInput = this._shadowRoot.querySelector("#body");
    const titleValidation = this._shadowRoot.querySelector("#titleValidation");
    const bodyValidation = this._shadowRoot.querySelector("#bodyValidation");

    form.addEventListener("submit", (event) => event.preventDefault());

    EventHandler.addValidationListeners(titleInput, titleValidation, 70);
    EventHandler.addValidationListeners(bodyInput, bodyValidation, 500);
  }

  _validateFields(input, validationMessageEl, maxLength) {
    input.setCustomValidity("");

    if (input.validity.valueMissing) {
      input.setCustomValidity("Wajib diisi.");
    } else if (input.value.length == maxLength) {
      input.setCustomValidity(`Maximal karakter tercapai.`);
    }

    validationMessageEl.innerText = input.validationMessage;
  }

  disconnectedCallback() {
    this._shadowRoot
      .querySelector("form")
      .removeEventListener("submit", this._onFormSubmit.bind(this));
  }

  async _onFormSubmit(event) {
    event.preventDefault();
    const title = this._shadowRoot.querySelector("input#title").value.trim();
    const body = this._shadowRoot.querySelector("textarea#body").value.trim();

    const response = await ApiHandler.addNote(title, body);
    console.log(response.message);

    if (response.success) {
      this._shadowRoot.querySelector("form").reset();
    }
  }

  _updateStyle() {
    this._style.textContent = `
      :host-context(#app) {
        display: flex;
        justify-content: center;
        width: 100%;
        max-width: 400px;
      }

      .floating-form {
        align-self: flex-start; /* Biar ukurannya tetap, tidak memanjang */
        max-height: 500px; /* Bisa disesuaikan */
        max-width: 400px;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
        text-align: center;
      }

      .header {
        text-align: center;
        margin: 5px;
        font-weight: bolder;
      }

      .form-group {
        margin-bottom: 15px;
      }

      textarea {
        height: 100px;
        resize: vertical;
      }

      label {
        font-weight: bold;
        display: block;
        margin-bottom: 5px;
        color: #333;
      }

      input, textarea {
        padding: 10px;
        border: 3px solid #ccc;
        border-radius: 5px;
        font-size: 16px;
      }

      input:focus, textarea:focus {
        border-color: #5D8736;
        outline: none;
      }

      button {
        width: 100%;
        padding: 10px;
        background: #5D8736;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background 0.3s ease;
      }

      button:hover {
        background: #4B6D2B;
      }

      .validation-message {
        color: red;
        font-size: 0.9em;
        margin-top: 4px;
      }
    `;
  }

  render() {
    this._emptyContent();
    this._updateStyle();
    this._shadowRoot.appendChild(this._style);

    const formContainer = document.createElement("div");
    formContainer.classList.add("floating-form");

    formContainer.innerHTML = `
            <div class="header">
              Tambah Catatan
            </div>
            <form id="inputNote" class="input-note">
              <div class="form-group">
                <label for="title">Title</label>
                <input id="title" name="title" type="text" aria-describedby="titleValidation" minlength="1" maxlength="70" autocomplete="off" required />
                <p id="titleValidation" class="validation-message" aria-live="polite"></p>
              </div>
              <div class="form-group">
                <label for="body">Body</label>
                <textarea id="body" name="body" aria-describedby="bodyValidation" minlength="1" maxlength="500" autocomplete="off" required></textarea>
                <p id="bodyValidation" class="validation-message" aria-live="polite"></p>
              </div>
              <button>Simpan</button>
            </form>
        `;

    this._shadowRoot.appendChild(formContainer);
  }
}

customElements.define("note-form", NoteForm);
