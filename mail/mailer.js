const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    
    user: "thebradredd@gmail.com",
    pass: "dldlprhjoyrsipmw",
  },
});

async function mainEmail(address,userIdURL) {
  

  const receiver = address || "chamoddousl@gmail.com"

  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <thebradredd@gmail.com>', // sender address
    to: receiver, // list of receivers
    subject: "Hello zoom ✔", // Subject line
    text: userIdURL, // plain text body
    html: "<b>"+userIdURL+"</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);

}

mainEmail().catch(console.error);

module.exports.mainEmail = mainEmail;


