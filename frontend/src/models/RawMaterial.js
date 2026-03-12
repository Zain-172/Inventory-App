export default class RawMaterial {
    constructor({id, raw_id, product_id, quantity, date = new Date().toISOString().split("T")[0]} = {}) {
        this.id = id;
        this.raw_id = raw_id;
        this.product_id = product_id;
        this.quantity = quantity;
        this.date = date;
    }
}