import React, { Component } from 'react';
import Meteor from 'meteor/meteor'; 
import PropTypes from 'prop-types';

//Render
export default class VerifyLogin extends React.Component{
  
  constructor(props){
    super(props);
    this.state = {
      verificationCode : '',
      isVerified: false,
    }
    this.handleVerify = this.handleVerify.bind(this);
    this.handleAbort = this.handleAbort.bind(this);
  }

  componentWillMount() {
    if (this.props.loggedIn) {
      return this.props.history.push('/profile');
    }
  }
  
  //Only use when understand
  // shouldComponentUpdate(nextProps) {
  //   if (nextProps.loggedIn) {
  //     nextProps.history.push('/profile');
  //     return false;
  //   }
  //   return true;
  // }

  //Handle submit verification Code
  handleVerify(){
    // this.props.showLoading(true);
    const { verificationCode } = this.state;
    twoFactor.verifyAndLogin(verificationCode, (error, res) => {
        if(!error){
        this.setState({
            isVerified: true
        })
        this.props.history.push('/profile');
    }
    });
  }
  //Handle Abort
  handleAbort(){
    twoFactor.abort();
    this.props.history.push('/login');
  }

  render(){
    return(
      
      <div id="VerifyLogin" className="container">
        <label htmlFor="verifyCode">Verify Code</label>
        <div className="input-group col-xs-4">
          <input 
            type="text" 
            id="verifyCode" 
            className="form-control"
            placeholder="Enter the Verification Code" 
            value={this.state.verificationCode}
            onChange={e => this.setState({verificationCode: e.target.value})}
          />
          <div>
                  <button type="button" className="btn btn-primary" onClick={this.handleVerify}>
                      Verify
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={this.handleAbort}>
                      Abort
                  </button>
          </div>
        </div>
      </div>
      )
    }
}


VerifyLogin.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};