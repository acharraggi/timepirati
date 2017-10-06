import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser
} from 'amazon-cognito-identity-js'
import appConfig from '../awsconfig'
import React from 'react'
import {observer} from 'mobx-react'
import AWS from 'aws-sdk'
import { util } from 'aws-sdk/global'
AWS.config.region = appConfig.region

const userPool = new CognitoUserPool({
  UserPoolId: appConfig.UserPoolId,
  ClientId: appConfig.ClientId
})
let userData = {
  Username: '...', // your username here
  Pool: userPool
}

@observer export default class SignIn extends React.Component {
  constructor (props) {
    super(props)
    this.userStore = props.rootStore.userStore
    this.projectStore = props.rootStore.projectStore
    let emailid
    if (this.userStore.rememberUser) {
      emailid = this.userStore.userName
    } else {
      emailid = ''
    }
    this.state = {
      email: emailid,
      password: '',
      errorMsg: '',
      rememberMe: this.userStore.rememberUser
    }
  }

  handleEmailChange (e) {
    this.setState({email: e.target.value})
  }

  handlePasswordChange (e) {
    this.setState({password: e.target.value})
  }

  handleRememberMeChange (e) {
    // console.log('Remember me change: ' + e.target.value)
    this.setState({rememberMe: !this.state.rememberMe})
  }

  handleSubmit (e) {
    e.preventDefault()
    const authenticationData = {
      Username: this.state.email.trim(),
      Password: this.state.password.trim()
    }
    const authenticationDetails = new AuthenticationDetails(authenticationData)
    userData.Username = authenticationData.Username
    this.userStore.setUser(authenticationData.Username)
    this.userStore.setRememberUser(this.state.rememberMe)
    let cognitoUser = new CognitoUser(userData)
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => { // result is idToken, refreshToken, accessToken
        console.log('sign in success, getIdToken = ' + result.idToken.jwtToken)
        const payload = result.idToken.jwtToken.split('.')[1]
        const resultJson = JSON.parse(util.base64.decode(payload).toString('utf8'))
        console.log('IdToken + ' + JSON.stringify(resultJson, null, 4))
        this.userStore.userHasAuthenticated(true, result.idToken.jwtToken)
        this.setState({errorMsg: 'Sign in successful!'})
      },
      onFailure: (err) => {
        this.userStore.userHasAuthenticated(false)
        this.setState({errorMsg: err.toString()})
      }
    })
  }

  render () {
    return (
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input type='text'
            value={this.state.email}
            placeholder='Email'
            onChange={this.handleEmailChange.bind(this)} />
          <input type='password'
            value={this.state.password}
            placeholder='Password'
            onChange={this.handlePasswordChange.bind(this)} />
          <br />
          <label>Remember my email id?
            <input
              name='rememberMe'
              type='checkbox'
              checked={this.state.rememberMe}
              onChange={this.handleRememberMeChange.bind(this)} />
          </label>
          <br />
          <input type='submit' />
        </form>
        <p>{this.state.errorMsg}</p>
      </div>
    )
  }
}
