class SearchView {
  #parentEl = document.querySelector('.search');

  getQuery() {
    return this.#parentEl.querySelector('.search__field').value;
  }

  clearInput() {
    this.#parentEl.querySelector('.search__field').value = '';
  }

  addHandleSearch(handler) {
    this.#parentEl.addEventListener(
      'submit',
      function (e) {
        e.preventDefault();
        handler(this.getQuery());
      }.bind(this)
    );
  }
}

export default new SearchView();
