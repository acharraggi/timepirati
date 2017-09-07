import {Config, CognitoIdentityCredentials} from 'aws-sdk'
import {
  CognitoUserPool,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js'
import appConfig from './awsconfig'
import React from 'react'
// import {observer} from 'mobx-react'

Config.region = appConfig.region
Config.credentials = new CognitoIdentityCredentials({
  IdentityPoolId: appConfig.IdentityPoolId
})

const userPool = new CognitoUserPool({
  UserPoolId: appConfig.UserPoolId,
  ClientId: appConfig.ClientId
})

/* @observer */ export default class SignUp extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      errorMsg: ''
    }
  }

  handleEmailChange (e) {
    this.setState({email: e.target.value})
  }

  handlePasswordChange (e) {
    this.setState({password: e.target.value})
  }

  handleSubmit (e) {
    e.preventDefault()
    const email = this.state.email.trim()
    const password = this.state.password.trim()
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email
      })
    ]
    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        console.log(err)
        this.setState({errorMsg: err.message})
        return
      }
      console.log('user name is ' + result.user.getUsername())
      console.log('call result: ' + result)
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
          <input type='submit' />
        </form>
        <p>{this.state.errorMsg}</p>
      </div>
    )
  }
}
