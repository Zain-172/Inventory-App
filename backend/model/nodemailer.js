import nodemailer from "nodemailer";

export default function node_mailer(to, subject, text) {
    const password = "ilnv gsoo pglm ewju";
    const email = "twintechdeveloper@gmail.com";
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: email,
            pass: password
        }
    });

    const mailOptions = {
        from: email,
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