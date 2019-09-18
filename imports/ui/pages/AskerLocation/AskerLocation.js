import React,{ Component } from 'react';
import { Meteor } from 'meteor/meteor';

export default class AskerLocation extends Component {
    constructor(props){
        super(props);
        this.state={
            
            data:null,
            
            city: null
        };

        //this.onUpdateAskerLocation = this.onUpdateAskerLocation.bind(this);
        this.onClickHandle = this.onClickHandle.bind(this);
        this.onSendRequest = this.onSendRequest.bind(this);
    }

    onClickHandle(){
        Meteor.call('getAllAskerLocation',(e,result)=>{
            // console.log(result);
            this.setState({
                data:result,
            })
            console.log(this.state.data);
        })
    }

    onSendRequest(){
        const { data } = this.state;
        // data.forEach(function(element){
            Meteor.call('getResponseFromOpenCage', data ,(e,result)=>{
                if(!e){
                    console.log("Calling Method Complete");
                }
            })
        // })
    }

    onChecking(){
        Meteor.call('checkingLimitation',(e,result)=>{
            console.log(result);
        })
    }
    

    render(){
        return(
            <div>
                <h1>This is Asker Location Page</h1>
                <button 
                className="btn btn-primary"
                onClick={this.onClickHandle}>Click Here to see</button>
                <button 
                className="btn btn-info" 
                onClick={this.onSendRequest}>Send Request and Update</button>
                <button
                className="btn btn-secondary"
                onClick={this.onChecking}>Check Limitation</button>
                {/* <div>{this.state.city}</div>*/}
            </div>
        )    
    }    
}
