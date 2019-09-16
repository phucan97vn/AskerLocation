import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Promise } from 'meteor/promise';
//get Old User
const getOldAskers = (from,to) => {
    let distinct = Meteor.wrapAsync(Task.rawCollection().distinct, Task.rawCollection());
    const askerIds = distinct('askerId',{
        date:{
            $gte:from,
            $lte:to
        },
        status:'DONE'
    });
    return database.mongo.find('users',{
        _id: {$in:askerIds},
        createdAt : {
            $lt:from
        }
    }, {fields: {_id:1}}).map((asker)=> asker._id);
};

//get New User
const getNewAskers = (from,to) => {
    let distinct = Meteor.wrapAsync(Task.rawCollection().distinct, Task.rawCollection());
    const askerIds = distinct('askerId',{
        date:{
            $gte:from,
            $lte:to
        },
        status:'DONE'
    });

    return database.mongo.find('users',{
        _id:{$in:askerIds},
        createdAt:{
            $gte:from,
            $lte:to
        }
    },{fields: {_id:1}}).map((asker) => asker._id);
};

//Try new Way 
const countAllTaskDoneInDay = (newAskerIds,oldAskerIds , startDate, endDate) =>{
    // let aggregate = Meteor.wrapAsync(Task.rawCollection().aggregate,Task.rawCollection());
    // const groupedData = aggregate('groupedByDay',[
        // const groupedData = Task.rawCollection().aggregate([
    var allUserIds = newAskerIds.concat(oldAskerIds);
    //console.log(allUserIds);
    let rawTask = Task.rawCollection();
    let groupedData = Promise.await(rawTask.aggregate([
        {
            $match:{
                date:{ $gte:startDate, $lte:endDate },
                status:'DONE',
                askerId: {$in: allUserIds}
            }
        },
        {
            $group:{
                _id : { day : { $dayOfMonth : "$date" }, month : { $month : "$date" }, year : { $year : "$date" }},
                tasksDoneByNewAskerCounter:{ 
                    $sum: {
                        $cond:[{                            
                            $setIsSubset:[["$askerId"],newAskerIds]
                        },1,0]  
                    }
                },
                tasksDoneByOldAskerCounter:{ 
                    $sum: {
                        $cond:[
                            {
                                $setIsSubset:[["$askerId"],oldAskerIds]
                        },1,0]
                    }
                },
                askersId:{$push:{askerId:"$askerId"}}
            }
        }
        // { $sort : { "_id.day" : 1 } }
    ]).toArray());
    return {
        groupedData
    }
};

Meteor.methods({
    getAllTask(){
        const findTask = database.mongo.find('task').fetch();
        return findTask;
    },

    getAskerStatistic(sourceDate){
        // Need to be refactored
        var from = moment(sourceDate).startOf('date').toDate();
        var to   = moment(sourceDate).endOf('date').toDate();
        const newAskerIds = getNewAskers(from, to);
        const oldAskerIds = getOldAskers(from, to); 
        return {
            newAskers:newAskerIds,
            oldAskers:oldAskerIds,
            newAskersCounter:newAskerIds.length,
            oldAskersCounter:oldAskerIds.length
        }

    },

    //async 'askerRetention.dailyAnalytic'(sourceDate,startDate,endDate){
    'askerRetention.dailyAnalytic'(sourceDate,startDate,endDate){
        //Need to be refactored
        var from = moment(sourceDate).startOf('date').toDate();
        var to   = moment(sourceDate).endOf('date').toDate();

        if(startDate >= from){
            //Check if startOf rangeDate > endOf sourceDate
            const newAskerIds = getNewAskers(from, to);
            const oldAskerIds = getOldAskers(from, to);
            const taskCounterGroupedByDay = countAllTaskDoneInDay(newAskerIds,oldAskerIds,startDate,endDate);

            return {
                taskCounterGroupedByDay
            }
        
        }
        else{
            throw new Meteor.Error("Invalid Day");
        }
        
    }

})

