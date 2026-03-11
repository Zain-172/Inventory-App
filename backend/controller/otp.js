import node_mailer from "../model/nodemailer.js";
export default class OTP {
    constructor() {
        if (OTP.instance) {
            return OTP.instance;
        }
        this.otp = null;
        this.expiry = null;
        OTP.instance = this;
    }

    generateOTP() {
        this.otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.expiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
    }

    validateOTP(input) {
        if (Date.now() > this.expiry) {
            return { valid: false };
        } else if (input === this.otp) {
            return { valid: true };
        } else {
            return { valid: false };
        }
    }

    clearOTP() {
        this.otp = null;
        this.expiry = null;
    }

    sendOTPEmail(email) {
        if (!this.otp) {
            this.generateOTP();
        }
        const subject = "Your OTP Code";
        const text = `Your OTP code is: ${this.otp}. It is valid for 5 minutes.`;
        node_mailer(email, subject, text);
    }
}