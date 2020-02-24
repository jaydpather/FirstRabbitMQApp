import React, { Component } from 'react'
import Layout from '../components/MyLayout';
const axios = require('axios');

export default class extends Component {
  static async getInitialProps(ctx) {
    //todo: handle error. (what if microservice fails to respond?)
    //todo: test case of real URL, not localhost.
    //  * when it runs on server, does it get a 404?
    //    * if not, does it go to the network instead of truly loading from localhost?
    let response = await axios.get('http://localhost:3000/data/getRandomNumber');
    return response.data;
  }

  render () {
    return (
      <Layout>
        <p>
          data loaded: {this.props.data}
        </p>
      </Layout>
    )
  }
}