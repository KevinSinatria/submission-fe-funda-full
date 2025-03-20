class FooterBar extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _updateStyle() {
    this._style.textContent = `
        :host {
          display: block;
        }
   
        div {
          padding: 24px 20px;
          position: sticky;
          bottom: 0;
          background-color: #3E7B27;
        }

        div > p {
          text-align: center;
          color: white;
        }
      `;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `      
        <div>
          <p>Notes-App Kevin Sinatria &copy; 2025</p>
        </div>
      `;
  }
}

customElements.define("footer-bar", FooterBar);
