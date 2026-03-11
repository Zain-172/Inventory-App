import nodemailer from "nodemailer";

export default function node_mailer(to, subject, text) {
    console.log("Sending email to:", process.env.MAIL_APP_EMAIL, process.env.MAIL_APP_PASSWORD);
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_APP_EMAIL,
            pass: process.env.MAIL_APP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.MAIL_APP_EMAIL,
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}