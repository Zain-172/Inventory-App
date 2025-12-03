export default class Product {
  constructor(id, name, cost_price, stock, date = new Date().toISOString().split("T")[0]) {
    this.id = id;
    this.name = name;
    this.cost_price = cost_price;
    this.stock = stock;
    this.date = date;
  }
}