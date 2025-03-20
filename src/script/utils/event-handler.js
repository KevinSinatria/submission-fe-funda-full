const EventHandler = {
  addValidationListeners(input, validationMessageEl, maxLength) {
    input.addEventListener("change", () =>
      this._validateFields(input, validationMessageEl, maxLength),
    );
    input.addEventListener("invalid", () =>
      this._validateFields(input, validationMessageEl, maxLength),
    );
    input.addEventListener("blur", () =>
      this._validateFields(input, validationMessageEl, maxLength),
    );
  },

  _validateFields(input, validationMessageEl, maxLength) {
    input.setCustomValidity("");

    if (input.validity.valueMissing) {
      input.setCustomValidity("Wajib diisi.");
    } else if (input.value.length >= maxLength) {
      input.setCustomValidity(`Maximal karakter tercapai.`);
    }

    validationMessageEl.innerText = input.validationMessage;
  },
};

export default EventHandler;
