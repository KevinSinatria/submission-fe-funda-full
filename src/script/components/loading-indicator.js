class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });

    this._shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(217, 217, 217, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            visibility: hidden;
          }
          
          .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid transparent;
            border-top-color: #5D8736;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
  
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        </style>
        <div class="spinner"></div>
      `;
  }

  show() {
    this.style.visibility = "visible";
  }

  hide() {
    this.style.visibility = "hidden";
  }
}

customElements.define("loading-indicator", LoadingIndicator);
