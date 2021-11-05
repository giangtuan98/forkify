import icons from 'url:../../img/icons.svg';
import View from './View.js';
import previewView from './previewView.js';
class RecipeList extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No result search for your query';

  addHandleShow(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const previewLink = e.target.closest('.preview__link');
      if (previewLink.classList.contains('preview__link')) {
        document
          .querySelector('.preview__link--active')
          ?.classList.remove('preview__link--active');
        previewLink.classList.add('preview__link--active');
        handler();
      }
    });
  }

  _generateMarkup() {
    console.log(this._data);
    return this._data
      .map(recipe => {
        return previewView.render(recipe, false);
      })
      .join('');
  }

  renderError(message = this._errorMessage) {
    this._clear();
    const markup = `
      <li>${message}</li>
    `;
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }
}

export default new RecipeList();
