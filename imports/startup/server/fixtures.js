// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import Counters from '../../api/counters/counters.js';

Meteor.startup(() => {
  //CHANGE DEFAULT EMAIL TEMPLATE
  Accounts.emailTemplates.resetPassword.text = function(user, url) {
    url = url.replace('#/', '');
    console.log(url);
    return ' To reset your password, simply click the link below:\n\n' + url;
  };

  //Set MainURL for sending email
  process.env.MAIL_URL = 'smtp://phucanclone97:Phucan0112!@smtp.gmail.com:587/';
  //SEND VERIFICATION CODE TO USER EMAIL
  twoFactor.sendCode = (user, code) => {
    console.log('User code :' + code);
    // Don't hold up the client
    // Email.send({
    //   to: 'phucanvn2012@gmail.com', // Method attached using dburles:collection-helpers
    //   from: 'phucanclone97@gmail.com',
    //   subject: 'Your account info',
    //   text: ` ${code} is your verify code.`
    // });
    // console.log('Email sent');
  };
});
