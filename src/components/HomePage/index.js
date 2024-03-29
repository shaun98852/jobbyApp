import {Component} from 'react'
import {Link} from 'react-router-dom'

import Header from '../Header'
import './index.css'

class Home extends Component {
  render() {
    return (
      <div className="homeBox">
        <Header />
        <div className="details">
          <h1 className="homeHeading">Find The Job That Fits Your Life</h1>
          <p className="homeParagraph">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs" className="jobLink">
            <button className="findJobButton" type="button">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    )
  }
}

export default Home
