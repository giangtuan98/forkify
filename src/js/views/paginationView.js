import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlePagination(handler) {
    this._parentElement.addEventListener(
      'click',
      function (e) {
        const paginationBtn = e.target.closest('.btn--inline');

        if (!paginationBtn) return;

        handler(+paginationBtn.dataset.go);
      }.bind(this)
    );
  }

  _generateMarkup() {
    let markup = '';
    if (this._data.page > 1) {
      markup += `
      <button class="btn--inline pagination__btn--prev" data-go="${
        this._data.page - 1
      }">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._data.page - 1}</span>
      </button>`;
    }

    if (this._data.page < this._data.totalPage) {
      markup += `<button class="btn--inline pagination__btn--next" data-go="${
        this._data.page + 1
      }">
        <span>Page ${this._data.page + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
    }

    return markup;
  }
}

export default new PaginationView();
