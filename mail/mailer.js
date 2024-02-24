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

async function main(address,userIdURL) {
  

  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <thebradredd@gmail.com>', // sender address
    to: address, // list of receivers
    subject: "Hello zoom ✔", // Subject line
    text: userIdURL, // plain text body
    html: "<b>"+userIdURL+"</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);

}

main().catch(console.error);

module.exports.main = main;


