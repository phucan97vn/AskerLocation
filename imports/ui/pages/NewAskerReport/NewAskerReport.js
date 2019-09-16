import { Meteor } from 'meteor/meteor';
import React from 'react';

import 'react-dates/initialize';
import {
  DateRangePicker,
} from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';


export default class NewAskerReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //filterType: "Day",
      startDate: null,
      endDate: null,
      
      isReady : false,

      askers: null,
      filteredData:{},
            
    }
    this.handleOnClick = this.handleOnClick.bind(this);
    // this.handleSelect = this.handleSelect.bind(this);
    this.handleQueryData = this.handleQueryData.bind(this);
  }

  //Select Option
  // handleSelect(event){
  //   this.setState({
  //     filterType: event.target.value
  //   })
  // }

  //Get all Users
  handleOnClick() {
    //console.log("Here");
    const {endDate,startDate} = this.state;
    Meteor.call('getUser',(e, result) => {
      this.setState({
        askers: result,
      });
      //console.log(startDate._d);
      console.log(result);
    });
  }

  //Query data
  handleQueryData(){
    const { startDate,endDate } = this.state ;
    //Start of startDate and End of endDate instead of 12:00 of those days.
    var startDateCal = moment(startDate).startOf('date').toDate();
    var endDateCal = moment(endDate).endOf('date').toDate();
    // console.loglog(startDateCal);
    // console.log(endDateCal)

    //console.log("startDate: "+ startDateCal)
    //console.log("endDate: "  + endDateCal);
    Meteor.call('getGroupingDataByDay',startDateCal,endDateCal,(e,result)=>{
      this.setState({        
        filteredData:result,
        isReady: true,
      })

    //console.log(this.state.filteredData);
      
    })
  }
   
  renderRow(){
    if(this.state.filteredData === null){
      return null
    }
    //console.log(this.state.filteredData.userGrouped);
    return this.state.filteredData.userGrouped.map((data,index)=>{
      const { _id,askerCounter,askerPostCounter } = data;
      //Date
      var dataDate = new Date();
      var dataDate = _id.day + '/' + _id.month + '/' + _id.year;
      //Counter
      var showAskerCounter = askerCounter.toLocaleString();
      var showAskerPostCounter = askerPostCounter.toLocaleString();
      //console.log(dataDate);
      return(
        <tr key={index}>
          <td>{dataDate}</td>
          <td>{showAskerCounter}</td>
          <td>{showAskerPostCounter}</td>
        </tr>
      )
    })
  }
  //Check if User has login or not?
  //If User hasn't login . User will be push back to login page.
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

  // componentWillUnmount(){
  //   this.setState({
  //     isReady:false 
  //   })
  // };

  render() {
    // const { askerCounter,_id } = this.state.filteredData;
    // const askerDay = new Date(_id.year,_id.month,_id.day);
    return (
      <div className="container" style={{textAlign:"center"}}>
        <h1>Thống kê Khách hàng mới</h1>

        {/* Filter Dropdown List */}
        {/* <label forhtml="formSelect">Group by</label>
        <select className="custom-select mr-sm-2" value={this.state.filterType} onChange={this.handleSelect}>
          <option value="Day">Day</option>
          <option value="Week">Week</option>
          <option value="Month">Month</option>
        </select> */}
        
        {/* Range Choose */}
        <DateRangePicker
          displayFormat="DD/MM/YYYY"
          startDate={this.state.startDate} // momentPropTypes.momentObj or null,
          startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
          endDate={this.state.endDate} // momentPropTypes.momentObj or null,
          endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
          isOutsideRange={()=> false}
          onDatesChange={({ startDate, endDate }) => 
            this.setState({ startDate, endDate })
          } // PropTypes.func.isRequired,
          focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
        />
        {/* <button type="button" className="btn btn-primary" onClick={this.handleOnClick}>
          ShowData
        </button> */}
        <button type="button" className="btn btn-primary" onClick={this.handleQueryData} style={{marginLeft:20}}>
          Thống kê
        </button>
        {/* Data Table */}
        <div>
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th>Ngày</th>
                <th>Asker Đăng ký</th>
                <th>Asker post trong ngày</th>
              </tr>  
            </thead>
            <tbody>
              {this.state.isReady === false ? 
                (<tr><td>No Data</td></tr>):
                this.renderRow()
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

