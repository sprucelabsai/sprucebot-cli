import {Component} from 'react'

const Page = (Wrapped) => class extends Component {
  static async getInitialProps ({ req }) {
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
    return {userAgent}
  }
  render () {
    return <Wrapped {...this.props} />
  }
}

export default Page
