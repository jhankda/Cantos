import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: 'true', // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "harshjhankda200988@gmail.com",
    pass: "poybntbfjnnmcriq",
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