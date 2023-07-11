import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'

import {BsSearch, BsBriefcaseFill} from 'react-icons/bs'
import {GoStar} from 'react-icons/go'
import {MdLocationOn} from 'react-icons/md'

import Loader from 'react-loader-spinner'
import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const jobsSwitchList = {
  isLoading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
  noItemsFound: 'NOITEMSFOUND',
}

class JobsRoute extends Component {
  state = {
    profileDetails: [],
    gotProfileOrNot: false,
    gotJobsOrNot: false,
    employmentTypes: [],
    salaryRange: '',
    searchValue: '',
    foundJobs: [],
  }

  componentDidMount() {
    this.getJobDetails()
    this.getProfileDetails()
  }

  radioButtons = event => {
    this.setState({salaryRange: event.target.value}, this.getJobDetails)
  }

  employmentType = event => {
    const {employmentTypes} = this.state
    if (event.target.checked) {
      employmentTypes.push(event.target.value)
    } else {
      const index = employmentTypes.indexOf(event.target.value)
      employmentTypes.splice(index, 1)
    }

    this.setState({employmentTypes}, this.getJobDetails)
  }

  searchDetails = event => {
    this.setState({searchValue: event.target.value})
  }

  getJobDetails = async () => {
    const {searchValue, salaryRange, employmentTypes} = this.state
    this.setState({gotJobsOrNot: jobsSwitchList.loading})

    let employmentDetails
    if (employmentTypes.length !== 0) {
      employmentDetails = employmentTypes.join(',')
    } else {
      employmentDetails = ''
    }
    const impToken = Cookies.get('jwt_token')

    const jobDetailsUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentDetails}&minimum_package=${salaryRange}&search=${searchValue}`

    const optionss = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${impToken}`,
      },
    }
    const responseImp = await fetch(jobDetailsUrl, optionss)
    const finalDetail = await responseImp.json()

    if (responseImp.ok === true) {
      const updatedJobs = finalDetail.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      if (updatedJobs.length === 0) {
        this.setState({gotJobsOrNot: jobsSwitchList.noItemsFound})
      } else if (updatedJobs.length > 0) {
        this.setState({
          foundJobs: updatedJobs,
          gotJobsOrNot: jobsSwitchList.success,
        })
      }
    } else {
      this.setState({gotJobsOrNot: jobsSwitchList.failure})
    }
  }

  getProfileDetails = async () => {
    this.setState({gotProfileOrNot: jobsSwitchList.loading})
    const profileUrl = 'https://apis.ccbp.in/profile'
    const requiredToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${requiredToken}`,
      },
    }
    const responses = await fetch(profileUrl, options)
    const finalResponse = await responses.json()
    if (responses.ok === true) {
      const details = finalResponse.profile_details
      const updatedDetails = {
        name: details.name,
        profileImageUrl: details.profile_image_url,
        shortBio: details.short_bio,
      }
      this.setState({
        profileDetails: updatedDetails,
        gotProfileOrNot: jobsSwitchList.success,
      })
    } else {
      this.setState({gotProfileOrNot: jobsSwitchList.failure})
    }
  }

  loaderFunction = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getProfile = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profileBox">
        <div className="detailBox">
          <img src={profileImageUrl} className="profileImage" alt="profile" />
          <h1 className="nameHeading">{name}</h1>
          <p className="profilePara">{shortBio}</p>
        </div>
      </div>
    )
  }

  noProfileDetails = () => (
    <div className="retryBox">
      <button
        className="retryButton"
        onClick={this.getProfileDetails}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  jobsList = () => {
    const {foundJobs} = this.state
    // const {
    //   companyLogoUrl,
    //   employmentType,
    //   id,
    //   jobDescription,
    //   location,
    //   packagePerAnnum,
    //   rating,
    //   title,
    // } = foundJobs[0]
    return foundJobs.map(eachItem => (
      <li className="background" key={eachItem.id}>
        <Link to={`/jobs/${eachItem.id}`} className="linkStyle">
          <div className="requiredItems">
            <img
              src={eachItem.companyLogoUrl}
              className="logo"
              alt="job details company logo"
            />
            <div className="jobDetails">
              <h1 className="post">{eachItem.title}</h1>
              <div className="ratingBox">
                <GoStar className="starIcon" size="25" />
                <p className="rating">{eachItem.rating}</p>
              </div>
            </div>
          </div>

          <div className="locationDetails">
            <div className="startingSection">
              <div className="location">
                <MdLocationOn className="locationIcon" size="15" />
                <p className="locationArea">{eachItem.location}</p>
              </div>

              <div className="location">
                <BsBriefcaseFill className="locationIcon" size="15" />
                <p className="locationArea">{eachItem.employmentType}</p>
              </div>
            </div>
            <h1 className="package">{eachItem.packagePerAnnum}</h1>
          </div>

          <hr className="lineHorizontal" />
          <h1 className="descriptionHeading">Description</h1>
          <p className="description">{eachItem.jobDescription}</p>
        </Link>
      </li>
    ))
  }

  jobsFailure = () => (
    <div className="failureBox">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failureJob"
        alt="failure view"
      />
      <h1 className="failureHeading">Oops! Something Went Wrong</h1>
      <p className="failurePara">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="retryButton"
        onClick={this.getJobDetails}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  noDetailsFunction = () => (
    <div className="failureBox">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="failureJob"
        alt="no jobs"
      />
      <h1 className="failureHeading">No Jobs Found</h1>
      <p className="failurePara">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  jobSwitchFunction = () => {
    const {gotJobsOrNot} = this.state

    switch (gotJobsOrNot) {
      case jobsSwitchList.success:
        return this.jobsList()
      case jobsSwitchList.failure:
        return this.jobsFailure()
      case jobsSwitchList.loading:
        return this.loaderFunction()
      case jobsSwitchList.noItemsFound:
        return this.noDetailsFunction()
      default:
        return null
    }
  }

  profileSwitchFunction = () => {
    const {gotProfileOrNot} = this.state

    switch (gotProfileOrNot) {
      case jobsSwitchList.success:
        return this.getProfile()
      case jobsSwitchList.failure:
        return this.noProfileDetails()
      case jobsSwitchList.loading:
        return this.loaderFunction()
      default:
        return null
    }
  }

  render() {
    const {searchValue} = this.state
    return (
      <div className="jobRouteContainer">
        <Header />
        <div className="jobsRouteBox">
          <div className="leftSideBox">
            <div className="searchButtonBox">
              <input
                type="search"
                className="searchSpace"
                placeholder="search"
                onChange={this.searchDetails}
                value={searchValue}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="buttonSearch"
                onClick={this.getJobDetails}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.profileSwitchFunction()}

            <hr className="horizontalLine" />

            <div className="typeOfEmployment">
              <h1 className="employmentHeading">Type of Employment</h1>
              <ul className="ulList">
                {employmentTypesList.map(eachItem => (
                  <li className="listItem" key={eachItem.employmentTypeId}>
                    <input
                      type="checkbox"
                      id={eachItem.employmentTypeId}
                      value={eachItem.employmentTypeId}
                      onChange={this.employmentType}
                    />
                    <label
                      htmlFor={eachItem.employmentTypeId}
                      className="labelStyle"
                    >
                      {eachItem.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="horizontalLine" />

            <div className="salarayRangeBox">
              <h1 className="employmentHeading">Salary Range</h1>
              <ul className="ulList">
                {salaryRangesList.map(eachItem => (
                  <li className="listItem" key={eachItem.salaryRangeId}>
                    <input
                      type="radio"
                      id={eachItem.salaryRangeId}
                      name="radioButtons"
                      onChange={this.radioButtons}
                      value={eachItem.salaryRangeId}
                    />
                    <label
                      htmlFor={eachItem.salaryRangeId}
                      className="labelStyle"
                    >
                      {eachItem.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rightBox">
            <div className="searchButtonBoxLarge">
              <input
                type="search"
                className="searchSpace"
                placeholder="search"
                onChange={this.searchDetails}
                value={searchValue}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="buttonSearch"
                onClick={this.getJobDetails}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <ul className="rightSideUl">{this.jobSwitchFunction()}</ul>
          </div>
        </div>
      </div>
    )
  }
}

export default JobsRoute
