import axios from "axios";
import { key, proxy } from "../config";
import { timingSafeEqual } from "crypto";

export default class recipe {
  constructor(id) {
    this.id = id;
  }
  async getrecipe() {
    try {
      const res = await axios(
        `${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`
      );
      //   console.log(res);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
      alert("something went wrong :(");
    }
  }
  calctime() {
    const numing = this.ingredients.length;
    const periods = Math.ceil(numing / 3);
    this.time = periods * 15;
  }
  calcserving() {
    this.servings = 4;
  }
  parseingre() {
    const unitslong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      " ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds"
    ];
    const unitsshort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound"
    ];
    const units = [...unitsshort, "kg", "g"];

    const newingre = this.ingredients.map(el => {
      //1) uniform units
      let ingredient = el.toLowerCase();
      unitslong.forEach((units, i) => {
        ingredient = ingredient.replace(units, unitsshort[i]);
      });

      //2)remove para
      ingredient = ingredient.replace(/ *\([^)]*\) */g, "");
      //3)parse ingre intp count , unit and ingredents
      const arring = ingredient.split(" ");
      const unitindex = arring.findIndex(el2 => units.includes(el2));

      let objing;
      if (unitindex > -1) {
        //there is a unit

        const arrcount = arring.slice(0, unitindex);
        let count;
        if (arrcount.length === 1) {
          count = eval(arring[0].replace("-", "+"));
        } else {
          count = eval(arring.slice(0, unitindex).join("+"));
        }

        objing = {
          count,
          unit: arring[unitindex],
          ingredient: arring.slice(unitindex + 1).join(" ")
        };
      } else if (parseInt(arring[0], 10)) {
        // there is a no unit but first element is a no
        objing = {
          count: parseInt(arring[0], 10),
          unit: "",
          ingredient: arring.slice(1).join(" ")
        };
      } else if (unitindex === -1) {
        //there is no unit and no num
        objing = {
          count: 1,
          unit: "",
          ingredient
        };
      }
      return objing;
    });
    this.ingredients = newingre;
  }

  updateservings(type) {
    //servings
    const newservings = type === "dec" ? this.servings - 1 : this.servings + 1;
    // ingredents

    this.ingredients.forEach(ing => {
      ing.count = ing.count * (newservings / this.servings);
    });

    this.servings = newservings;
  }
}
