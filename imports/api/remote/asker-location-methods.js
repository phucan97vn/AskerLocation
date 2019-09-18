import { Meteor } from 'meteor/meteor';
import './ddp';
import { HTTP } from 'meteor/http'



Meteor.methods({
    getAllAskerLocation(){
        const allAskerLocation = AskerLocation.find({
            city:{
                $exists:false
            },isUpdating:{
                $exists:false
            }},{limit:1500}).fetch();
        allAskerLocation.forEach(e =>{
            if(e.city == undefined ){
                AskerLocation.update(
                    {_id: e._id},
                    {$set:{isUpdating:true}}
                )
            }
        })
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
                        {$set:{city : result.data.results[0].components.state}},
                        {$unset:{isUpdating:""}}
                    );
                    
                } else if(result.data.results[0].components.city !== undefined){
                    AskerLocation.update(
                        {_id: e._id},
                        {$set:{city : result.data.results[0].components.city}},
                        {$unset:{isUpdating:""}}
                    );
                } else {
                    AskerLocation.update(
                        {_id: e._id},
                        {$unset:{isUpdating:""}}
                    );
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
