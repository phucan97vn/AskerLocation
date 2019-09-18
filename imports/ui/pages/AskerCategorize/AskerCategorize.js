import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

export default class AskerCategorize extends Component{
    
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



      render(){
          return(
              <div>
                  <h1>Phân nhóm Asker</h1>
                  <button className="btn btn-info">Pie Chart</button>
                  <button className="btn btn-secondary">Column Chart</button>
              </div>
          )
      }
}