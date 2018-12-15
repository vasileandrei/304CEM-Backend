// Email service

const mailer = require('nodemailer');
const constants = require('./../globalConstants');

/**
 * Sending a customer email
 *
 * @param {string} email
 * @param {string} fileId
 */
module.exports.customerSendEmail = (email, fileId) => new Promise((resolve) => {
  // Define type of connection and server account
  mailer.createTestAccount(() => {
    const transporter = mailer.createTransport({
      service: 'gmail',
      auth: {
        user: constants.emailAddress,
        pass: constants.emailPassword,
      },
    });

    // Setup email data
    const mailOptions = {
      from: '"File Share" <filesharetestemail@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'File Share: File Downloaded', // Subject line

      // Define email body
      text:
    `Dear customer,\n\n
      
    Thank you for using the File Share Website!\n\n
    
    One of the files you have been uploaded has been downloaded.\n
    File's id is ${fileId}.\n\n
    
    If you have any questions dont' hesitate to contanct us on <filesharetestemail@gmail.com>.\n
    Alternatively you can login to localhost:3000/contact and complete the feedback form.\n\n
     
    Have a great day!`,

      // Define email body
      html: `
    Dear customer,<br /><br />
      
    Thank you for using the File Share Website!<br /><br />
    
    One of the files you have been uploaded has been downloaded.<br />
    File's id is ${fileId}.<br /><br />
    
    If you have any questions dont' hesitate to contanct us on <filesharetestemail@gmail.com>.<br />
    Alternatively you can login to <a href="localhost:3000/contact"localhost:3000/contact</a> and complete the feedback form.<br /><br />
      
    Have a great day!`,
    };

    // Initiate email submission
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // Error reason - most likely leak of recipients
        constants.fileLog.error(`Failed to send an email to ${email}, for file ${fileId}. ${error.message}`);
        resolve([false, error.message]);
        return;
      }
      // Send successful response
      constants.fileLog.info(`Successfully sent an email to ${email}, for file ${fileId}`);
      resolve([true, mailer.getTestMessageUrl(info)]);
    });
  });
});


/**
 * Sending a customer email
 *
 * @param {string} name
 * @param {string} address
 * @param {string} customerMessage
 */
module.exports.feedbackEmail = (name, address, customerMessage) => new Promise((resolve) => {
  // Define type of connection and server account
  mailer.createTestAccount(() => {
    const transporter = mailer.createTransport({
      service: 'gmail',
      auth: {
        user: constants.emailAddress,
        pass: constants.emailPassword,
      },
    });

    // Setup email data
    const mailOptions = {
      from: '"File Share" <filesharetestemail@gmail.com>', // sender address
      to: constants.emailAddress, // list of receivers
      subject: 'Website Feedback', // Subject line
      text: `Feedback from ${name}, email ${address}.\n\n${customerMessage}`,
      html: `Feedback from ${name}, email ${address}.<br /><br />${customerMessage}`,
    };

    // Send successful response
    transporter.sendMail(mailOptions, () => {
      constants.fileLog.info('Successfully sent feedback email');
      resolve([true]);
    });
  });
});
