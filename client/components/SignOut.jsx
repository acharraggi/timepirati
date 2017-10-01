import React from 'react'
import {observer} from 'mobx-react'
import {NavLink} from 'react-router-dom'
import {
  CognitoUserPool,
  CognitoUser
} from 'amazon-cognito-identity-js'
import appConfig from './awsconfig.js'

@observer export default class SignUp extends React.Component {
  constructor (props) {
    super(props)
    this.userStore = props.rootStore.userStore
  }
  componentWillMount () {
    if (this.userStore.isAuthenticated) {
      // user is signing out
      const userPool = new CognitoUserPool({
        UserPoolId: appConfig.UserPoolId,
        ClientId: appConfig.ClientId
      })
      let userData = {
        Username: this.userStore.userName,
        Pool: userPool
      }
      let cognitoUser = new CognitoUser(userData)
      console.log('calling Cognito signOut')
      cognitoUser.signOut()
      this.userStore.userHasAuthenticated(false)
    }
  }
  render () {
    return (
      <div>
        <p>Thank you for using TimePirati. You are now signed out.</p>
        <NavLink to='/signin'>Sign in again</NavLink>
      </div>
    )
  }
}
