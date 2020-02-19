import React, { Component } from 'react'

export default class extends Component {
  static getInitialProps ({ query: { data } }) {
    return { data: data }
  }

  render () {
    console.log("page recevied: " + this.props.data);
    return <div>
      <p>
        data loaded: {this.props.data}
      </p>
    </div>
  }
}