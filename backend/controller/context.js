import node_mailer from "../model/nodemailer.js";

export default class Context {
    constructor() {
        if (Context.instance) {
            return Context.instance;
        }
        Context.instance = this;
    }

    sendContextEmail(to, subject, text) {
        node_mailer(to, subject, JSON.stringify(text, null, 2));
    }

}