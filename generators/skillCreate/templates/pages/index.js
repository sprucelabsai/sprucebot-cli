import React from 'react'
import Link from 'next/link'
import Page from '../containers/Page'

const DeveloperPage = ({userAgent}) => (
  <div>
    <h1>Hello new Developer!</h1>
    <h2>I come pre-configured with a few different pages:</h2>
    <ul>
      <li><Link href='/marketing'>Marketing Page</Link></li>
      <li><Link href='/owner'>Owner Page</Link></li>
    </ul>
    <h2>I also come with some handy props!</h2>
    <ul>
      <li>userAgent: {userAgent}</li>
    </ul>
    <h2>🌲 🤖</h2>
  </div>
)

export default Page(DeveloperPage)
