/**
 * Client DDP Connection
 * Connect to existing meteor server using ddp
 *
 * See Profile component in 'pages' directory for HOC data fetching example
 */

// import { DDP } from 'meteor/ddp-client';

// // establish ddp connection
// const remoteUrl = 'http://mongodb://0.tcp.ngrok.io:15498';
// const Remote = DDP.connect(remoteUrl);
// Remote.onReconnect = (...args) => console.log('reconnected to ddp...', args);

// export default Remote;

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { MongoInternals } from 'meteor/mongo';

export default () => {
  database = new MongoInternals.RemoteCollectionDriver(
    'mongodb://0.tcp.ngrok.io:14056/meteor',
    {
      oplogUrl: 'mongodb://0.tcp.ngrok.io:14056/local',
    });
  
  AppUser = new Mongo.Collection('users',{ 
    _driver: database,
    //Allow 2 collections have same name: users
    _suppressSameNameError: true });
};

// example: call a remote server method (use in place of Meteor.call)
/*
Remote.call('someMethod', (err) => {
  // 'someMethod' is run on the remote meteor server
  if (err) {
    return console.log('error calling method over ddp');
  }
  console.log('successfully called method over ddp!');
});
*/
