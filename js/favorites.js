export default class Favorite {
  key = "favorites";
  cache;

  read() {
    if (!this.cache) {
      let value = localStorage.getItem(this.key);
      this.cache = value ? JSON.parse(value) : [];
    }
    return this.cache;
  }

  set(items) {
    try {
      localStorage.setItem(this.key, JSON.stringify(items));
    } catch (e) {
      if (e == QUOTA_EXCEEDED_ERR) {
        alert("Превышен лимит");
      }
    }
  }

  getIndex(item) {
    let items = this.cache || this.read();
    let index = -1;
    items.forEach((el, i) => {
      if (el.id === item.id) {
        index = i;
      }
    });
    return index;
  }

  add(item) {
    let items = this.read();
    if (this.getIndex(item) === -1) {
      items.push(item);
    }
    this.set(items);
  }

  delete(item) {
    let items = this.read();
    let index = this.getIndex(item);
    if (index !== -1) {
      items.splice(index, 1);
    }
    this.set(items);
  }
}
