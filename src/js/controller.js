import * as model from './model.js';
import recipeView from './views/recipeView.js';
import recipeListView from './views/recipeListView.js';
import searchView from './views/searchView.js';
import bookmarkView from './views/bookmarkView.js';
import AddRecipeView from './views/addRecipeView';
import 'core-js';
import 'regenerator-runtime/runtime';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const searchRecipes = async function (search) {
  try {
    recipeListView.renderSpinner();
    await model.searchRecipes(search);
    recipeListView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (page) {
  recipeListView.render(model.getSearchResultsPage(page));

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlBookmark = function () {
  if (model.state.recipe.bookmarked) {
    model.deleteBookmark(model.state.recipe);
  } else {
    model.addBookmark(model.state.recipe);
  }

  recipeView.update(model.state.recipe);

  bookmarkView.render(model.state.bookmarks);
};

const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
    // paginationView.render();
  } catch (err) {
    recipeView.renderError();
  }
};

const loadBookmarks = function () {
  model.loadBookmarkedRecipe();
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    await model.uploadRecipe(newRecipe);

    setTimeout(() => {
      addRecipeView.toggleWindow();
      recipeView.render(model.state.recipe);
      bookmarkView.render(model.state.bookmarks);

      // change id in url
      window.history.pushState(null, '', `#${model.state.recipe.id}`);
    }, 1000);
  } catch (error) {
    addRecipeView.renderError(error);
  }
};

const init = function () {
  loadBookmarks();
  searchView.addHandleSearch(searchRecipes);
  recipeListView.addHandleShow(showRecipe);
  paginationView.addHandlePagination(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmark);
  bookmarkView.addHandleShow(showRecipe);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  [('hashchange', 'load')].forEach(e => window.addEventListener(e, showRecipe));
};
init();
