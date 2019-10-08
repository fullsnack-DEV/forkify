// e6c7c5ccf015d6de667c3145b448df99
//https://www.food2fork.com/api/search

import Search from "./modules/Search";
import { elements, renderloader, clearloader } from "./views/base";
import * as searchview from "./views/SerachView";
import * as recipeview from "./views/recipeview";
import * as listview from "./views/listview";
import * as likesview from "./views/likesview";
import recipe from "./modules/recipe";
import list from "./modules/list";
import like from "./modules/like";
import { Fraction } from "Fractional";
import likes from "./modules/like";

const state = {};
window.state = state;

/**
 
 search controller 
 */

const controlsearch = async () => {
  //1) get query from the view
  const query = searchview.getinput();
  //todo

  if (query) {
    //2) new search object and add to state
    state.search = new Search(query);

    //3)prepare for the ui for result
    searchview.clearinput();
    searchview.clearresults();
    renderloader(elements.searchres);

    try {
      //4) search for the repies

      await state.search.getResults();

      //5) render the ui
      clearloader();
      searchview.renderresult(state.search.result);
    } catch (err) {
      alert("something went wrong");
      clearloader();
    }
  }
};

elements.searchform.addEventListener("submit", e => {
  e.preventDefault();
  controlsearch();
});

elements.searchrespages.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const gotopage = parseInt(btn.dataset.goto, 10);
    searchview.clearresults();
    searchview.renderresult(state.search.result, gotopage);
  }
});

/**

 recipe controller
 */
const controlrecipe = async () => {
  //get id from url
  const id = window.location.hash.replace("#", "");
  console.log(id);
  if (id) {
    //prepare ui for changes
    recipeview.clearrecipe();
    renderloader(elements.recipe);

    //create new recipe project
    state.recipe = new recipe(id);
    //highlight the selected recipe

    if (state.search) {
      searchview.highlighted(id);
    }

    //get recipe data and parse ingredents

    await state.recipe.getrecipe();
    state.recipe.parseingre();

    //calcuate servings and time
    state.recipe.calctime();
    state.recipe.calcserving();

    //render recipe
    clearloader();
    recipeview.renderecipe(state.recipe, state.likes.islike(id));
  }
};

// window.addEventListener("hashchange", controlrecipe);
// window.addEventListener('load',controlrecipe);

["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controlrecipe)
);
//list controller

const controllist = () => {
  //creste a list
  if (!state.list) state.list = new list();

  //add each ingre to list
  state.recipe.ingredients.forEach(el => {
    const item = state.list.additem(el.count, el.unit, el.ingredient);
    listview.renderitem(item);
  });
};
//handle delte and update list events

elements.shopping.addEventListener("click", e => {
  const id = e.target.closest(".shopping__item").dataset.itemid;
  //handle a delte butn
  if (e.target.matches(".shopping__delete ,  .shopping__delete *")) {
    //delete frm state
    state.list.deleteitem(id);

    //delete frm ui
    listview.deleteitem(id);
  } else if (e.target.matches(".shopping__count-value")) {
    const val = e.target.value;
  }
});

//like controller
const controlllike = () => {
  if (!state.likes) state.likes = new likes();
  const currid = state.recipe.id;

  //user yet not like the current recipe
  if (!state.likes.islike(currid)) {
    //add likes to the state
    const newlike = state.likes.addlike(
      currid,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    //toggle the like button
    likesview.togglelikebtn(true);

    //add like to ui list
    likesview.renderlike(newlike);

    //user liked the recipe
  } else {
    //rremove like frm the state
    state.likes.deletelike(currid);

    //toggle the like button
    likesview.togglelikebtn(false);
    //remove the ike frm the ui list
    likesview.deletelike(currid);
  }
  likesview.togglelikemenu(state.likes.getnolikes());
};
window.addEventListener("load", () => {
  state.likes = new likes();
  //restore likes
  state.likes.readstorage();
  //toggle butn
  likesview.togglelikemenu(state.likes.getnolikes());
  //render the exist likes
  state.likes.likes.forEach(like => likesview.renderlike(like));
});

//handling recipe button clicks

elements.recipe.addEventListener("click", e => {
  if (e.target.matches(".btn-decrease , .btn-decrease *")) {
    //dec button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateservings("dec");
      recipeview.updateservingingre(state.recipe);
    }
  } else if (e.target.matches(".btn-increase , .btn-increase *")) {
    state.recipe.updateservings("inc");
    recipeview.updateservingingre(state.recipe);
  } else if (e.target.matches(".recipe__btn--add , .recipe__btn--add *")) {
    //add ingre to shopping list

    controllist();
  } else if (e.target.matches(".recipe__love , .recipe__love *")) {
    //like controller
    controlllike();
  }
});
