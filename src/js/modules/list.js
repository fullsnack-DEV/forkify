import uniqid from "uniqid";

export default class list {
  constructor() {
    this.items = [];
  }
  additem(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient
    };
    this.items.push(item);
    return item;
  }

  deleteitem(id) {
    const index = this.items.findIndex(el => el.id === id);
    this.items.splice(index, 1);
  }
  updatecount(id, newcount) {
    this.items.find(el => el.id === id).count = newcount;
  }
}
