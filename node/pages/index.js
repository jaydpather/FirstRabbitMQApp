import React, { Component } from 'react'
import Layout from '../components/MyLayout';
const axios = require('axios');

export default class extends Component {
  static async getInitialProps(ctx) {
    //todo: handle error. (what if microservice fails to respond?)
    //todo: test case of real URL, not localhost.
    //  * when it runs on server, does it get a 404?
    //    * if not, does it go to the network instead of truly loading from localhost?

    console.log("getInitialProps")
    let response = await axios.get('http://localhost:5000/data/RandomNumbers/InsertOne');

    return response.data;
  }

  render () {
    console.log("rendering") //todo: why do we see this log message on both server and console when doing SSR?
    return (
      <Layout>
        <p>
          data loaded: {this.props.Value}
        </p>
      </Layout>
    )
  }
}