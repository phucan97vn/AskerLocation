import { Meteor } from 'meteor/meteor';
import './ddp';
  Meteor.methods({
    getUser(startDate,endDate) {
      const findUser = database.mongo.find('users',{
        createdAt:{
          $gte:startDate,
          $lte:endDate,
        }
      }).fetch();
      //console.log(findUser);
      return findUser;
    },

    //Grouping Users with createdAt and firstPostedTask by DAY
    async getGroupingDataByDay(startDate,endDate){
      console.log("Here");

      const userGrouped = await AppUser.rawCollection().aggregate([
        {$match:{
          createdAt : { 
            $gte : startDate, 
            $lte : endDate 
          }
        }},
        //Grouping data for new asker counting
        {$group:{
          _id : { day : { $dayOfMonth : "$createdAt" }, month : { $month : "$createdAt" }, year : { $year : "$createdAt" }},
          askerCounter : { $sum : 1 },
          askerPostCounter: {
            $sum:{ 
              $cond:[
                {$and:[ 
                  {"$eq":[{ $dayOfMonth :"$firstPostedTask"}, { $dayOfMonth :"$createdAt"}]}, 
                  {"$eq":[{ $month :"$firstPostedTask"}, { $month :"$createdAt"}]}
              ]},
              // {"$eq":[{ $year : "$firstPostedTask"},{ $dayOfMonth: "$createdAt"}] },
            1, 0]}
          }
        }},
        { $sort : { "_id.day" : 1 } }
      ]).toArray();
      return {
        userGrouped
      }
    },

    //Grouping Users with createdAt and firstPostedTask by Week
    async getGroupingDataByWeek(startDate,endDate){
      const userGrouped = await AppUser.rawCollection().aggregate([
        {$match:{
          "createdAt" : { $gte : startDate , $lte : endDate }
        }},
        //Grouping data for new asker counting
        {$group:{
          _id : { $week : "$createdAt" },
          askerCounter : { $sum : 1 } 
        }},
        //Grouping data for new Asker post counting
        {$group:{
          _id : { $week : "$lastPostedAt" },
          askerPostsCounter : { $sum : 1 } 
        }}
      
      ]);
      return {
        userGrouped
      }
    },

    //Grouping Users with createdAt and firstPostedTask by Month
    async getGroupingDataByMonth(startDate,endDate){
      const userGrouped = await AppUser.rawCollection().aggregate([
        {$match:{
          "createdAt" : { $gte : startDate , $lte : endDate }
        }},
        //Grouping data for new asker counting
        {$group:{
          _id : { $month :"$createdAt" },
          askerCounter : { $sum : 1 } 
        }},
        //Grouping data for new Asker post counting
        {$group:{
          _id : { $month :"$lastPostedAt" },
          askerPostsCounter : { $sum : 1 } 
        }}
      
      ]);
      return {
        userGrouped
      }
    }

  });
