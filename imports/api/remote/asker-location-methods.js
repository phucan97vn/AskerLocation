import { Meteor } from 'meteor/meteor';
import './ddp';
import { HTTP } from 'meteor/http'

//import { Promise } from 'meteor/promise';
// const updateAskerLocation = (city,askerId) =>{
//     AskerLocation.update(
//             {_id:askerId},
//             {$set:{city:city}}
//         );
// );

Meteor.methods({
    getAllAskerLocation(){
        const allAskerLocation = AskerLocation.find({city:{$exists:false}},{limit:2000}).fetch();
        // const firstAskerLocation = AskerLocation.find({id:"PMXoFLNM3iXnXuKB8"}).fetch();
        // return firstAskerLocation;
        return allAskerLocation;
    },

    getResponseFromOpenCage(data){
        //console.log(data); 
        var apikey = 'eee898d5e9c94cb589cccbf2ae61f0f0';
        var api_url= 'https://api.opencagedata.com/geocode/v1/json';
        data.map(e => {
            if(e.city == undefined){                
            //console.log(e._id, e.lat, e.lng);
                var request_url = api_url
                + '?'
                + 'key=' + apikey
                + '&q=' + encodeURIComponent(e.lat + ',' + e.lng)
                + '&pretty=1';
                let result = HTTP.get(request_url);
                
                console.log(result.data.results[0].components.state);
                if(result.data.results[0].components.state !== undefined ){
                    AskerLocation.update(
                        {_id: e._id},
                        {$set:{city : result.data.results[0].components.state}}
                    );
                    
                } else if(result.data.results[0].components.city !== undefined){
                    AskerLocation.update(
                        {_id: e._id},
                        {$set:{city : result.data.results[0].components.city}}
                    );
                } else {
                    
                    console.log("SKIP");
                    
                }
                console.log("UPDATED");
                // console.log(result.data.results[0].components.city);
                Meteor._sleepForMs(1000);    
            }
            else{
                console.log("SKIPPED");
            }
        })

        // var latitude = lat;
        // var longitude = lng;

        // var api_url= 'https://api.opencagedata.com/geocode/v1/json';
        // var request_url = api_url
        //     + '?'
        //     + 'key=' + apikey
        //     + '&q=' + encodeURIComponent(latitude + ',' + longitude)
        //     + '&pretty=1';
        // const result = HTTP.get(request_url);
        // //Update Database
        // // updateAskerLocation(result.data.results[0].components.state,askerId);
        // AskerLocation.update(
        //     {_id:askerId},
        //     {$set:{city:result.data.results[0].components.state}}
        // );
        // console.log("UPDATE SUCCESSFULLY");
        //Set a sleep time between each call
        // Meteor._sleepForMs(1000);
        // return(
        //     result
        // )
    },
    checkingLimitation(){
        var lat= 22.3024109026125;
        var lng= 114.169675341075;
        var apikey = 'eee898d5e9c94cb589cccbf2ae61f0f0';
        var api_url= 'https://api.opencagedata.com/geocode/v1/json';
        var request_url = api_url
            + '?'
            + 'key=' + apikey
            + '&q=' + encodeURIComponent(lat + ',' + lng)
            + '&pretty=1';
        let result = HTTP.get(request_url);
        return result;
    }

});