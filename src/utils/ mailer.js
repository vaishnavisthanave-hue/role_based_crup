const nodemailer = require("nodemailer");
const transpoter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth:{
        user : process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});
const sendMail = async({
    to,
    subject,
    text,
    html
}) =>{
    return await transpoter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        text,
        html
    })
};
module.exports = sendMail;