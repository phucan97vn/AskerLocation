import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import 'react-dates/initialize';
import {
    SingleDatePicker,
    DateRangePicker,
} from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
//import { thisExpression } from '@babel/types';

const styleSpace={
    margin:"20px"
};

export default class AskerRetention extends Component{
    constructor(props){
        super(props);
        this.state = {
            date : null,
            rangeDate:{
                startDate : null,
                endDate : null,
            },
            newUserCounter:0,
            oldUserCounter:0,
            taskCounter:null,

            userIsReady:false,
            taskCounterIsReady:false,
            

            fullData: null
        };

    
    this.onShowTasksCount = this.onShowTasksCount.bind(this);
    this.onShowAskerCounter = this.onShowAskerCounter.bind(this);
    this.handleGetAllData = this.handleGetAllData.bind(this);
    }

    componentWillMount() {
        if (!this.props.loggedIn) {
          return this.props.history.push('/login');
        }
    };
    
    shouldComponentUpdate(nextProps) {
        if (!nextProps.loggedIn) {
            nextProps.history.push('/login');
            return false;
        }
        return true;
    };

    //Show Old/New User counter
    onShowAskerCounter(){
        //console.log(this.state.date);

        Meteor.call('getAskerStatistic',this.state.date._d,(e,result)=>{
            console.log(result);
            this.setState({
                newUserCounter:result.newAskersCounter,
                oldUserCounter:result.oldAskersCounter,
                userIsReady:true
            })
            //console.log(e);

        })

    }
    //Show Grouped Data
    onShowTasksCount(){
        const { startDate , endDate } = this.state.rangeDate; 
        Meteor.call('askerRetention.dailyAnalytic',this.state.date._d,startDate._d,endDate._d,(error,result) => {
            if(!error){
                console.log(result);
                this.setState({
                    taskCounterIsReady:true,
                    taskCounter:result
                })
            }
            else{
                alert(error.message);
            }
            //console.log(this.state.taskCounter);
        })
    }

    //For testing ONLY
    handleGetAllData(){
        Meteor.call('getAllTask',(e,result) => {
            this.setState({
                fullData:result
            })
            console.log(result);
        })
    }

    /* --------------ALL RENDER FUNCTION-------------- */
    //Trigger when Complete counting new/old user
    renderUserTable(){

        let dateData = moment(this.state.date).format("DD/MM/YYYY");
        return(
            <div id="userCounterTable">
                <table className="table table-bordered">
                    <tbody>
                        <tr id="timerow">
                            <th>Ngày thống kê</th>
                            <td>{dateData}</td>
                        </tr>
                        <tr id="newUser">
                            <th>Khách hàng mới</th>
                            <td>{this.state.newUserCounter}</td>
                        </tr>
                        <tr id="oldUser">
                            <th>Khách hàng cũ</th>
                            <td>{this.state.oldUserCounter}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }


    //Render Task Count table
    //Consider Vertical and Horizontal Table
    renderTaskCountTable(){
        return(
            <div id="tasksCountTable">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>KH mới</th>
                            <th>KH cũ</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.taskCounter.taskCounterGroupedByDay.groupedData.map((taskCounted,index)=>{
                        console.log(taskCounted)
                        let { day , month , year} = taskCounted._id;
                        let taskDate = moment().date(day).month(month - 1).year(year).format('DD-MM-YYYY');
                        return(
                            <tr key={index}>
                                <td>{taskDate}</td>
                                <td>{taskCounted.tasksDoneByNewAskerCounter}</td>
                                <td>{taskCounted.tasksDoneByOldAskerCounter}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        )
    }


    //Main Render Function
    render(){
        //console.log(this.props);
        const { startDate , endDate } = this.state.rangeDate;
        return(
        <div className="container" id="askerRetentionContainer" style={{textAlign:'center'}}>
            <h1>Asker Retention</h1>
            <label forhtml="singleday" style={{marginRight:10}}>Ngày thống kê</label>
            <SingleDatePicker
                    isOutsideRange={()=> false}
                    displayFormat="DD/MM/YYYY"
                    date={this.state.date} // momentPropTypes.momentObj or null
                    onDateChange={date => this.setState({ date })} // PropTypes.func.isRequired
                    focused={this.state.focused} // PropTypes.bool
                    onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                    id="singleday" // PropTypes.string.isRequired,
            />
            
            {/* Range Choose */}
            <label style={{margin:"0 10px 0 10px"}} className="label label-info">Range</label>
            <DateRangePicker
                displayFormat="DD/MM/YYYY"
                startDate={startDate} // momentPropTypes.momentObj or null,
                startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                endDate={endDate} // momentPropTypes.momentObj or null,
                endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                isOutsideRange={()=> false}
                onDatesChange={({ startDate, endDate }) => 
                    this.setState({ 
                        rangeDate:{
                            startDate:startDate,
                            endDate:endDate
                            } 
                        })
                } // PropTypes.func.isRequired,
                focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
            />
            <button className="btn btn-primary" style={{marginLeft: 20}} onClick={this.onShowAskerCounter}>Lấy số lượng KH mới và cũ</button>
            <button className="btn btn-secondary" style={{marginLeft: 20}} onClick={this.onShowTasksCount}>Lấy Thống kê theo ngày</button>
            <button className="btn btn-info" style={{marginLeft: 20}} onClick={this.handleGetAllData}>Get All Data</button>

            <div id="usersCountContainer">
                {this.state.userIsReady === false ?
                    <div>No Data</div>: this.renderUserTable() 
                }
            </div>
            <div id="tasksCountContainer">
                {this.state.taskCounterIsReady === false ?
                    <div>Chọn ngày thống kê và Range để thống kê </div>:
                    this.renderTaskCountTable()
                }
            </div>
        </div>   
        )
    }
}