const sendMail = require("../utils/ mailer");
const sendWelcomeEmail = async(user)=>{
    return await sendMail({
        to :user.email,
        subject:"welcome to our application",
        text:`
        Hello ${user.name} 
        your account create successfully.
        Email : ${user.eamail}
        Thank You`,
        html: `
            <h2>Hello ${user.name}</h2>

            <p>
                Your account has been created successfully.
            </p>

            <p>
                Email: <strong>${user.email}</strong>
            </p>

            <p>Thank you.</p>
        `
    })
}

const sendDeleteRequestEmail = async (user) => {

    return await sendMail({
        to: user.email,

        subject: "Account deletion request",

        text: `
Hello ${user.name},

Your account deletion request has been received.
        `,

        html: `
            <h2>Hello ${user.name}</h2>

            <p>
                Your account deletion request has been received.
            </p>
        `
    });
};


module.exports = {
    sendWelcomeEmail,
    sendDeleteRequestEmail
};