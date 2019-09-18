import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import 'react-dates/initialize';
import {
    SingleDatePicker,
    DateRangePicker,
} from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

const tableHeaderStyle={
    width: '120px',
};

const rowDataStyle={
    borderTopStyle: 'solid', 
    borderWidth: 1
}

export default class AskerRetention extends Component{
    constructor(props){
        super(props);
        this.state = {
            date : null,
            rangeDate:{
                startDate : null,
                endDate : null,
            },

            newUserList:null,
            oldUserList:null,

            newUserCounter:0,
            oldUserCounter:0,
            taskCounter:null,

            userIsReady:false,
            taskCounterIsReady:false,
            
            showIds : null,

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
                newUserList:result.newAskers,
                oldUserList:result.oldAskers,
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

    onShowIds(ids){
        if(ids.length > 0){
            this.setState({ showIds : ids});
        }
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
        let dateData = moment(this.state.date).format("DD/MM/YYYY");
        const cellWidth = 50;
        const { newUserCounter, } = this.state;
        return(
    
            /* ----------------------- Render Table Vertically Using Flexbox-----------------------*/
            <div style={{display:'flex',flexDirection:'row',marginTop: 30, marginBottom:30}}>
                <div>
                    <div style={{tableHeaderStyle,fontWeight:'bold'}}>Ngày thống kê</div>
                    <div style={{tableHeaderStyle,fontWeight:'bold'}}>Khách hàng mới</div>
                    <div style={{tableHeaderStyle,fontWeight:'bold'}}>Khách hàng cũ</div>
                </div>

                <div style={{width: 120, borderStyle: 'solid', borderWidth: 1, textAlign: 'center', backgroundColor: 'antiquewhite'}}>
                        <div style={rowDataStyle}>{dateData}</div>
                        <div 
                        style={rowDataStyle} 
                        onClick={()=>{this.onShowIds()}}>{this.state.newUserCounter}</div>
                        <div 
                        style={rowDataStyle} 
                        onClick={this.onShowIds()}>{this.state.oldUserCounter}</div>
                </div>


                {this.state.taskCounter.taskCounterGroupedByDay.groupedData.map((taskCounted,index)=>{
                    console.log(taskCounted)
                    let { day , month } = taskCounted._id;
                    let taskDate = moment().date(day).month(month - 1).format('DD-MM');
                    return(
                        <div key={index} style={{width: cellWidth,borderStyle: 'solid', borderWidth: 1, borderLeft: 'none', textAlign: 'center'}}>
                            <div style={rowDataStyle}>{taskDate}</div>
                            <div style={rowDataStyle}>{taskCounted.tasksDoneByNewAskerCounter}</div>
                            <div style={rowDataStyle}>{taskCounted.tasksDoneByOldAskerCounter}</div>
                        </div>
                    )
                })}
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
            {
                this.state.showIds && this.state.showIds.length > 0 ? 
                (<div>
                    <div> Chi tiet cac userId</div>
                    {
                        this.state.showIds.map((id,index)=>{
                            return(
                                <div>{index + 1}.{id}</div>
                            )
                        })
                    }
                </div>
                ): null
                })
                
            }
        </div>   
        )
    }
}