export const elements = {
  searchinput: document.querySelector(".search__field"),
  searchform: document.querySelector(".search"),
  searchResultlist: document.querySelector(".results__list"),
  searchres: document.querySelector(".results"),
  searchrespages: document.querySelector(".results__pages"),
  recipe: document.querySelector(".recipe"),
  shopping: document.querySelector(".shopping__list"),
  likesmenu: document.querySelector(".likes__field"),
  likeslist: document.querySelector(".likes__list")
};

export const elementstring = {
  loader: "loader"
};

export const renderloader = parent => {
  const loader = ` <div class="${elementstring.loader}">
                 <svg>
                   <use href="img/icons.svg#icon-cw"></use>
                   
                   </svg>
                   
                   </div>`;

  parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearloader = () => {
  const loader = document.querySelector(`.${elementstring.loader}`);
  if (loader) loader.parentElement.removeChild(loader);
};
