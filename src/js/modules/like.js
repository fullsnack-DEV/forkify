export default class likes {
  constructor() {
    this.likes = [];
  }
  addlike(id, title, author, img) {
    const like = {
      id,
      title,
      author,
      img
    };
    this.likes.push(like);
    //local storage9
    this.persistedata();
    return like;
  }
  deletelike(id) {
    const index = this.likes.findIndex(el => el.id === id);
    this.likes.splice(index, 1);
    this.persistedata();
  }
  islike(id) {
    return this.likes.findIndex(el => el.id === id) != -1;
  }
  getnolikes() {
    return this.likes.length;
  }
  persistedata() {
    localStorage.setItem("likes", JSON.stringify(this.likes));
  }
  readstorage() {
    const storage = JSON.parse(localStorage.getItem("likes"));

    //restore likes frm the storage
    if (storage) this.likes = storage;
  }
}
