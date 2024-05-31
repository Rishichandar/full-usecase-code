const nodemailer = require("nodemailer");
const { GenericResponse, ResponseStatus } = require("../../../GenericResponse");
const ErrorMessage = require("../../../ErrorMessage");

const SendEmail = (subject, htmlBody, toEmail) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_API_PASSWORD,
    },
    Timeout: 20000,
  });
  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // Should be your email
    to: toEmail, // The recipient's email address
    subject: subject,
    // text: `You requested a password reset. Please use the link below to set a new password. This link is only valid for the next hour.\n\nReset your password: ${process.env.FORGET_PASSWORD_LINK}${token}\n\nPlease do not reply to this email as it is an automated response.`,
    html: htmlBody,
  };

  //   return transporter.sendMail(mailOptions, function (error, info) {
  //     if (error) {
  //       console.log(error);
  //       return res
  //         .status(500)
  //         .json(
  //           new GenericResponse(
  //             ResponseStatus.Failure,
  //             ErrorMessage.FailedMail,
  //             null
  //           )
  //         );
  //     } else {
  //       console.log("Email sent successfully: " + info.response);
  //       return res
  //         .status(200)
  //         .json(
  //           new GenericResponse(
  //             ResponseStatus.Success,
  //             null,
  //             "Email sent successfully: " + info.response
  //           )
  //         );
  //     }
  //   });
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

module.exports = { SendEmail };
