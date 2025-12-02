export default class Expense {
  constructor({id, title, description, amount, date = new Date().toISOString().split("T")[0]} = {}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.amount = amount;
    this.date = date;
  }
}