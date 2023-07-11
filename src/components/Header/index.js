import {withRouter, Link} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'

import Cookies from 'js-cookie'

import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const Logout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <ul className="headerBox">
      <li className="button" type="button">
        <Link className="linkButton" to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="logoImage"
            alt="website logo"
          />
        </Link>
      </li>

      <li className="middleBox">
        <button className="button" type="button">
          <Link className="linkButton" to="/">
            <h1 className="homeButton">Home</h1>
          </Link>
        </button>

        <button className="button" type="button">
          <Link className="linkButton" to="/jobs">
            <h1 className="homeButton">jobs</h1>
          </Link>
        </button>
      </li>

      <button className="logoutButton" onClick={Logout} type="button">
        Logout
      </button>

      <li className="rightSideBox">
        <button className="button" type="button">
          <Link className="linkButton" to="/">
            <AiFillHome size="30" className="icon" />
          </Link>
        </button>

        <li className="button" type="button">
          <Link className="linkButton" to="/">
            <BsBriefcaseFill size="30" className="icon" />
          </Link>
        </li>

        <button className="button" onClick={Logout} type="button">
          <FiLogOut size="30" className="icon" />
        </button>
      </li>
    </ul>
  )
}

export default withRouter(Header)
