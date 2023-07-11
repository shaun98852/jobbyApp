import {Component} from 'react'
import Cookies from 'js-cookie'

import {BsBriefcaseFill} from 'react-icons/bs'
import {GoStar} from 'react-icons/go'
import {MdLocationOn} from 'react-icons/md'
import {FiExternalLink} from 'react-icons/fi'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import './index.css'

const jobsSwitchList = {
  isLoading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class JobItemDetails extends Component {
  state = {
    loadingView: '',
    jobDetails: [],
    lifeAtCompany: [],
    skills: [],
    sameJobs: [],
  }

  componentDidMount() {
    this.getJobItemDetail()
  }

  getJobItemDetail = async () => {
    this.setState({loadingView: jobsSwitchList.isLoading})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const tokens = Cookies.get('jwt_token')
    const option = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${tokens}`,
      },
    }
    const url = `https://apis.ccbp.in/jobs/${id}`
    const response = await fetch(url, option)
    const detail = await response.json()
    console.log(detail)
    if (response.ok === true) {
      const newList = {
        jobDetails: detail.job_details,
        similarJobs: detail.similar_jobs,
      }
      const {jobDetails, similarJobs} = newList

      const jobsList = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        lifeAtCompany: jobDetails.life_at_company,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        skills: jobDetails.skills,
        title: jobDetails.title,
        similarJobs: jobDetails.similar_jobs,
      }

      const {lifeAtCompany, skills} = jobsList

      const skillsList = skills.map(eachItem => ({
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))

      const lifeCompanyList = {
        description: lifeAtCompany.description,
        imageUrl: lifeAtCompany.image_url,
      }

      const sameJobs = similarJobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        loadingView: jobsSwitchList.success,
        jobDetails: jobsList,
        lifeAtCompany: lifeCompanyList,
        skills: skillsList,
        sameJobs,
      })
    } else {
      this.setState({loadingView: jobsSwitchList.failure})
    }
  }

  getDetail = () => {
    const {jobDetails, lifeAtCompany, skills, sameJobs} = this.state

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,

      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails

    const {description, imageUrl} = lifeAtCompany

    // const {name, imageUrl} = skills
    // console.log(lifeAtCompany)

    return (
      <div className="bg">
        <div className="background">
          <div className="requiredItems">
            <img
              src={companyLogoUrl}
              className="logo"
              alt="job details company logo"
            />
            <div className="jobDetails">
              <h1 className="post">{title}</h1>
              <div className="ratingBox">
                <GoStar className="starIcon" size="25" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>

          <div className="locationDetails">
            <div className="startingSection">
              <div className="location">
                <MdLocationOn className="locationIcon" size="15" />
                <p className="locationArea">{location}</p>
              </div>

              <div className="location">
                <BsBriefcaseFill className="locationIcon" size="15" />
                <p className="locationArea">{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>

          <hr className="lineHorizontal" />

          <div className="descriptionBox">
            <h1 className="descriptionHeading">Description</h1>
            <a
              href={companyWebsiteUrl}
              target="blank"
              className="linkedWebsite"
            >
              <div className="websiteAndArrow">
                <p className="websiteLink">Visit</p>
                <FiExternalLink size="20" className="redirectLink" />
              </div>
            </a>
          </div>
          <p className="description">{jobDescription}</p>

          <h1 className="skillsHeading">Skills</h1>

          <ul className="skillsBox">
            {skills.map(eachSkill => (
              <li className="skillList" key={eachSkill.name}>
                <img
                  src={eachSkill.imageUrl}
                  className="skillImage"
                  alt={eachSkill.name}
                />
                <p className="skillPara">{eachSkill.name}</p>
              </li>
            ))}
          </ul>

          <h1 className="companyLife">Life at Company</h1>
          <div className="lifeAtCompanyBox">
            <p className="companyPara">{description}</p>
            <img
              src={imageUrl}
              className="lifeAtCompanyImage"
              alt="life at company"
            />
          </div>
        </div>

        <h1 className="similarJobsHeading">Similar Jobs</h1>

        <ul className="similarJobsBox">
          {sameJobs.map(eachItem => (
            <li className="listBg" key={eachItem.id}>
              <div className="requiredItems">
                <img
                  src={eachItem.companyLogoUrl}
                  className="logo"
                  alt="similar job company logo"
                />
                <div className="jobDetails">
                  <h1 className="post">{eachItem.title}</h1>
                  <div className="ratingBox">
                    <GoStar className="starIcon" size="25" />
                    <p className="rating">{eachItem.rating}</p>
                  </div>
                </div>
              </div>

              {/* <div className="locationDetails"> */}

              {/* </div> */}

              <h1 className="descriptionHeading">Description</h1>
              <p className="description">{eachItem.jobDescription}</p>

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
            </li>
          ))}
        </ul>
      </div>
    )
  }

  failureFuncition = () => (
    <div className="failureBox">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failureImage"
      />
      <h1 className="failureHeading">Oops! Something Went Wrong</h1>
      <p className="retryPara">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="retryButton"
        onClick={this.getJobItemDetail}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  loadingFunction = () => (
    <div className="container-loader" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  switchCaseFunction = () => {
    const {loadingView} = this.state

    console.log(loadingView)
    switch (loadingView) {
      case jobsSwitchList.success:
        return this.getDetail()
      case jobsSwitchList.failure:
        return this.failureFuncition()
      case jobsSwitchList.isLoading:
        return this.loadingFunction()
      default:
        return console.log('hi')
    }
  }

  render() {
    return (
      <div className="itemBackground">
        <Header />
        {this.switchCaseFunction()}
      </div>
    )
  }
}

export default JobItemDetails
