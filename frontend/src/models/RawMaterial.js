export default class RawMaterial {
    constructor(id, name, quantity, price, machinery, labour, description, date_added = new Date().toISOString().split("T")[0]) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.machinery = machinery;
        this.labour = labour;
        this.description = description;
        this.date_added = date_added;
    }
}