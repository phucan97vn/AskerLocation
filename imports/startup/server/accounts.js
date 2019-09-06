/**
 * Accounts Setup
 */

import { Accounts } from 'meteor/accounts-base';
import Counters from '../../api/counters/counters.js';

//User auto-logged out after 1 day of inactivity
Accounts.config({
  loginExpirationInDays: 1,
});

Accounts.onCreateUser((options, user) => {
  // init counter at 0
  Counters.insert({
    _id: user._id,
    count: Number(0),
  });
  return user;
});
