import icons from 'url:../../img/icons.svg';

export default class View {
  _parentElement;

  render(data, isRender = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    this._data = data;
    const markup = this._generateMarkup();
    if (!isRender) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // update(data) {
  //   this._data = data;

  //   if (!data || (Array.isArray(data) && data.length === 0)) {
  //     return this.renderError();
  //   }

  //   this._data = data;
  //   const newMarkup = this._generateMarkup();

  //   const newVirtualDOM = document
  //     .createRange()
  //     .createContextualFragment(newMarkup);
  //   const newElements = newVirtualDOM.querySelectorAll('*');
  //   console.log(newElements);
  //   const curElements = this._parentElement.querySelectorAll('*');

  //   newElements.forEach((newEl, i) => {
  //     const curEl = curElements[i];
  //     // console.log(curEl, newEl.isEqualNode(curEl));
  //     // Updates changed TEXT
  //     if (
  //       !newEl.isEqualNode(curEl) &&
  //       newEl.firstChild.nodeValue.trim() !== ''
  //     ) {
  //       curEl.textContent = newEl.textContent;
  //     }

  //     //Updates changed ATTRIBUTES
  //     if (!newEl.isEqualNode(curEl)) {
  //       Array.from(newEl.attributes).forEach(attr => {
  //         curEl.setAttribute(attr.name, attr.value);
  //       });
  //     }
  //   });
  //   // Live in memory
  // }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDoms = document
      .createRange()
      .createContextualFragment(newMarkup)
      .querySelectorAll('*');

    const currentDoms = this._parentElement.querySelectorAll('*');

    newDoms.forEach((newDom, index) => {
      const currentDom = currentDoms[index];
      if (
        !currentDom.isEqualNode(newDom) &&
        currentDom.firstChild?.nodeValue?.trim() !== ''
      ) {
        currentDom.textContent = newDom.textContent;
      }

      if (!currentDom.isEqualNode(newDom)) {
        Array.from(newDom.attributes).forEach(attr => {
          currentDom.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
