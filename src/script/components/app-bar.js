class AppBar extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");

    this._bgcolor = this.getAttribute("background-color");
    this._color = this.getAttribute("color");
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 16px;
          background-color: ${this._bgcolor}; 
          color: ${this._color};
          font-size: 2em;
          font-weight: bold;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          text-transform: uppercase;
        }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
    <div>
      <slot>Notes App</slot>
    <div>
    `;
  }
}

customElements.define("app-bar", AppBar);
