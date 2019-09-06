import { Meteor } from 'meteor/meteor';

export default () => {
  Meteor.methods({
    getUser() {
      const findUser = database.mongo.find('users', {}).fetch();
      //console.log(findUser);
      return findUser;
    },
  });
};
