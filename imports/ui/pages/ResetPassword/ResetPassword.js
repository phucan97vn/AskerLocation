import React from 'react';

import './ResetPassword.scss';
import { Accounts } from 'meteor/accounts-base';

export default class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: '',
    };
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }
  //Onclick of Reset button
  handleChangePassword() {
    const { token } = this.props.match.params;
    Accounts.resetPassword(token, this.state.newPassword, (e, result) => {
      if (!e) {
        console.log('New Password has been set');
      } else {
        console.log('Error');
      }
    });
    alert('Your password has been changed successfully');
  }

  render() {
    //console.log(this.props.match.params.token);
    return (
      <div className="changePassword-page text-center">
        <h1>Reset Your Password</h1>
        <div className="container">
          <input
            type="password"
            id="new-password"
            className="form-control"
            placeholder="Enter your new password"
            value={this.state.newPassword}
            onChange={e => this.setState({ newPassword: e.target.value })}
          />
          <button
            type="button"
            className="btn btn-info"
            onClick={this.handleChangePassword}
          >
            Reset Password
          </button>
        </div>
      </div>
    );
  }
}
