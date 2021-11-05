import View from './View';
import icons from 'url:../../img/icons.svg';

class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');

  addHandleShow(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const previewEl = e.target.closest('.preview');
      if (previewEl) {
        handler();
      }
    });
  }

  _generateMarkup() {
    if (!Array.isArray(this._data) || this._data.length === 0) {
      return `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>
            No bookmarks yet. Find a nice recipe and bookmark it :)
          </p>
        </div>
    `;
    }

    return this._data
      .map(recipe => {
        return `
      <li class="preview">
        <a class="preview__link" href="#${recipe.id}">
          <figure class="preview__fig">
            <img src="${recipe.image}" alt="Test" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">
              ${recipe.title}
            </h4>
            <p class="preview__publisher">${recipe.publisher}</p>
          </div>
        </a>
      </li>
    `;
      })
      .join('');
  }

  renderError() {}
}

export default new BookmarkView();
