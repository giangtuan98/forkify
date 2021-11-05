import { API_URL, RES_PER_PAGE, KEY } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    page: 0,
    totalPage: 0,
    perPage: RES_PER_PAGE,
    results: [],
  },
  bookmarks: [],
};

const formatRecipe = function (recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`${data.message} (${res.status})`);
    }

    const { recipe } = data.data;
    state.recipe = formatRecipe(recipe);
    state.recipe.bookmarked = state.bookmarks.some(recipe => recipe.id == id);
  } catch (err) {
    console.error(err);
  }
};

export const searchRecipes = async function (search) {
  try {
    const response = await fetch(`${API_URL}?search=${search}`);
    data = await response.json();
    const { recipes } = data.data;
    state.search.results = recipes.map(recipe => formatRecipe(recipe));
    state.search.page = 1;
    state.search.totalPage = Math.ceil(data.results / state.search.perPage);
  } catch (error) {
    console.error(error);
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.perPage; // 0
  const end = page * state.search.perPage; // 9

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  console.log(state.recipe);
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const saveToLocalStorage = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
  state.recipe.bookmarked = true;
  state.bookmarks.push(recipe);
  saveToLocalStorage();
};

export const deleteBookmark = function (recipe) {
  const index = state.bookmarks.findIndex(r => r.id === recipe.id);
  if (index < 0) return;
  state.recipe.bookmarked = false;
  state.bookmarks.splice(index, 1);
  saveToLocalStorage();
};

export const loadBookmarkedRecipe = function () {
  const bookmarksJson = localStorage.getItem('bookmarks');
  state.bookmarks = bookmarksJson ? JSON.parse(bookmarksJson) : [];
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(([key, value]) => {
        return key.startsWith('ingredient') && value !== '';
      })
      .map(entry => {
        const ingArr = entry[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3) {
          throw new Error('Wrong ingredient format!');
        }
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const res = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = formatRecipe(res.data.recipe);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
