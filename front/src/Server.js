import React, { Component } from 'react';
import axios from 'axios';
export default class Server extends Component {
  constructor() {
    super();
    this.state = {
      email: 'Not yet gotten',
    };
  }
  componentDidMount = () => {
    axios.get('/api/users').then((res) => {
      console.log(res);
      this.setState({
        email: res.data[0].email,
      });
    });
  };
  render() {
    return (
      <div>
        <h1> The Server test is email : {this.state.email}</h1>
      </div>
    );
  }
}
