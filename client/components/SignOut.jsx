import React from 'react'
import {observer} from 'mobx-react'
import {NavLink} from 'react-router-dom'

export default class SignUp extends React.Component {

  render () {
    return (
      <div>
        <p>Thank you for using TimePirati. You are now signed out.</p>
        <NavLink to='/signin'>Sign in again</NavLink>
      </div>
    )
  }
}
