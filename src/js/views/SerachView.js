import { elements } from "./base";

export const getinput = () => elements.searchinput.value;

export const clearinput = () => {
  elements.searchinput.value = "";
};

export const clearresults = () => {
  elements.searchResultlist.innerHTML = " ";
  elements.searchrespages.innerHTML = "";
};

export const highlighted = id => {
  const resultarr = Array.from(document.querySelectorAll(".results__link"));
  resultarr.forEach(el => {
    el.classList.remove("results__link--active");
  });
  document
    .querySelector(`.results__link[href*="${id}"]`)
    .classList.add("results__link--active");
};

const limitRestitle = (title, limit = 17) => {
  const newtitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newtitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    //return the result
    return `${newtitle.join(" ")} ...`;
  }
  return title;
};

const renderrecipe = recipe => {
  const markup = `<li>
                    <a class="results__link " href=" #${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="Test">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name"> ${limitRestitle(
                              recipe.title
                            )}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>`;
  elements.searchResultlist.insertAdjacentHTML("beforeend", markup);
};

const createbutton = (page, type) =>
  `

  <button class="btn-inline results__btn--${type}" data-goto=${
    type === "prev" ? page - 1 : page + 1
  }>
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${
        type === "prev" ? "left" : "right"
      } "></use>
    </svg>
    <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
  </button>`;

const renderbuttons = (page, numresults, resperpage) => {
  const pages = Math.ceil(numresults / resperpage);
  let button;
  if (page === 1 && pages > 1) {
    //button to go to the next page
    button = createbutton(page, "next");
  } else if (page === pages && pages > 1) {
    //button to go to the previous page
    button = createbutton(page, "prev");
  } else if (page < pages) {
    // both button
    button = `${createbutton(page, "next")}
    ${createbutton(page, "prev")}`;
  }

  elements.searchrespages.insertAdjacentHTML("afterbegin", button);
};

export const renderresult = (recipes, page = 1, resperpage = 10) => {
  // we have to pass the page and resperpage  as a argument

  const start = (page - 1) * resperpage;
  const end = page * resperpage;
  // start and end variables for the slice method ... slice is a 0 based array... actually it cut out the array frm given start and the end point given

  // end is not included in the array so page*resperpage = 10 and in the array it will only give upto 9 and thats we want

  recipes.slice(start, end).forEach(renderrecipe);

  //render buttons prev and next
  renderbuttons(page, recipes.length, resperpage);
};
