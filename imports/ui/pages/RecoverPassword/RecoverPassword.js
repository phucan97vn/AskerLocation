import React from 'react';

import './RecoverPassword.scss';
import { Accounts } from 'meteor/accounts-base';

export default class RecoverPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resetEmail: '',
    };
    this.handleReset = this.handleReset.bind(this);
  }
  //Onclick of Reset button
  handleReset() {
    const { resetEmail } = this.state;
    Accounts.forgotPassword({ email: resetEmail }, e => {
      if (!e) {
        console.log('Reset Password Email Sent');
      } else {
        console.log(' Cannot send email ');
      }
    });
  }

  render() {
    return (
      <div className="forgotPassword-page text-center">
        <h1>Forgot Password Page</h1>
        <div className="container">
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter your account Email"
            value={this.state.resetEmail}
            onChange={e => this.setState({ resetEmail: e.target.value })}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={this.handleReset}
          >
            Send via Email
          </button>
        </div>
      </div>
    );
  }
}
