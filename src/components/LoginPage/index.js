import {Component} from 'react'

import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import './index.css'

class LoginPage extends Component {
  state = {username: '', password: '', errorMsg: '', showErrorOrNot: false}

  usernameFunction = event => {
    this.setState({username: event.target.value})
  }

  usernamePassword = event => {
    this.setState({password: event.target.value})
  }

  successFunction = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 1})

    history.replace('/')
  }

  failureFunction = errMsg => {
    this.setState({errorMsg: errMsg, showErrorOrNot: true})
  }

  onSubmitClickButton = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const loginUrl = 'https://apis.ccbp.in/login'
    const details = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(details),
    }

    const response = await fetch(loginUrl, options)

    const detail = await response.json()

    if (response.ok === true) {
      this.successFunction(detail.jwt_token)
    } else {
      this.failureFunction(detail.error_msg)
    }
  }

  render() {
    const {username, password, errorMsg, showErrorOrNot} = this.state
    const jwtTokens = Cookies.get('jwt_token')
    if (jwtTokens !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="loginBg">
        <div className="loginBox">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="websiteLogo"
          />
          <form className="form" onSubmit={this.onSubmitClickButton}>
            <div className="usernameBox">
              <label htmlFor="usernameLabel" className="usernameLabel">
                USERNAME
              </label>
              <input
                type="text"
                id="usernameLabel"
                className="usernameInput"
                placeholder="Username"
                value={username}
                onChange={this.usernameFunction}
              />
            </div>

            <div className="usernameBox">
              <label htmlFor="nameInput" className="usernameLabel">
                PASSWORD
              </label>
              <input
                type="password"
                id="nameInput"
                className="usernameInput"
                placeholder="Password"
                value={password}
                onChange={this.usernamePassword}
              />
            </div>

            <button className="submitButton" type="submit">
              Login
            </button>
            {showErrorOrNot && <p className="error">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default LoginPage
