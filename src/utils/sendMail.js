import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER ,
  port: process.env.PORT_MAIL,
  secure: 'true', // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.MAIL_SECRET,
    pass: process.env.PASS_GOOGLE,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(email,subject,text,html) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Harsh Jhankda 👻" harshjhankda200988@gmail.com', // sender address
    to: `${email}`,
    subject,
    text,
    html 
  });

}

export {sendMail};