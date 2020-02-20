import React, { Component } from 'react'
import Layout from '../components/MyLayout';
const axios = require('axios');

export default class extends Component {
  constructor(props){
    super(props);

    var self = this;
    self.state = { data : "loading..."}
    axios({
      method: 'get',
      url: 'http://localhost:3000/data/getRandomNumber',
      responseType: 'json'
    }).then(function(response){
        //todo: data loaded twice when using SSR
        self.setState(response.data);
      })
      .catch(function(error){
        console.log("error"); //todo: display error message to user
      });
  }

  render () {
    return (
      <Layout>
        <p>
          data loaded: {this.state.data}
        </p>
      </Layout>
    )
  }
}