export default class Product {
  constructor({id, name, price, stock, date = new Date().toISOString().split("T")[0]} = {}) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.date = date;
  }
}