import React, { Component } from 'react';

export default class Server extends Component {
  constructor() {
    super();
    this.state = {
      weather: 'Not yet gotten',
    };
  }
  componentDidMount = () => {};
  render() {
    return (
      <div>
        <h1> The Server test</h1>
      </div>
    );
  }
}
