const authConfig = require('./config/config');
const nodemailer = require('nodemailer');

const transport = {
  host: 'smtp.geetico.com',
  port: 465,
  secure: true,
  auth: {
    user: authConfig.USER,
    pass: authConfig.PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true
};

const transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages', success);
  }
});
